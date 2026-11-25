"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";
import { birthdayData } from "@/data/birthdayData";

interface BentoCakeSceneProps {
  isBlownOut: boolean;
  blowIntensity?: number;
  partnerName?: string;
  topLabel?: string;
}

type MapMode = "color" | "bump" | "roughness";

// Helper menggambar teks melengkung presisi di permukaan kue
function drawCurvedIcingText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  position: "top" | "bottom",
  mode: MapMode
) {
  const chars = Array.from(text);
  if (chars.length === 0) return;

  const charWidths = chars.map((ch) => ctx.measureText(ch).width);
  const letterSpacing = position === "top" ? 10 : 4;
  const totalArcLength =
    charWidths.reduce((acc, w) => acc + w, 0) +
    letterSpacing * Math.max(0, chars.length - 1);

  const totalAngle = totalArcLength / radius;
  let currentAngle =
    position === "top"
      ? -Math.PI / 2 - totalAngle / 2
      : Math.PI / 2 + totalAngle / 2;

  chars.forEach((ch, idx) => {
    const halfCharAngle = charWidths[idx] / 2 / radius;
    currentAngle += position === "top" ? halfCharAngle : -halfCharAngle;

    const x = centerX + Math.cos(currentAngle) * radius;
    const y = centerY + Math.sin(currentAngle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(
      position === "top"
        ? currentAngle + Math.PI / 2
        : currentAngle - Math.PI / 2
    );

    if (mode === "bump") {
      // Ketinggian 3D bertingkat agar huruf membulat seperti krim pipa
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = position === "top" ? 11 : 16;
      ctx.strokeStyle = "#B8B8B8";
      ctx.strokeText(ch, 0, 0);

      ctx.lineWidth = position === "top" ? 6 : 9;
      ctx.strokeStyle = "#E5E5E5";
      ctx.strokeText(ch, 0, 0);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(ch, 0, 0);
    } else if (mode === "roughness") {
      // Nilai gelap = permukaan mengilap (royal icing), latar terang = matte (frosting)
      ctx.lineWidth = position === "top" ? 10 : 14;
      ctx.strokeStyle = "#2A2A2A";
      ctx.strokeText(ch, 0, 0);
      ctx.fillStyle = "#181818";
      ctx.fillText(ch, 0, 0);
    } else {
      // 1. Bayangan lembut di atas permukaan frosting
      ctx.save();
      ctx.shadowColor = "rgba(10, 17, 38, 0.32)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.lineWidth = position === "top" ? 12 : 17;
      ctx.strokeStyle = "#F8FAFC";
      ctx.strokeText(ch, 0, 0);
      ctx.restore();

      // 2. Pinggiran krim mutiara-periwinkle
      ctx.lineWidth = position === "top" ? 8 : 12;
      ctx.strokeStyle = position === "top" ? "#8BA8EC" : "#A5BCF0";
      ctx.strokeText(ch, 0, 0);

      // 3. Inti kaligrafi Midnight Royal Navy
      ctx.fillStyle = position === "top" ? "#1B367E" : "#0F1B3D";
      ctx.fillText(ch, 0, 0);

      // 4. Kilau cahaya tipis di puncak krim huruf
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
      ctx.strokeText(ch, 0, -1.8);
    }

    ctx.restore();

    const stepAfter = (charWidths[idx] / 2 + letterSpacing) / radius;
    currentAngle += position === "top" ? stepAfter : -stepAfter;
  });
}

// Menggambar garis lengkung kaligrafi (flourish) di bawah nama
function drawCalligraphyFlourish(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  mode: MapMode
) {
  ctx.save();
  ctx.beginPath();
  // Lengkungan halus mengikuti kontur bawah nama
  ctx.arc(cx, cy, 342, Math.PI * 0.34, Math.PI * 0.66);

  if (mode === "bump") {
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#E0E0E0";
  } else if (mode === "roughness") {
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#222222";
  } else {
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = "#6B8EE2";
  }
  ctx.stroke();

  // Titik berlian kecil di tengah bawah flourish
  const dotY = cy + 342;
  ctx.beginPath();
  ctx.arc(cx, dotY, 5.5, 0, Math.PI * 2);
  ctx.fillStyle =
    mode === "bump" ? "#FFFFFF" : mode === "roughness" ? "#1A1A1A" : "#1B367E";
  ctx.fill();
  ctx.restore();
}

// Membuat 3 peta tekstur sinkron (Color, Bump, Roughness) untuk tulisan & ornamen kue
function createCoutureCakeTextures(
  partnerName: string,
  topLabel: string,
  serifFamily: string,
  sansFamily: string
) {
  const size = 1024;
  const cx = size / 2;
  const cy = size / 2;

  const canvases: Record<MapMode, HTMLCanvasElement> = {
    color: document.createElement("canvas"),
    bump: document.createElement("canvas"),
    roughness: document.createElement("canvas"),
  };

  (Object.keys(canvases) as MapMode[]).forEach((mode) => {
    const canvas = canvases[mode];
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Latar dasar tiap peta
    if (mode === "bump") {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, size, size);
    } else if (mode === "roughness") {
      // Permukaan kue frosting bertekstur lembut (matte ~0.72)
      ctx.fillStyle = "#B8B8B8";
      ctx.fillRect(0, 0, size, size);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // 1. Bingkai Medallion Ganda Halus di Sekeliling Permukaan Kue
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 412, 0, Math.PI * 2);
    ctx.lineWidth = mode === "bump" ? 5 : 3;
    ctx.strokeStyle =
      mode === "bump"
        ? "#D4D4D4"
        : mode === "roughness"
        ? "#2E2E2E"
        : "rgba(122, 162, 247, 0.55)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 396, 0, Math.PI * 2);
    ctx.lineWidth = mode === "bump" ? 3 : 1.5;
    ctx.strokeStyle =
      mode === "bump"
        ? "#A8A8A8"
        : mode === "roughness"
        ? "#3A3A3A"
        : "rgba(255, 255, 255, 0.75)";
    ctx.stroke();
    ctx.restore();

    // 2. Lengkungan Atas: Ucapan Singkat (misal: "HBD 22")
    const cleanTop = topLabel.trim().toUpperCase();
    if (cleanTop) {
      ctx.font = `700 40px ${sansFamily}`;
      drawCurvedIcingText(ctx, cleanTop, cx, cy, 232, "top", mode);
    }

    // 3. Lengkungan Bawah (Depan Lilin): Nama yang Berulang Tahun
    const displayName = partnerName.trim() || "Sayang";
    const nameFontSize =
      displayName.length <= 5
        ? 114
        : displayName.length <= 8
        ? 98
        : displayName.length <= 12
        ? 82
        : 66;

    ctx.font = `italic 700 ${nameFontSize}px ${serifFamily}`;
    drawCurvedIcingText(ctx, displayName, cx, cy, 256, "bottom", mode);

    // 4. Garis Kaligrafi di Bawah Nama
    drawCalligraphyFlourish(ctx, cx, cy, mode);

    // 5. Ornamen Bintang & Kelopak Perak di Kiri-Kanan Kue
    ctx.font = `600 32px ${sansFamily}`;
    const ornaments = [
      { symbol: "✦", x: cx - 315, y: cy - 8 },
      { symbol: "✦", x: cx + 315, y: cy - 8 },
      { symbol: "✧", x: cx - 265, y: cy - 155 },
      { symbol: "✧", x: cx + 265, y: cy - 155 },
    ];

    ornaments.forEach((item) => {
      ctx.fillStyle =
        mode === "bump"
          ? "#EAEAEA"
          : mode === "roughness"
          ? "#202020"
          : "#4F75D1";
      ctx.fillText(item.symbol, item.x, item.y);
    });
  });

  const colorTexture = new THREE.CanvasTexture(canvases.color);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 8;
  colorTexture.needsUpdate = true;

  const bumpTexture = new THREE.CanvasTexture(canvases.bump);
  bumpTexture.anisotropy = 8;
  bumpTexture.needsUpdate = true;

  const roughnessTexture = new THREE.CanvasTexture(canvases.roughness);
  roughnessTexture.anisotropy = 8;
  roughnessTexture.needsUpdate = true;

  return { colorTexture, bumpTexture, roughnessTexture };
}

// Komponen Piping Krim Swirl Berulir (Star-Tip Rosette)
function PipedSwirl({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Dasar Krim Mengembang */}
      <mesh castShadow>
        <sphereGeometry args={[0.135, 20, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          clearcoat={0.25}
        />
      </mesh>
      {/* Lapisan Tengah Berulir */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.075, 0.045, 12, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.3}
        />
      </mesh>
      {/* Puncak Lancip Spuit */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <coneGeometry args={[0.068, 0.12, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.34}
          clearcoat={0.35}
        />
      </mesh>
    </group>
  );
}

// Pita Satin 3D Couture dengan Ekor Menjuntai di Bagian Depan Kue
function CoutureSatinRibbon() {
  const { leftLoop, rightLoop, leftTail, rightTail } = useMemo(() => {
    const lLoop = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.18, 0.09, 0.04),
      new THREE.Vector3(-0.24, -0.02, 0.02),
      new THREE.Vector3(-0.08, -0.06, 0),
      new THREE.Vector3(0, 0, 0),
    ]);

    const rLoop = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.18, 0.09, 0.04),
      new THREE.Vector3(0.24, -0.02, 0.02),
      new THREE.Vector3(0.08, -0.06, 0),
      new THREE.Vector3(0, 0, 0),
    ]);

    const lTail = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, -0.02, 0.01),
      new THREE.Vector3(-0.11, -0.18, 0.04),
      new THREE.Vector3(-0.17, -0.36, 0.06),
    ]);

    const rTail = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, -0.02, 0.01),
      new THREE.Vector3(0.11, -0.18, 0.04),
      new THREE.Vector3(0.17, -0.36, 0.06),
    ]);

    return {
      leftLoop: new THREE.TubeGeometry(lLoop, 32, 0.026, 10, true),
      rightLoop: new THREE.TubeGeometry(rLoop, 32, 0.026, 10, true),
      leftTail: new THREE.TubeGeometry(lTail, 20, 0.021, 8, false),
      rightTail: new THREE.TubeGeometry(rTail, 20, 0.021, 8, false),
    };
  }, []);

  useEffect(() => {
    return () => {
      leftLoop.dispose();
      rightLoop.dispose();
      leftTail.dispose();
      rightTail.dispose();
    };
  }, [leftLoop, rightLoop, leftTail, rightTail]);

  return (
    <group position={[0, 0.22, 1.24]}>
      <mesh geometry={leftLoop} castShadow>
        <meshPhysicalMaterial
          color="#7AA2F7"
          roughness={0.22}
          metalness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      <mesh geometry={rightLoop} castShadow>
        <meshPhysicalMaterial
          color="#7AA2F7"
          roughness={0.22}
          metalness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      <mesh geometry={leftTail} castShadow>
        <meshPhysicalMaterial
          color="#638CE8"
          roughness={0.25}
          metalness={0.18}
          clearcoat={0.75}
        />
      </mesh>
      <mesh geometry={rightTail} castShadow>
        <meshPhysicalMaterial
          color="#638CE8"
          roughness={0.25}
          metalness={0.18}
          clearcoat={0.75}
        />
      </mesh>
      {/* Simpul Tengah Berlian Silver */}
      <mesh castShadow>
        <sphereGeometry args={[0.048, 16, 16]} />
        <meshPhysicalMaterial
          color="#E2E8F0"
          roughness={0.15}
          metalness={0.65}
          clearcoat={0.9}
        />
      </mesh>
    </group>
  );
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
    const height = 0.86;
    const radius = 0.065;
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
    return new THREE.TubeGeometry(curve, 96, 0.014, 8, false);
  }, []);

  useEffect(() => {
    return () => {
      spiralGeometry.dispose();
    };
  }, [spiralGeometry]);

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
        : 3.3 * (1 - blowIntensity * 0.4) + Math.sin(t * 14) * 0.3;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        delta * 10
      );
    }

    if (smokeRef.current) {
      smokeRef.current.visible = isBlownOut;
      if (isBlownOut) {
        smokeRef.current.position.y = 1.03 + ((t * 0.35) % 0.55);
        smokeRef.current.rotation.y = t * 0.8;
      }
    }
  });

  return (
    <group position={[0, 0.62, -0.04]}>
      {/* Dudukan Lilin Platinum Silver */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.09, 0.105, 0.06, 24]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.18} />
      </mesh>

      {/* Batang Lilin Pearl White */}
      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.062, 0.86, 28]} />
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
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Api Lilin Hangat */}
      <group ref={flameRef} position={[0, 1.06, 0]}>
        <mesh scale={[0.78, 1.38, 0.78]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, -0.02, 0]} scale={[0.45, 0.85, 0.45]}>
          <sphereGeometry args={[0.072, 16, 16]} />
          <meshBasicMaterial color="#FEF9C3" />
        </mesh>
      </group>

      {/* Cahaya Api */}
      <pointLight
        ref={lightRef}
        position={[0, 1.18, 0]}
        color="#FDE68A"
        intensity={3.3}
        distance={5.5}
        decay={2}
      />

      {/* Asap Perak Lembut Setelah Ditiup */}
      <group ref={smokeRef} position={[0, 1.03, 0]} visible={false}>
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
  partnerName,
  topLabel,
}: {
  isBlownOut: boolean;
  blowIntensity?: number;
  partnerName: string;
  topLabel: string;
}) {
  const cakeGroupRef = useRef<THREE.Group>(null);

  // Ambil font Cormorant Garamond & Plus Jakarta Sans yang sudah dimuat Next.js
  const { colorTexture, bumpTexture, roughnessTexture } = useMemo(() => {
    let serifFamily = '"Cormorant Garamond", Georgia, serif';
    let sansFamily = '"Plus Jakarta Sans", system-ui, sans-serif';

    if (typeof window !== "undefined") {
      const bodyStyles = getComputedStyle(document.body);
      const loadedSerif = bodyStyles.getPropertyValue("--font-cormorant").trim();
      const loadedSans = bodyStyles.getPropertyValue("--font-jakarta").trim();
      if (loadedSerif) serifFamily = `${loadedSerif}, Georgia, serif`;
      if (loadedSans) sansFamily = `${loadedSans}, system-ui, sans-serif`;
    }

    return createCoutureCakeTextures(
      partnerName,
      topLabel,
      serifFamily,
      sansFamily
    );
  }, [partnerName, topLabel]);

  useEffect(() => {
    return () => {
      colorTexture.dispose();
      bumpTexture.dispose();
      roughnessTexture.dispose();
    };
  }, [colorTexture, bumpTexture, roughnessTexture]);

  const topPiping = useMemo(() => {
    const count = 16;
    const radius = 1.08;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: i % 2 === 0 ? "#8BA8EC" : "#E6ECF8",
      };
    });
  }, []);

  const bottomPiping = useMemo(() => {
    const count = 22;
    const radius = 1.24;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: i % 2 === 0 ? "#4F75D1" : "#9BB1E8",
      };
    });
  }, []);

  // Serpihan Silver Leaf dekoratif di sisi dinding kue
  const silverLeafFlakes = useMemo(() => {
    const count = 18;
    const radius = 1.236;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + 0.15;
      const yOffset = -0.14 + ((i * 37) % 10) * 0.048;
      return {
        x: Math.cos(angle) * radius,
        y: yOffset,
        z: Math.sin(angle) * radius,
        rotY: -angle + Math.PI / 2,
        rotZ: (i % 5) * 0.4,
        scale: 0.7 + (i % 3) * 0.25,
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
          <cylinderGeometry args={[1.72, 1.48, 0.12, 48]} />
          <meshPhysicalMaterial
            color="#080D1C"
            roughness={0.14}
            metalness={0.32}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Rim Piring Platinum Silver Ganda */}
        <mesh position={[0, -0.375, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.7, 0.022, 16, 64]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.88} roughness={0.16} />
        </mesh>
        <mesh position={[0, -0.376, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.56, 0.01, 12, 64]} />
          <meshStandardMaterial color="#9BB1E8" metalness={0.8} roughness={0.22} />
        </mesh>

        {/* Kertas Alas Bento Midnight Indigo */}
        <mesh position={[0, -0.365, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.38, 48]} />
          <meshStandardMaterial color="#101933" roughness={0.82} />
        </mesh>

        {/* Badan Utama Bento Cake (Deep Midnight Velvet) */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.22, 1.24, 0.96, 64]} />
          <meshStandardMaterial color="#152247" roughness={0.55} metalness={0.08} />
        </mesh>

        {/* Aksentuasi Serpihan Silver Leaf di Dinding Kue */}
        {silverLeafFlakes.map((flake, idx) => (
          <mesh
            key={idx}
            position={[flake.x, flake.y, flake.z]}
            rotation={[0, flake.rotY, flake.rotZ]}
            scale={flake.scale}
          >
            <planeGeometry args={[0.075, 0.05]} />
            <meshStandardMaterial
              color="#E2E8F0"
              metalness={0.92}
              roughness={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Lapisan Frosting Atas Starlight Silk */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.22, 1.22, 0.08, 64]} />
          <meshStandardMaterial color="#E4ECFB" roughness={0.58} />
        </mesh>

        {/* Tepi Bulat Halus di Atas Kue */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.06, 16, 64]} />
          <meshStandardMaterial color="#E4ECFB" roughness={0.55} />
        </mesh>

        {/* Lapisan Kaligrafi Nama & Medallion Timbul (Royal Icing Glossy) */}
        <mesh position={[0, 0.642, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.01, 64]} />
          <meshPhysicalMaterial
            map={colorTexture}
            bumpMap={bumpTexture}
            bumpScale={0.024}
            roughnessMap={roughnessTexture}
            roughness={1}
            transparent
            alphaTest={0.02}
            clearcoat={0.85}
            clearcoatRoughness={0.12}
            depthWrite={false}
          />
        </mesh>

        {/* Piping Krim Swirl Berulir Melingkar Atas */}
        {topPiping.map((pip, idx) => (
          <PipedSwirl
            key={idx}
            position={[pip.x, 0.66, pip.z]}
            color={pip.color}
            scale={0.95}
          />
        ))}

        {/* Piping Krim Melingkar Bawah */}
        {bottomPiping.map((pip, idx) => (
          <mesh key={idx} position={[pip.x, -0.31, pip.z]} castShadow>
            <sphereGeometry args={[0.105, 16, 16]} />
            <meshPhysicalMaterial
              color={pip.color}
              roughness={0.4}
              clearcoat={0.25}
            />
          </mesh>
        ))}

        {/* Pita Satin 3D Couture di Bagian Depan Kue */}
        <CoutureSatinRibbon />

        {/* Lilin Spiral */}
        <SpiralCandle isBlownOut={isBlownOut} blowIntensity={blowIntensity} />
      </group>
    </Float>
  );
}

export default function BentoCakeScene({
  isBlownOut,
  blowIntensity = 0,
  partnerName = birthdayData.partnerName,
  topLabel = birthdayData.hero.cakeTopText,
}: BentoCakeSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 2.65, 4.7], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-pan-y"
    >
      <ambientLight intensity={0.82} color="#172554" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.95}
        color="#F4F7FC"
        castShadow
      />
      <directionalLight position={[-4, 3, -3]} intensity={1.35} color="#4F75D1" />
      <pointLight position={[0, 1.5, -2.5]} intensity={1.2} color="#9BB1E8" />

      <Environment preset="night" environmentIntensity={0.55} />

      <MidnightStarlightCake
        isBlownOut={isBlownOut}
        blowIntensity={blowIntensity}
        partnerName={partnerName}
        topLabel={topLabel}
      />

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
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}