"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

interface BentoCakeSceneProps {
  isBlownOut: boolean;
  blowIntensity?: number;
}

function SpiralCandle({
  isBlownOut,
  blowIntensity = 0,
}: {
  isBlownOut: boolean;
  blowIntensity?: number;
}) {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const smokeRef = useRef<THREE.Group>(null);

  const spiralGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 4;
    const height = 0.88;
    const radius = 0.068;
    const segments = 90;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = t * height;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 96, 0.015, 8, false);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (flameRef.current) {
      const targetScale = isBlownOut ? 0 : Math.max(0.35, 1 - blowIntensity * 0.55);
      const nextScale = THREE.MathUtils.lerp(
        flameRef.current.scale.y,
        targetScale,
        delta * 14
      );

      const flicker = isBlownOut
        ? 0
        : Math.sin(t * (16 + blowIntensity * 25)) * (0.05 + blowIntensity * 0.08);

      flameRef.current.scale.set(
        Math.max(0, nextScale + flicker * 0.5),
        Math.max(0, nextScale + flicker),
        Math.max(0, nextScale + flicker * 0.5)
      );

      flameRef.current.rotation.x = THREE.MathUtils.lerp(
        flameRef.current.rotation.x,
        -blowIntensity * 0.85,
        delta * 14
      );
      flameRef.current.rotation.z =
        Math.sin(t * 12) * (0.07 + blowIntensity * 0.25);
    }

    if (lightRef.current) {
      const targetIntensity = isBlownOut
        ? 0
        : 3.2 * (1 - blowIntensity * 0.4) + Math.sin(t * 14) * 0.3;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        delta * 10
      );
    }

    if (smokeRef.current) {
      smokeRef.current.visible = isBlownOut;
      if (isBlownOut) {
        smokeRef.current.position.y = 1.05 + ((t * 0.35) % 0.55);
        smokeRef.current.rotation.y = t * 0.8;
      }
    }
  });

  return (
    <group position={[0, 0.62, 0]}>
      {/* Dudukan Lilin Silver Starlight */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.095, 0.11, 0.06, 24]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.2} />
      </mesh>

      {/* Batang Lilin Ice White */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.062, 0.066, 0.88, 28]} />
        <meshPhysicalMaterial
          color="#F4F7FC"
          roughness={0.22}
          clearcoat={0.55}
        />
      </mesh>

      {/* Aksen Spiral Celestial Navy */}
      <mesh geometry={spiralGeometry} position={[0, 0.04, 0]}>
        <meshPhysicalMaterial
          color="#2B4C9B"
          roughness={0.18}
          metalness={0.45}
          clearcoat={0.85}
        />
      </mesh>

      {/* Sumbu */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Api Lilin Hangat */}
      <group ref={flameRef} position={[0, 1.08, 0]}>
        <mesh scale={[0.78, 1.38, 0.78]}>
          <sphereGeometry args={[0.092, 20, 20]} />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, -0.02, 0]} scale={[0.45, 0.85, 0.45]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#FEF9C3" />
        </mesh>
      </group>

      {/* Cahaya Api */}
      <pointLight
        ref={lightRef}
        position={[0, 1.2, 0]}
        color="#FDE68A"
        intensity={3.2}
        distance={5.5}
        decay={2}
      />

      {/* Asap Perak Lembut Setelah Ditiup */}
      <group ref={smokeRef} position={[0, 1.05, 0]} visible={false}>
        <mesh position={[0.02, 0.08, 0]}>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color="#E2E8F0" transparent opacity={0.42} roughness={1} />
        </mesh>
        <mesh position={[-0.03, 0.2, 0.02]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#9BB1E8" transparent opacity={0.3} roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

function MidnightStarlightCake({
  isBlownOut,
  blowIntensity = 0,
}: {
  isBlownOut: boolean;
  blowIntensity?: number;
}) {
  const cakeGroupRef = useRef<THREE.Group>(null);

  const topPiping = useMemo(() => {
    const count = 16;
    const radius = 1.06;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: i % 2 === 0 ? "#7AA2F7" : "#CBD5E1",
      };
    });
  }, []);

  const bottomPiping = useMemo(() => {
    const count = 20;
    const radius = 1.24;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      };
    });
  }, []);

  const starlightPearls = useMemo(() => {
    const count = 10;
    const radius = 0.68;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + 0.3;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: i % 2 === 0 ? "#E2E8F0" : "#9BB1E8",
      };
    });
  }, []);

  useFrame((state) => {
    if (!cakeGroupRef.current) return;
    cakeGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.14;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={cakeGroupRef} position={[0, -0.32, 0]}>
        {/* Piring Keramik Abyssal Navy */}
        <mesh position={[0, -0.44, 0]} receiveShadow>
          <cylinderGeometry args={[1.68, 1.46, 0.12, 48]} />
          <meshPhysicalMaterial
            color="#0A1022"
            roughness={0.16}
            metalness={0.3}
            clearcoat={0.92}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Rim Piring Platinum Silver */}
        <mesh position={[0, -0.375, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.66, 0.022, 16, 64]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.18} />
        </mesh>

        {/* Kertas Alas Bento Midnight Indigo */}
        <mesh position={[0, -0.365, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.38, 40]} />
          <meshStandardMaterial color="#121C38" roughness={0.8} />
        </mesh>

        {/* Badan Utama Bento Cake (Deep Midnight Navy) */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.22, 1.24, 0.96, 56]} />
          <meshStandardMaterial color="#17254D" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Lapisan Frosting Atas Starlight Ice */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[1.22, 1.22, 0.08, 56]} />
          <meshStandardMaterial color="#DCE6FA" roughness={0.42} />
        </mesh>

        {/* Tepi Bulat Halus di Atas Kue */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.06, 16, 56]} />
          <meshStandardMaterial color="#DCE6FA" roughness={0.42} />
        </mesh>

        {/* Piping Krim Periwinkle & Silver Melingkar Atas */}
        {topPiping.map((pip, idx) => (
          <group key={idx} position={[pip.x, 0.67, pip.z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.145, 20, 20]} />
              <meshStandardMaterial color={pip.color} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.11, 0]}>
              <coneGeometry args={[0.09, 0.13, 16]} />
              <meshStandardMaterial color={pip.color} roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Piping Krim Melingkar Bawah */}
        {bottomPiping.map((pip, idx) => (
          <mesh key={idx} position={[pip.x, -0.31, pip.z]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#4F75D1" roughness={0.45} />
          </mesh>
        ))}

        {/* Mutiara Kristal Silver & Starlight di Atas Kue */}
        {starlightPearls.map((pearl, idx) => (
          <mesh key={idx} position={[pearl.x, 0.65, pearl.z]}>
            <sphereGeometry args={[0.048, 16, 16]} />
            <meshPhysicalMaterial
              color={pearl.color}
              roughness={0.08}
              metalness={0.45}
              clearcoat={1}
            />
          </mesh>
        ))}

        {/* Pita Satin Celestial Blue & Silver di Depan Kue */}
        <group position={[0, 0.18, 1.24]}>
          <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.35]}>
            <torusGeometry args={[0.1, 0.032, 12, 24]} />
            <meshPhysicalMaterial color="#7AA2F7" roughness={0.28} clearcoat={0.65} />
          </mesh>
          <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.35]}>
            <torusGeometry args={[0.1, 0.032, 12, 24]} />
            <meshPhysicalMaterial color="#7AA2F7" roughness={0.28} clearcoat={0.65} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshPhysicalMaterial color="#E2E8F0" roughness={0.2} metalness={0.5} clearcoat={0.8} />
          </mesh>
        </group>

        {/* Lilin Spiral */}
        <SpiralCandle isBlownOut={isBlownOut} blowIntensity={blowIntensity} />
      </group>
    </Float>
  );
}

export default function BentoCakeScene({
  isBlownOut,
  blowIntensity = 0,
}: BentoCakeSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 2.2, 4.9], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-pan-y"
    >
      <ambientLight intensity={0.8} color="#172554" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.9}
        color="#F4F7FC"
        castShadow
      />
      <directionalLight position={[-4, 3, -3]} intensity={1.35} color="#4F75D1" />
      <pointLight position={[0, 1.5, -2.5]} intensity={1.2} color="#9BB1E8" />

      <Environment preset="night" environmentIntensity={0.55} />

      <MidnightStarlightCake
        isBlownOut={isBlownOut}
        blowIntensity={blowIntensity}
      />

      {/* Partikel Bintang Perak & Starlight */}
      <Sparkles
        count={isBlownOut ? 90 : 32}
        scale={isBlownOut ? [4.8, 3.6, 4.8] : [3.2, 2.2, 3.2]}
        size={isBlownOut ? 4.4 : 2.4}
        speed={isBlownOut ? 1.15 : 0.3}
        opacity={isBlownOut ? 0.95 : 0.65}
        color={isBlownOut ? "#E2E8F0" : "#9BB1E8"}
      />

      <ContactShadows
        position={[0, -0.82, 0]}
        opacity={0.55}
        scale={6}
        blur={2.4}
        far={2.5}
        color="#000000"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.65}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}