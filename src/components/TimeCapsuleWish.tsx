"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Gem, Lock, Mail, RotateCcw, Send, Sparkles } from "lucide-react";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";

export default function TimeCapsuleWish() {
  const [wishText, setWishText] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const trimmedWish = wishText.trim();

  const handleLockWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedWish) return;

    setIsLocked(true);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.65 },
      colors: ["#7AA2F7", "#9BB1E8", "#E2E8F0", "#3B66C4"],
      scalar: 0.85,
    });
  };

  const formattedMessage = [
    `🌌 *Kapsul Harapan Ulang Tahun ke-${birthdayData.age}*`,
    `Dari: ${birthdayData.partnerName} (${birthdayData.birthdayDate})`,
    "",
    `"${trimmedWish}"`,
    "",
    "✨ Dikunci dari Starlight Birthday Capsule",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${birthdayData.contact.whatsappNumber}?text=${encodeURIComponent(
    formattedMessage
  )}`;

  const emailSubject = `Kapsul Harapan Ulang Tahun ke-${birthdayData.age} — ${birthdayData.partnerName}`;
  const mailtoUrl = `mailto:${birthdayData.contact.email}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(formattedMessage)}`;

  return (
    <section className="relative mx-auto max-w-3xl px-5 py-20 sm:py-28">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F75D1]/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: DREAMY_EASE }}
        className="glass-celestial relative overflow-hidden rounded-3xl px-6 py-10 sm:px-11 sm:py-12"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9BB1E8]/30 bg-[#4F75D1]/20 px-4 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#CBD5E1] uppercase">
            <Gem className="h-3.5 w-3.5 text-[#9BB1E8]" />
            {birthdayData.timeCapsule.eyebrow}
          </span>

          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F4F7FC] sm:text-5xl">
            {birthdayData.timeCapsule.title}
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#A3B4D4] sm:text-base">
            {birthdayData.timeCapsule.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isLocked ? (
            <motion.form
              key="wish-form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: DREAMY_EASE }}
              onSubmit={handleLockWish}
              className="mt-8"
            >
              <textarea
                rows={4}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder={birthdayData.timeCapsule.placeholder}
                className="w-full resize-none rounded-2xl border border-[#9BB1E8]/25 bg-[#070B18]/85 p-5 text-sm leading-relaxed text-[#F4F7FC] placeholder:text-[#A3B4D4]/45 focus:border-[#9BB1E8]/70 focus:ring-2 focus:ring-[#7AA2F7]/30 focus:outline-none sm:text-base"
              />

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={!trimmedWish}
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2B4C9B] via-[#4F75D1] to-[#7AA2F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(79,117,209,0.65)] ring-1 ring-[#E2E8F0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(122,162,247,0.8)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>{birthdayData.timeCapsule.lockButtonLabel}</span>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="wish-locked"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.7, ease: DREAMY_EASE }}
              className="mt-8 flex flex-col items-center text-center"
            >
              {/* Animasi Kristal Starlight Bercahaya */}
              <motion.div
                initial={{ scale: 0.5, rotate: -18 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.75, ease: DREAMY_EASE }}
                className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E2E8F0]/50 bg-gradient-to-br from-[#4F75D1]/70 via-[#1E3A8A]/80 to-[#0F172A] shadow-[0_0_45px_rgba(122,162,247,0.7)]"
              >
                <motion.div
                  animate={{ opacity: [0.4, 0.95, 0.4], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-[#9BB1E8]/30 blur-xl"
                />
                <Gem className="relative z-10 h-9 w-9 text-[#F4F7FC]" />
              </motion.div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#E2E8F0] sm:text-3xl">
                {birthdayData.timeCapsule.lockedTitle}
              </h3>

              <div className="mt-4 w-full max-w-lg rounded-2xl border border-[#9BB1E8]/25 bg-[#070B18]/75 px-5 py-4">
                <p className="font-serif text-lg italic leading-relaxed text-[#F4F7FC]/90">
                  “{trimmedWish}”
                </p>
              </div>

              <p className="mt-4 max-w-md text-xs leading-relaxed text-[#A3B4D4] sm:text-sm">
                {birthdayData.timeCapsule.lockedSubtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2B4C9B] via-[#4F75D1] to-[#7AA2F7] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(79,117,209,0.65)] ring-1 ring-[#E2E8F0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(122,162,247,0.8)] active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Rahasia via WhatsApp</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="glass-celestial inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#E2E8F0] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9BB1E8]/50 active:scale-95"
                >
                  <Mail className="h-4 w-4 text-[#9BB1E8]" />
                  <span>Kirim via Email</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#A3B4D4]/70 transition-colors hover:text-[#F4F7FC] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Ubah tulisan harapan</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Sparkles className="pointer-events-none absolute top-6 right-6 h-5 w-5 text-[#9BB1E8]/30" />
      </motion.div>
    </section>
  );
}