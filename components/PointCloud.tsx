"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PLYLoader } from "three-stdlib";
import { useLoader, useThree } from "@react-three/fiber";

type Props = {
	url: string;
	type: "ply" | "pcd";
	color?: string;
	size?: number;
};

function PLYPointCloud({ url, size = 0.01 }: { url: string; size?: number }) {
	const geometry = useLoader(PLYLoader, url) as THREE.BufferGeometry;
	const geom = useMemo(() => geometry.clone(), [geometry]);
	geom.center();
	const hasColors = !!geom.getAttribute("color");
		return (
			<points>
				{/* geom is a BufferGeometry; spread is to pass attributes */}
				<bufferGeometry attach="geometry" {...(geom as unknown as THREE.BufferGeometry)} />
			<pointsMaterial
				attach="material"
				size={size}
				vertexColors={hasColors}
				color={hasColors ? undefined : new THREE.Color("#7dd3fc")}
				transparent
				opacity={0.9}
				blending={THREE.AdditiveBlending}
				depthWrite={false}
			/>
		</points>
	);
}

// Minimal PCD using native loader via THREE (optional). If not present, fallback to PLY-like style.
function PCDPointCloud({ url, color = "#7dd3fc", size = 0.01 }: { url: string; color?: string; size?: number }) {
	const group = useRef<THREE.Group>(null);
		const { gl } = useThree();

	useEffect(() => {
		let mounted = true;
			// Capture ref at effect start to use in async and cleanup
			const groupRef = group.current;
		(async () => {
			const { PCDLoader } = await import("three-stdlib");
			const loader = new PCDLoader();
				loader.load(url, (points: THREE.Points) => {
					if (!mounted || !groupRef) return;
				const material = new THREE.PointsMaterial({
					size,
					color: new THREE.Color(color),
					transparent: true,
					opacity: 0.85,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
				});
				points.material = material;
				points.geometry.center();
					groupRef.add(points);
				// Removed unused expression and 'any' type usage
			});
		})();
		return () => {
			mounted = false;
				// Use captured ref value inside cleanup
				if (groupRef) groupRef.clear();
		};
	}, [url, color, size, gl]);

	return <group ref={group} />;
}

export default function PointCloud({ url, type, color = "#7dd3fc", size = 0.01 }: Props) {
	if (type === "ply") return <PLYPointCloud url={url} size={size} />;
	return <PCDPointCloud url={url} color={color} size={size} />;
}
