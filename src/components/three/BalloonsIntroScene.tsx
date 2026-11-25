"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";

interface BalloonsIntroSceneProps {
  isLaunching: boolean;
  onBalloonTap: () => void;
}

interface BalloonSpec {
  position: [number, number, number];
  color: string;
  metalness: number;
  scale: number;
  speed: number;
}

const BALLOONS: BalloonSpec[] = [
  { position: [-2.4, -0.35, -0.6], color: "#7E22CE", metalness: 0.35, scale: 0.92, speed: 1.1 },
  { position: [-1.15, 0.85, -1.2], color: "#C084FC", metalness: 0.45, scale: 0.82, speed: 1.25 },
  { position: [1.3, 0.75, -0.9], color: "#4C1D95", metalness: 0.4, scale: 0.88, speed: 1.18 },
  { position: [2.45, -0.35, -0.5], color: "#A855F7", metalness: 0.35, scale: 0.96, speed: 1.05 },
  { position: [-0.25, -1.35, -1.4], color: "#2E1065", metalness: 0.5, scale: 0.78, speed: 1.3 },
  { position: [0.65, -1.55, -1.6], color: "#D8B4FE", metalness: 0.4, scale: 0.74, speed: 1.2 },
];

function GlossyBalloon({
  position,
  color,
  metalness,
  scale,
  speed,
  isLaunching,
  onTap,
}: BalloonSpec & { isLaunching: boolean; onTap: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isLaunching) {
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 6.5 * speed, delta * 1.8);
      groupRef.current.position.y += velocityRef.current * delta;
      groupRef.current.rotation.z += delta * 0.35;
    } else {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.16;
      groupRef.current.rotation.z = Math.sin(t * 0.8 + position[0]) * 0.06;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Badan Balon Satin Metalik */}
      <mesh scale={[1, 1.18, 1]}>
        <sphereGeometry args={[0.72, 40, 40]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          metalness={metalness}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
        />
      </mesh>

      {/* Simpul Bawah */}
      <mesh position={[0, -0.86, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.1, 0.15, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.22} metalness={metalness} clearcoat={0.8} />
      </mesh>

      {/* Tali Lilac Metalik Tipis */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 1.45, 8]} />
        <meshStandardMaterial color="#D8B4FE" metalness={0.7} roughness={0.25} opacity={0.55} transparent />
      </mesh>
    </group>
  );
}

function AmethystGlassHeart({ isLaunching, onTap }: { isLaunching: boolean; onTap: () => void }) {
  const heartRef = useRef<THREE.Mesh>(null);

  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.32);
    shape.bezierCurveTo(0, 0.55, -0.35, 0.72, -0.58, 0.52);
    shape.bezierCurveTo(-0.88, 0.25, -0.68, -0.22, 0, -0.68);
    shape.bezierCurveTo(0.68, -0.22, 0.88, 0.25, 0.58, 0.52);
    shape.bezierCurveTo(0.35, 0.72, 0, 0.55, 0, 0.32);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.14,
      curveSegments: 32,
    });
    geom.center();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!heartRef.current) return;
    heartRef.current.rotation.y += delta * 0.55;
    if (isLaunching) {
      heartRef.current.position.y += delta * 5.2;
      heartRef.current.scale.lerp(new THREE.Vector3(1.25, 1.25, 1.25), delta * 2);
    } else {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.04;
      heartRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.75}>
      <mesh
        ref={heartRef}
        geometry={heartGeometry}
        position={[0, 0.15, 0.45]}
        onClick={(e) => {
          e.stopPropagation();
          onTap();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <meshPhysicalMaterial
          color="#C084FC"
          emissive="#4C1D95"
          emissiveIntensity={0.35}
          transmission={0.72}
          opacity={1}
          transparent
          roughness={0.06}
          ior={1.48}
          thickness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
    </Float>
  );
}

export default function BalloonsIntroScene({
  isLaunching,
  onBalloonTap,
}: BalloonsIntroSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.2], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.65} color="#2E1065" />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#E9D5FF" />
      <directionalLight position={[-5, 2, 4]} intensity={1.5} color="#9333EA" />
      <pointLight position={[0, -2, 3]} intensity={1.4} color="#C084FC" />

      <Environment preset="night" environmentIntensity={0.6} />

      <Sparkles
        count={55}
        scale={[8.5, 6.5, 4]}
        size={2.8}
        speed={0.35}
        opacity={0.85}
        color="#D8B4FE"
      />

      {BALLOONS.map((balloon, idx) => (
        <GlossyBalloon
          key={idx}
          {...balloon}
          isLaunching={isLaunching}
          onTap={onBalloonTap}
        />
      ))}

      <AmethystGlassHeart isLaunching={isLaunching} onTap={onBalloonTap} />
    </Canvas>
  );
}