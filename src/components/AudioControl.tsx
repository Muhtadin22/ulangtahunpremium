"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { DREAMY_EASE } from "@/data/birthdayData";
import { useBirthdayAudio } from "@/context/AudioContext";

export default function AudioControl() {
  const { isPlaying, isMuted, toggleMute } = useBirthdayAudio();

  if (!isPlaying) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: DREAMY_EASE }}
      onClick={toggleMute}
      aria-label={isMuted ? "Aktifkan musik" : "Bisukan musik"}
      className="fixed bottom-5 right-5 z-50 glass-celestial flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#F4F7FC] transition-transform duration-300 hover:scale-105 hover:border-[#9BB1E8]/50 active:scale-95 cursor-pointer"
    >
      {isMuted ? (
        <>
          <VolumeX className="h-4 w-4 text-[#9BB1E8]" />
          <span className="hidden sm:inline text-[#A3B4D4]">Musik Mati</span>
        </>
      ) : (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9BB1E8] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7AA2F7]" />
          </span>
          <Volume2 className="h-4 w-4 text-[#9BB1E8]" />
          <span className="hidden sm:inline text-[#F4F7FC]">Musik Aktif</span>
        </>
      )}
    </motion.button>
  );
}