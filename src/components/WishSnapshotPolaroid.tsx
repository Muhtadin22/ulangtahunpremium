"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, Download } from "lucide-react";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";
import { SNAPSHOT_STORAGE_KEY } from "@/components/HeroCakeSection";

export default function WishSnapshotPolaroid() {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (saved) {
        setSnapshotUrl(saved);
      }
    } catch {
      // Abaikan jika storage tidak tersedia
    }
  }, []);

  if (!snapshotUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = snapshotUrl;
    const safeName = birthdayData.partnerName.toLowerCase().replace(/\s+/g, "-");
    link.download = `make-a-wish-${safeName}-${birthdayData.age}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <section className="relative mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: DREAMY_EASE }}
        className="glass-velvet relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-12 sm:py-12"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#9333EA]/20 blur-[90px]" />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C084FC]/30 bg-[#9333EA]/20 px-4 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#D8B4FE] uppercase">
          <Camera className="h-3.5 w-3.5 text-[#C084FC]" />
          Candid Moment Captured
        </span>

        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F6F1FC] sm:text-5xl">
          Momen Tiup Lilinmu Tadi ✨
        </h2>

        <p className="mx-auto mt-2.5 max-w-md text-sm text-[#D8B4FE]/75">
          Tepat saat kamu memejamkan mata dan meniup lilin, kamera diam-diam mengabadikan senyum terbaikmu.
        </p>

        {/* Pratinjau Polaroid Candid */}
        <motion.div
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: DREAMY_EASE }}
          className="mx-auto mt-8 max-w-[300px] -rotate-1 overflow-hidden rounded-2xl border border-[#C084FC]/35 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.9),0_0_32px_-8px_rgba(147,51,234,0.45)] sm:max-w-[330px]"
        >
          <img
            src={snapshotUrl}
            alt={`Make a Wish — ${birthdayData.snapshotDateLabel}`}
            className="h-auto w-full block"
          />
        </motion.div>

        {/* Tombol Simpan Kenangan */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-[#E9D5FF]" />
                <span>Kenangan Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Simpan Kenangan</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
}