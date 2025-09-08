"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useMemo, useRef, Suspense, useState, useMemo as useReactMemo } from "react";
import * as THREE from "three";
import PointCloud from "./PointCloud";
import { useGLTF } from "@react-three/drei";

function usePointCloud(count = 5000) {
	return useMemo(() => {
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const r = 2 + Math.random() * 3;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const x = r * Math.sin(phi) * Math.cos(theta);
			const y = r * Math.sin(phi) * Math.sin(theta);
			const z = r * Math.cos(phi);
			positions.set([x, y, z], i * 3);
		}
		return positions;
	}, [count]);
}

function Starfield({ count = 8000 }: { count?: number }) {
	const positions = usePointCloud(count);
	const ref = useRef<THREE.Points>(null);
	return (
		<Points ref={ref} positions={positions} stride={3} frustumCulled>
			<PointMaterial transparent size={0.01} sizeAttenuation color="#7dd3fc" depthWrite={false} />
		</Points>
	);
}

type Mode =
	| { kind: "starfield" }
	| { kind: "pointcloud"; url: string; type: "ply" | "pcd" }
	| { kind: "model"; url: string; scale?: number }
	| {
			kind: "combo";
			model: { url: string; scale?: number };
			cloud: { url: string; type: "ply" | "pcd"; color?: string; size?: number };
		};

function CarModel({ url, scale = 1 }: { url: string; scale?: number }) {
	const gltf = useGLTF(url);
	return <primitive object={gltf.scene} scale={scale} />;
}

function Scene({ mode, autoRotate }: { mode: Mode; autoRotate: boolean }) {
	const groupRef = useRef<THREE.Group>(null);
	useFrame((_, delta) => {
		if (autoRotate && groupRef.current) {
			groupRef.current.rotation.y += delta * 0.15;
		}
	});
	return (
		<group ref={groupRef}>
			<Suspense fallback={null}>
				{mode.kind === "starfield" && <Starfield />}
				{mode.kind === "pointcloud" && (
					<group>
						<PointCloud url={mode.url} type={mode.type} color="#7dd3fc" size={0.01} />
					</group>
				)}
				{mode.kind === "model" && (
					<group>
						<Environment preset="city" />
						<CarModel url={mode.url} scale={mode.scale ?? 1.2} />
						<ContactShadows opacity={0.35} scale={10} blur={1.8} far={3} resolution={1024} color="#0b1220" position={[0, -1.2, 0]} />
					</group>
				)}
				{mode.kind === "combo" && (
					<group>
						<Environment preset="city" />
						<CarModel url={mode.model.url} scale={mode.model.scale ?? 1.2} />
						<PointCloud url={mode.cloud.url} type={mode.cloud.type} color={mode.cloud.color ?? "#7dd3fc"} size={mode.cloud.size ?? 0.01} />
						<ContactShadows opacity={0.3} scale={12} blur={2} far={3.2} resolution={1024} color="#0b1220" position={[0, -1.25, 0]} />
					</group>
				)}
			</Suspense>
		</group>
	);
}

export default function Hero3D({
	mode,
	autoRotate = true,
}: {
	mode?: Mode;
	autoRotate?: boolean;
}) {
	const defaultModel = useReactMemo(() => ({ url: "./models/DamagedHelmet.glb", scale: 1.6 }), []);
	const defaultCloud = useReactMemo(
		() => ({ url: "./models/adas_lidar.ply", type: "ply" as const, color: "#7dd3fc", size: 0.01 }),
		[]
	);
	const [modeState, setModeState] = useState<Mode>(
		mode ?? {
			kind: "combo",
			model: { url: defaultModel.url, scale: defaultModel.scale },
			cloud: { url: defaultCloud.url, type: defaultCloud.type, color: defaultCloud.color, size: defaultCloud.size },
		}
	);
       // Scroll down handler
       const handleScrollDown = () => {
	       // Scrolls down by the height of the viewport
	       window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
       };
	   return (
		   <div id="hero" className="relative h-[90vh] w-full">
		       {/* Scroll Down button for mobile at top center */}
		       <button
			       className="md:hidden absolute left-1/2 top-4 -translate-x-1/2 z-[100] bg-slate-900/95 text-sky-300 px-5 py-2 rounded-full shadow-2xl border border-sky-400 flex items-center gap-2 animate-bounce"
			       style={{ fontSize: "1.15rem", boxShadow: "0 4px 24px 0 rgba(0,0,0,0.45)" }}
			       onClick={handleScrollDown}
			       aria-label="Scroll down"
		       >
			       <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
			       <span className="font-semibold">Scroll Down</span>
		       </button>
		       <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]} className="absolute inset-0">
			       <color attach="background" args={["#020617"]} />
			       <fog attach="fog" args={["#020617", 4, 12]} />
			       <ambientLight intensity={0.4} />
			       <Scene mode={modeState} autoRotate={autoRotate} />
			       <OrbitControls enablePan={false} enableZoom={false} />
		       </Canvas>
		       {/* Bottom fade to blend into page background */}
		       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#020617]" />
		       {/* Center title */}
		       <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
			       <h1 className="text-white text-7xl md:text-8xl font-bold tracking-tight select-none">Human.</h1>
		       </div>
		       {/* Toggle UI (reveals on hover or focus) */}
		       <div className="absolute right-4 top-4 flex gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-1 text-xs text-slate-300 backdrop-blur opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
			       <button
				       className={`px-2 py-1 rounded ${modeState.kind === "starfield" ? "bg-slate-800 text-sky-300" : "hover:bg-slate-800/70"}`}
				       onClick={() => setModeState({ kind: "starfield" })}
			       >
				       Starfield
			       </button>
			       <button
				       className={`px-2 py-1 rounded ${modeState.kind === "pointcloud" ? "bg-slate-800 text-sky-300" : "hover:bg-slate-800/70"}`}
				       onClick={() => setModeState({ kind: "pointcloud", url: defaultCloud.url, type: defaultCloud.type })}
			       >
				       Cloud
			       </button>
			       <button
				       className={`px-2 py-1 rounded ${modeState.kind === "model" ? "bg-slate-800 text-sky-300" : "hover:bg-slate-800/70"}`}
				       onClick={() => setModeState({ kind: "model", url: defaultModel.url, scale: defaultModel.scale })}
			       >
				       Model
			       </button>
			       <button
				       className={`px-2 py-1 rounded ${modeState.kind === "combo" ? "bg-slate-800 text-sky-300" : "hover:bg-slate-800/70"}`}
				       onClick={() =>
					       setModeState({
						       kind: "combo",
						       model: { url: defaultModel.url, scale: defaultModel.scale },
						       cloud: { url: defaultCloud.url, type: defaultCloud.type, color: defaultCloud.color, size: defaultCloud.size },
					       })
				       }
			       >
				       Combo
			       </button>
		       </div>
	       </div>
	);
}
