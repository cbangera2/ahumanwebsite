"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Billboard, Environment } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type GeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][] | number[][][][];
    };
    properties?: Record<string, unknown>;
  }>;
};

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function useWorldOutlines(radius = 1.45) {
  const [rings, setRings] = useState<THREE.Vector3[][]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch("./data/world-geo.json")
      .then((r) => r.json())
      .then((geo: unknown) => {
        if (cancelled) return;
        const isGeo = (g: unknown): g is GeoJSON =>
          !!g && typeof g === "object" && Array.isArray((g as { features?: unknown }).features);
        if (!isGeo(geo)) {
          // Fallback: draw nothing if data missing
          setRings([]);
          return;
        }
        const newRings: THREE.Vector3[][] = [];
        const addRing = (ring: number[][]) => {
          const pts: THREE.Vector3[] = [];
          for (let i = 0; i < ring.length; i++) {
            const [lon, lat] = ring[i];
            const p = latLonToVec3(lat, lon, radius * 1.001);
            pts.push(p);
          }
          if (pts.length) newRings.push(pts);
        };
  for (const f of geo.features) {
          if (!f?.geometry) continue;
          if (f.geometry.type === "Polygon") {
            const coords = f.geometry.coordinates as number[][][];
            for (const ring of coords) addRing(ring);
          } else if (f.geometry.type === "MultiPolygon") {
            const polys = f.geometry.coordinates as number[][][][];
            for (const poly of polys) for (const ring of poly) addRing(ring);
          }
        }
        setRings(newRings);
      })
      .catch(() => setRings([]));
    return () => {
      cancelled = true;
    };
  }, [radius]);
  return rings;
}

const palette = {
  base: "#071827", // deep blue-teal, close to site bg
  outline: "#22d3ee", // electric teal
  marker: "#22d3ee",
  markerEmissive: "#22d3ee",
  atmosphere: "#22d3ee",
};

function Atmosphere({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.03, 64, 64]} />
      <meshBasicMaterial color={palette.atmosphere} transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

type FresnelUniforms = {
  color: { value: THREE.Color };
  intensity: { value: number };
};

function FresnelGlow({ radius }: { radius: number }) {
  const uniforms = useMemo<FresnelUniforms>(
    () => ({ color: { value: new THREE.Color(palette.atmosphere) }, intensity: { value: 1.0 } }),
    []
  );
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.01, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms as unknown as Record<string, { value: unknown }>}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.0);
            gl_FragColor = vec4(color, fresnel * 0.35 * intensity);
          }
        `}
      />
    </mesh>
  );
}

function World({ radius = 1.45 }: { radius?: number }) {
  const rings = useWorldOutlines(radius);
  return (
    <group>
      {/* Globe core */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          color={palette.base}
          roughness={0.6}
          metalness={0.05}
          transmission={0.25}
          thickness={0.2}
          ior={1.15}
          clearcoat={0.3}
          clearcoatRoughness={0.8}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Subtle inner core visible through transmission */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 64, 64]} />
        <meshStandardMaterial color="#06131f" emissive="#0ea5b7" emissiveIntensity={0.2} roughness={1} metalness={0} />
      </mesh>
      <Atmosphere radius={radius} />
  <FresnelGlow radius={radius} />
      {/* Country outlines */}
      {rings.map((pts, i) => (
        <Line key={i} points={pts} color={palette.outline} lineWidth={1.2} dashed={false} transparent opacity={0.85} segments={false} />
      ))}
    </group>
  );
}

function GlobeGrid({
  radius = 1.5,
  step = 30,
  color = "#38d8f1",
  opacityLat = 0.22,
  opacityLon = 0.18,
  radiusMul = 1.0005,
  lineWidthLat = 0.6,
  lineWidthLon = 0.6,
  midLatBoost = true,
}: {
  radius?: number;
  step?: number;
  color?: string;
  opacityLat?: number;
  opacityLon?: number;
  radiusMul?: number;
  lineWidthLat?: number;
  lineWidthLon?: number;
  midLatBoost?: boolean;
}) {
  const latLines = useMemo(() => {
    const arr: THREE.Vector3[][] = [];
    for (let lat = -90 + step; lat <= 90 - step; lat += step) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 5) pts.push(latLonToVec3(lat, lon, radius * radiusMul));
      arr.push(pts);
    }
    return arr;
  }, [radius, step, radiusMul]);
  const lonLines = useMemo(() => {
    const arr: THREE.Vector3[][] = [];
    for (let lon = -180; lon < 180; lon += step) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) pts.push(latLonToVec3(lat, lon, radius * radiusMul));
      arr.push(pts);
    }
    return arr;
  }, [radius, step, radiusMul]);
  return (
    <group>
      {latLines.map((pts, i) => (
        <Line key={`lat-${i}`} points={pts} color={color} opacity={opacityLat} transparent lineWidth={midLatBoost && i === Math.floor(latLines.length / 2) ? Math.max(lineWidthLat, 1.0) : lineWidthLat} />
      ))}
      {lonLines.map((pts, i) => (
        <Line key={`lon-${i}`} points={pts} color={color} opacity={opacityLon} transparent lineWidth={lineWidthLon} />
      ))}
    </group>
  );
}

const visited: Array<{ name: string; lat: number; lon: number }> = [
  { name: "USA", lat: 39.8283, lon: -98.5795 }, // near center
  { name: "Canada", lat: 56.1304, lon: -106.3468 },
  { name: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "India", lat: 28.6139, lon: 77.209 },
  { name: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "South Korea", lat: 37.5665, lon: 126.978 },
  { name: "Bahamas", lat: 25.0343, lon: -77.3963 },
];

function VisitedMarkers({ radius = 1.48 }: { radius?: number }) {
  const positions = useMemo(() => visited.map((v) => latLonToVec3(v.lat, v.lon, radius)), [radius]);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={`${visited[i].name}-${i}`} position={pos.toArray() as [number, number, number]}>
          {/* glow halo */}
          <PulsingHalo />
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
              if (typeof document !== "undefined") document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered((h) => (h === i ? null : h));
              if (typeof document !== "undefined") document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color={palette.marker} emissive={palette.markerEmissive} emissiveIntensity={1.15} metalness={0.15} roughness={0.3} />
          </mesh>
          {hovered === i && (
            <Billboard>
              <mesh>
                <ringGeometry args={[0.06, 0.09, 32]} />
                <meshBasicMaterial color={palette.marker} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
              </mesh>
            </Billboard>
          )}
          {hovered === i && (
            <Html center distanceFactor={12} className="pointer-events-none">
              <div className="px-2 py-1 rounded-md text-xs bg-slate-900/95 text-sky-200 ring-1 ring-sky-400/30 shadow-lg">
                {visited[i].name}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function PulsingHalo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.2) * 0.15;
    if (ref.current) ref.current.scale.setScalar(1.6 * s);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.034, 12, 12]} />
      <meshBasicMaterial color={palette.marker} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Rotator({ speed = 0.15, children }: { speed?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * speed;
      ref.current.rotation.x = 0.25;
    }
  });
  return <group ref={ref}>{children}</group>;
}

export default function GlobeSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">Places I&#39;ve Been</h2>
      <div className="relative h-[60vh] w-full rounded-2xl border border-slate-800/70 bg-slate-900/40 overflow-hidden">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 55 }} dpr={[1, 1.5]} className="absolute inset-0">
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 6, 16]} />
          <ambientLight intensity={0.55} color="#38bdf8" />
          <directionalLight position={[5, 5, 5]} intensity={0.7} color="#22d3ee" />
          {/* Low-intensity environment for subtle reflections */}
          <Environment preset="city" />
          <Suspense fallback={null}>
            <Rotator>
              <World radius={1.5} />
              <GlobeGrid radius={1.5} />
              <GlobeGrid radius={1.5} radiusMul={0.998} color="#22d3ee" opacityLat={0.1} opacityLon={0.08} lineWidthLat={0.5} lineWidthLon={0.5} midLatBoost={false} />
              <VisitedMarkers radius={1.53} />
            </Rotator>
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#020617]" />
      </div>
    </section>
  );
}
