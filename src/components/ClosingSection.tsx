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
      <div className="pointer-events-none absolute inset-0">
        <ClosingParticlesScene />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: DREAMY_EASE }}
        className="glass-celestial relative z-10 mx-auto max-w-xl rounded-3xl px-7 py-11 text-center sm:px-12 sm:py-14"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#9BB1E8]/35 bg-[#4F75D1]/25 text-[#9BB1E8]">
          <Heart className="h-5 w-5 fill-[#9BB1E8]" />
        </div>

        <h2 className="mt-5 font-serif text-4xl font-semibold text-[#F4F7FC] sm:text-5xl">
          {birthdayData.closing.title},{" "}
          <span className="bg-gradient-to-r from-[#E2E8F0] to-[#7AA2F7] bg-clip-text italic text-transparent">
            {birthdayData.partnerNickname}
          </span>
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[#A3B4D4] sm:text-base">
          {birthdayData.closing.subtitle}
        </p>

        <button
          onClick={onReplay}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2B4C9B] via-[#4F75D1] to-[#7AA2F7] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(79,117,209,0.65)] ring-1 ring-[#E2E8F0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(122,162,247,0.8)] active:scale-95 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{birthdayData.closing.replayButton}</span>
        </button>

        <p className="mt-8 text-xs tracking-wider text-[#A3B4D4]/55">
          Dibuat khusus dengan cinta • {birthdayData.birthdayDate}
        </p>
      </motion.div>
    </footer>
  );
}