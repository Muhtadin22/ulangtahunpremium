"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";

interface FloatingHeartProps {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}

const HEART_ITEMS: FloatingHeartProps[] = [
  { position: [-2.8, 0.8, -1.2], scale: 0.34, color: "#9333EA", speed: 1.1 },
  { position: [-1.4, -0.9, -0.8], scale: 0.25, color: "#C084FC", speed: 1.4 },
  { position: [1.5, 1.0, -1.0], scale: 0.3, color: "#7E22CE", speed: 1.2 },
  { position: [2.7, -0.5, -1.4], scale: 0.36, color: "#D8B4FE", speed: 1.0 },
  { position: [0.1, 1.4, -1.8], scale: 0.28, color: "#A855F7", speed: 1.3 },
  { position: [-0.4, -1.3, -1.5], scale: 0.24, color: "#6B21A8", speed: 1.5 },
];

function MiniHeart({
  geometry,
  position,
  scale,
  color,
  speed,
}: FloatingHeartProps & { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.45 * speed;
  });

  return (
    <Float speed={speed * 1.4} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.14}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function ClosingParticlesScene() {
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.32);
    shape.bezierCurveTo(0, 0.55, -0.35, 0.72, -0.58, 0.52);
    shape.bezierCurveTo(-0.88, 0.25, -0.68, -0.22, 0, -0.68);
    shape.bezierCurveTo(0.68, -0.22, 0.88, 0.25, 0.58, 0.52);
    shape.bezierCurveTo(0.35, 0.72, 0, 0.55, 0, 0.32);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
    geom.center();
    return geom;
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.8} color="#2E1065" />
      <directionalLight position={[3, 4, 4]} intensity={1.6} color="#E9D5FF" />
      <directionalLight position={[-3, -2, 3]} intensity={1.2} color="#9333EA" />

      <Sparkles
        count={75}
        scale={[7.5, 4.5, 3]}
        size={2.8}
        speed={0.35}
        opacity={0.85}
        color="#C084FC"
      />

      {HEART_ITEMS.map((item, index) => (
        <MiniHeart key={index} geometry={heartGeometry} {...item} />
      ))}
    </Canvas>
  );
}