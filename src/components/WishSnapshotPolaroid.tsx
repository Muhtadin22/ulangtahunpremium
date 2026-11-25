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
        className="glass-celestial relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-12 sm:py-12"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#4F75D1]/20 blur-[90px]" />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9BB1E8]/30 bg-[#4F75D1]/20 px-4 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#CBD5E1] uppercase">
          <Camera className="h-3.5 w-3.5 text-[#9BB1E8]" />
          Starlight Candid Captured
        </span>

        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F4F7FC] sm:text-5xl">
          Momen Tiup Lilinmu Tadi ✨
        </h2>

        <p className="mx-auto mt-2.5 max-w-md text-sm text-[#A3B4D4]">
          Tepat saat kamu memejamkan mata dan meniup lilin, kamera diam-diam mengabadikan senyum terbaikmu.
        </p>

        <motion.div
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: DREAMY_EASE }}
          className="mx-auto mt-8 max-w-[300px] -rotate-1 overflow-hidden rounded-2xl border border-[#9BB1E8]/35 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.9),0_0_32px_-8px_rgba(122,162,247,0.38)] sm:max-w-[330px]"
        >
          <img
            src={snapshotUrl}
            alt={`Make a Wish — ${birthdayData.snapshotDateLabel}`}
            className="block h-auto w-full"
          />
        </motion.div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2B4C9B] via-[#4F75D1] to-[#7AA2F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(79,117,209,0.65)] ring-1 ring-[#E2E8F0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(122,162,247,0.8)] active:scale-95 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-[#E2E8F0]" />
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