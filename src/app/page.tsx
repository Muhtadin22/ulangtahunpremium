"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroOverlay from "@/components/IntroOverlay";
import HeroCakeSection from "@/components/HeroCakeSection";
import { DREAMY_EASE } from "@/data/birthdayData";
import { useBirthdayAudio } from "@/context/AudioContext";

export default function HomePage() {
  const [isOpened, setIsOpened] = useState(false);
  const { playAudio } = useBirthdayAudio();

  const handleOpenSurprise = () => {
    setIsOpened(true);
    playAudio();
  };

  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,#170E26_0%,#09060E_55%,#06040A_100%)] text-[#F6F1FC]">
      <AnimatePresence mode="wait">
        {!isOpened && (
          <IntroOverlay
            key="intro-overlay"
            onOpenSurprise={handleOpenSurprise}
          />
        )}
      </AnimatePresence>

      {isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: DREAMY_EASE }}
        >
          <HeroCakeSection />
        </motion.div>
      )}
    </main>
  );
}