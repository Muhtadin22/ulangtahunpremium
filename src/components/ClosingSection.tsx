"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";

const ClosingParticlesScene = dynamic(
  () => import("@/components/three/ClosingParticlesScene"),
  { ssr: false }
);

interface ClosingSectionProps {
  onReplay: () => void;
}

export default function ClosingSection({ onReplay }: ClosingSectionProps) {
  return (
    <footer className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-5 py-24">
      {/* Canvas Kristal Hati 3D */}
      <div className="pointer-events-none absolute inset-0">
        <ClosingParticlesScene />
      </div>

      {/* Kartu Penutup Glass Velvet */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: DREAMY_EASE }}
        className="glass-velvet relative z-10 mx-auto max-w-xl rounded-3xl px-7 py-11 text-center sm:px-12 sm:py-14"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C084FC]/35 bg-[#9333EA]/25 text-[#C084FC]">
          <Heart className="h-5 w-5 fill-[#C084FC]" />
        </div>

        <h2 className="mt-5 font-serif text-4xl font-semibold text-[#F6F1FC] sm:text-5xl">
          {birthdayData.closing.title},{" "}
          <span className="bg-gradient-to-r from-[#D8B4FE] to-[#A855F7] bg-clip-text italic text-transparent">
            {birthdayData.partnerNickname}
          </span>
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[#D8B4FE]/75 sm:text-base">
          {birthdayData.closing.subtitle}
        </p>

        <button
          onClick={onReplay}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{birthdayData.closing.replayButton}</span>
        </button>

        <p className="mt-8 text-xs tracking-wider text-[#D8B4FE]/45">
          Dibuat khusus dengan cinta • {birthdayData.birthdayDate}
        </p>
      </motion.div>
    </footer>
  );
}