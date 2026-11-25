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
      colors: ["#9333EA", "#C084FC", "#E9D5FF", "#F5D0FE"],
      scalar: 0.85,
    });
  };

  // Format pesan rahasia siap kirim ke WhatsApp & Email
  const formattedMessage = [
    `🔮 *Kapsul Harapan Ulang Tahun ke-${birthdayData.age}*`,
    `Dari: ${birthdayData.partnerName} (${birthdayData.birthdayDate})`,
    "",
    `"${trimmedWish}"`,
    "",
    "✨ Dikunci dari Midnight Birthday Capsule",
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
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9333EA]/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: DREAMY_EASE }}
        className="glass-velvet relative overflow-hidden rounded-3xl px-6 py-10 sm:px-11 sm:py-12"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C084FC]/30 bg-[#9333EA]/20 px-4 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#D8B4FE] uppercase">
            <Gem className="h-3.5 w-3.5 text-[#C084FC]" />
            {birthdayData.timeCapsule.eyebrow}
          </span>

          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F6F1FC] sm:text-5xl">
            {birthdayData.timeCapsule.title}
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#D8B4FE]/75 sm:text-base">
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
                className="w-full resize-none rounded-2xl border border-[#C084FC]/25 bg-[#0D0816]/85 p-5 text-sm leading-relaxed text-[#F6F1FC] placeholder:text-[#D8B4FE]/40 focus:border-[#C084FC]/70 focus:ring-2 focus:ring-[#9333EA]/35 focus:outline-none sm:text-base"
              />

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={!trimmedWish}
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
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
              {/* Animasi Kristal Ungu Bercahaya */}
              <motion.div
                initial={{ scale: 0.5, rotate: -18 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.75, ease: DREAMY_EASE }}
                className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E9D5FF]/50 bg-gradient-to-br from-[#9333EA]/70 via-[#6B21A8]/80 to-[#2E1065] shadow-[0_0_45px_rgba(168,85,247,0.75)]"
              >
                <motion.div
                  animate={{ opacity: [0.4, 0.95, 0.4], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-[#C084FC]/30 blur-xl"
                />
                <Gem className="relative z-10 h-9 w-9 text-[#F6F1FC]" />
              </motion.div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#E9D5FF] sm:text-3xl">
                {birthdayData.timeCapsule.lockedTitle}
              </h3>

              {/* Pratinjau Harapan Terkunci */}
              <div className="mt-4 w-full max-w-lg rounded-2xl border border-[#C084FC]/25 bg-[#0D0816]/75 px-5 py-4">
                <p className="font-serif text-lg italic leading-relaxed text-[#F6F1FC]/90">
                  “{trimmedWish}”
                </p>
              </div>

              <p className="mt-4 max-w-md text-xs leading-relaxed text-[#D8B4FE]/75 sm:text-sm">
                {birthdayData.timeCapsule.lockedSubtitle}
              </p>

              {/* Tombol Kirim ke WhatsApp & Email */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Rahasia via WhatsApp</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="glass-velvet inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#E9D5FF] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC]/50 active:scale-95"
                >
                  <Mail className="h-4 w-4 text-[#C084FC]" />
                  <span>Kirim via Email</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#D8B4FE]/60 transition-colors hover:text-[#F6F1FC] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Ubah tulisan harapan</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aksen Bintang Sudut */}
        <Sparkles className="pointer-events-none absolute top-6 right-6 h-5 w-5 text-[#C084FC]/30" />
      </motion.div>
    </section>
  );
}