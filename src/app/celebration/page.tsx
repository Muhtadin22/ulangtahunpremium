"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";
import WishSnapshotPolaroid from "@/components/WishSnapshotPolaroid";
import PolaroidGallery from "@/components/PolaroidGallery";
import LoveLetterEnvelope from "@/components/LoveLetterEnvelope";
import WishCardsGrid from "@/components/WishCardsGrid";
import TimeCapsuleWish from "@/components/TimeCapsuleWish";
import ClosingSection from "@/components/ClosingSection";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";

export default function CelebrationPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.35 },
      colors: ["#9333EA", "#C084FC", "#E9D5FF", "#F5D0FE"],
      scalar: 0.85,
    });
  }, []);

  const handleReplay = () => {
    router.push("/");
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, ease: DREAMY_EASE }}
      className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,#170E26_0%,#09060E_55%,#06040A_100%)] text-[#F6F1FC]"
    >
      {/* Banner Doa Setelah Lilin Ditiup */}
      <section className="relative overflow-hidden px-5 pt-20 pb-8">
        <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#9333EA]/20 blur-[110px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.15, ease: DREAMY_EASE }}
          className="glass-velvet mx-auto max-w-2xl rounded-3xl px-7 py-9 text-center sm:px-11 sm:py-11"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C084FC]/30 bg-[#9333EA]/20 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#D8B4FE] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
            Happy {birthdayData.age}nd Birthday, {birthdayData.partnerName}
          </span>

          <p className="mt-5 font-serif text-2xl leading-relaxed text-[#F6F1FC] sm:text-3xl">
            “Semoga setiap langkahmu di usia baru ini selalu terasa tenang, hatimu selalu hangat, dan semua hal indah yang diam-diam kamu doakan menemukan jalannya satu per satu.”
          </p>
        </motion.div>
      </section>

      {/* 1. Hasil Candid Polaroid Saat Tiup Lilin */}
      <WishSnapshotPolaroid />

      <div className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-[#C084FC]/35 to-transparent" />
      <PolaroidGallery />

      <div className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-[#C084FC]/35 to-transparent" />
      {/* 2. Surat Cinta + Voice Note Rahasia */}
      <LoveLetterEnvelope />

      <div className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-[#C084FC]/35 to-transparent" />
      <WishCardsGrid />

      <div className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-[#C084FC]/35 to-transparent" />
      {/* 3. Kapsul Waktu & Pengirim Harapan Rahasia */}
      <TimeCapsuleWish />

      <ClosingSection onReplay={handleReplay} />
    </motion.main>
  );
}