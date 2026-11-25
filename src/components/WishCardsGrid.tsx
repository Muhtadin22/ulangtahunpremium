"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, RotateCw, Sparkles } from "lucide-react";
import {
  birthdayData,
  DREAMY_EASE,
  WishCardItem,
} from "@/data/birthdayData";

interface FlipWishCardProps {
  item: WishCardItem;
  index: number;
  isOpened: boolean;
  onFlipOpen: (id: string) => void;
}

function FlipWishCard({
  item,
  index,
  isOpened,
  onFlipOpen,
}: FlipWishCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLButtonElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Spotlight kursor hanya aktif di mouse agar tidak menyangkut saat scroll di HP
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, opacity: 1 });
  };

  const handlePointerLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCardClick = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped) {
      onFlipOpen(item.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: DREAMY_EASE }}
      className="perspective-1000 h-64 w-full"
    >
      <motion.button
        ref={cardRef}
        type="button"
        onClick={handleCardClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileTap={{ scale: 0.97 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.72, ease: DREAMY_EASE }}
        style={{ transformStyle: "preserve-3d" }}
        className="preserve-3d relative h-full w-full cursor-pointer text-left focus:outline-none"
      >
        {/* ================= SISI DEPAN ================= */}
        <div
          className={`backface-hidden card-face-front absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#9BB1E8]/30 bg-gradient-to-br ${item.accentBg} p-6 shadow-[0_18px_42px_-12px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(226,232,240,0.18)] transition-colors duration-300 hover:border-[#9BB1E8]/55`}
        >
          {/* Glow Ambient Lembut (Selalu Terlihat di HP & Desktop) */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#7AA2F7]/15 blur-2xl" />

          {/* Spotlight Tambahan untuk Mouse Desktop */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: spotlight.opacity,
              background: `radial-gradient(240px circle at ${spotlight.x}% ${spotlight.y}%, rgba(155, 177, 232, 0.22), transparent 75%)`,
            }}
          />

          <div className="pointer-events-none absolute top-3 right-3 h-6 w-6 rounded-tr-xl border-t border-r border-[#9BB1E8]/30" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 rounded-bl-xl border-b border-l border-[#9BB1E8]/30" />

          <div className="relative z-10 flex w-full items-center justify-between">
            <span className="rounded-full border border-[#9BB1E8]/30 bg-[#4F75D1]/20 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#CBD5E1] uppercase">
              {item.tag}
            </span>
            <span className="font-mono text-xs text-[#9BB1E8]/70">
              0{index + 1}
            </span>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E8F0]/20 bg-[#0A1126]/80 text-3xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
              {item.frontEmoji}
            </div>
            <h3 className="mt-3.5 font-serif text-2xl font-semibold leading-snug text-[#F4F7FC]">
              {item.frontTitle}
            </h3>
          </div>

          <div className="relative z-10 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-[#9BB1E8]">
            <RotateCw className="h-3 w-3" />
            <span>{isOpened ? "Ketuk untuk baca lagi" : "Tap buat buka isi hatiku"}</span>
          </div>
        </div>

        {/* ================= SISI BELAKANG ================= */}
        <div className="backface-hidden card-face-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#9BB1E8]/40 bg-gradient-to-b from-[#16244A] via-[#0E1730] to-[#080D1C] p-6 text-center shadow-[0_22px_50px_-12px_rgba(0,0,0,0.88),0_0_26px_-8px_rgba(122,162,247,0.3)]">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-[#9BB1E8] uppercase">
            <span>#{index + 1}</span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3 w-3 fill-[#7AA2F7] text-[#7AA2F7]" />
              {item.tag}
            </span>
            <span>✦</span>
          </div>

          <p className="my-auto font-serif text-lg leading-relaxed text-[#F4F7FC] sm:text-xl">
            “{item.backMessage}”
          </p>

          <div className="border-t border-[#9BB1E8]/15 pt-2.5 text-[11px] font-medium tracking-wider text-[#A3B4D4] italic">
            — {item.footerNote}
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function WishCardsGrid() {
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const totalCards = birthdayData.wishCards.length;
  const allOpened = openedIds.length === totalCards;

  const handleFlipOpen = (id: string) => {
    setOpenedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length === totalCards) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#7AA2F7", "#9BB1E8", "#E2E8F0"],
          scalar: 0.85,
        });
      }
      return next;
    });
  };

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B4C9B]/15 blur-3xl sm:h-96 sm:w-96 sm:blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: DREAMY_EASE }}
        className="relative z-10 mx-auto max-w-xl text-center"
      >
        <span className="text-xs font-semibold tracking-[0.28em] text-[#9BB1E8] uppercase">
          {birthdayData.notesSection.eyebrow}
        </span>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#F4F7FC] sm:text-5xl">
          {birthdayData.notesSection.title}
        </h2>

        <p className="mt-3 text-sm text-[#A3B4D4] sm:text-base">
          {birthdayData.notesSection.subtitle}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#9BB1E8]/25 bg-[#0F172E]/85 px-4 py-1.5 text-xs font-medium text-[#CBD5E1]">
          <Sparkles className="h-3.5 w-3.5 text-[#7AA2F7]" />
          <span>
            {allOpened
              ? birthdayData.notesSection.allOpenedToast
              : `Kartu terbaca: ${openedIds.length} / ${totalCards}`}
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {birthdayData.wishCards.map((item, idx) => (
          <FlipWishCard
            key={item.id}
            item={item}
            index={idx}
            isOpened={openedIds.includes(item.id)}
            onFlipOpen={handleFlipOpen}
          />
        ))}
      </div>
    </section>
  );
}