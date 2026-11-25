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
        <div className="h-14 w-14 animate-pulse rounded-full bg-[#4F75D1]/30 blur-md" />
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

    // Confetti Starlight Silver & Celestial Blue
    const colors = ["#7AA2F7", "#9BB1E8", "#E2E8F0", "#3B66C4", "#F8FAFC"];
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#12214A_0%,#050811_68%)]"
    >
      {/* Ambient Spotlight Midnight Navy */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#2B4C9B]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-28 -bottom-28 h-96 w-96 rounded-full bg-[#7AA2F7]/20 blur-[110px]" />

      {/* Canvas 3D Balon & Kristal Hati */}
      <div className="absolute inset-0">
        <BalloonsIntroScene
          isLaunching={isLaunching}
          onBalloonTap={handleTriggerOpen}
        />
      </div>

      {/* Kartu Pembuka Glass Celestial */}
      <motion.div
        animate={
          isLaunching
            ? { opacity: 0, y: 24, scale: 0.96 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.65, ease: DREAMY_EASE }}
        className="relative z-10 mx-5 max-w-md text-center"
      >
        <div className="glass-celestial rounded-3xl px-7 py-9 sm:px-10 sm:py-11">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9BB1E8]/30 bg-[#4F75D1]/20 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-[#CBD5E1] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#9BB1E8]" />
            {birthdayData.intro.badge}
          </span>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-[#F4F7FC] sm:text-5xl">
            {birthdayData.intro.headline}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#A3B4D4] sm:text-base">
            {birthdayData.intro.subtext}
          </p>

          <button
            onClick={handleTriggerOpen}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2B4C9B] via-[#4F75D1] to-[#7AA2F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(79,117,209,0.65)] ring-1 ring-[#E2E8F0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(122,162,247,0.8)] active:scale-95 cursor-pointer"
          >
            <span>{birthdayData.intro.ctaLabel}</span>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}