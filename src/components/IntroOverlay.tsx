"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";

const BalloonsIntroScene = dynamic(
  () => import("@/components/three/BalloonsIntroScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-14 w-14 animate-pulse rounded-full bg-[#9333EA]/30 blur-md" />
      </div>
    ),
  }
);

interface IntroOverlayProps {
  onOpenSurprise: () => void;
}

export default function IntroOverlay({ onOpenSurprise }: IntroOverlayProps) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleTriggerOpen = () => {
    if (isLaunching) return;
    setIsLaunching(true);

    // Confetti Royal Amethyst, Lilac & Silver
    const colors = ["#9333EA", "#C084FC", "#E9D5FF", "#6B21A8", "#F5D0FE"];
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors,
      scalar: 0.95,
    });

    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
    }, 180);

    setTimeout(() => {
      onOpenSurprise();
    }, 950);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.85, ease: DREAMY_EASE }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1F1135_0%,#09060E_68%)]"
    >
      {/* Ambient Spotlight Ungu Gelap */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#7E22CE]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 -bottom-28 h-96 w-96 rounded-full bg-[#A855F7]/20 blur-[110px]" />

      {/* Canvas 3D Balon & Kristal Hati */}
      <div className="absolute inset-0">
        <BalloonsIntroScene
          isLaunching={isLaunching}
          onBalloonTap={handleTriggerOpen}
        />
      </div>

      {/* Kartu Pembuka Glass Velvet */}
      <motion.div
        animate={
          isLaunching
            ? { opacity: 0, y: 24, scale: 0.96 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.65, ease: DREAMY_EASE }}
        className="relative z-10 mx-5 max-w-md text-center"
      >
        <div className="glass-velvet rounded-3xl px-7 py-9 sm:px-10 sm:py-11">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C084FC]/30 bg-[#9333EA]/20 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-[#D8B4FE] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
            {birthdayData.intro.badge}
          </span>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-[#F6F1FC] sm:text-5xl">
            {birthdayData.intro.headline}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#D8B4FE]/75 sm:text-base">
            {birthdayData.intro.subtext}
          </p>

          <button
            onClick={handleTriggerOpen}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95 cursor-pointer"
          >
            <span>{birthdayData.intro.ctaLabel}</span>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}