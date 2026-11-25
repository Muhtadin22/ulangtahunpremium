"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import {
  birthdayData,
  DREAMY_EASE,
  WishCardItem,
} from "@/data/birthdayData";

function FlipWishCard({ item, index }: { item: WishCardItem; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: DREAMY_EASE }}
      className="perspective-1000 h-56 w-full"
    >
      <motion.button
        type="button"
        onClick={() => setIsFlipped((prev) => !prev)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: DREAMY_EASE }}
        className="preserve-3d relative h-full w-full cursor-pointer text-left focus:outline-none"
      >
        {/* Sisi Depan Dark Plum & Royal Border */}
        <div
          className={`backface-hidden glass-velvet absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${item.accentBg} p-6 text-center transition-colors hover:border-[#C084FC]/45`}
        >
          <span className="text-3xl drop-shadow-[0_4px_12px_rgba(192,132,252,0.4)]">
            {item.frontEmoji}
          </span>
          <h3 className="mt-3 font-serif text-2xl font-semibold text-[#F6F1FC]">
            {item.frontTitle}
          </h3>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#C084FC]">
            <RotateCw className="h-3 w-3" />
            Ketuk untuk balik
          </span>
        </div>

        {/* Sisi Belakang */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-[#C084FC]/35 bg-gradient-to-b from-[#231538] to-[#120B1F] p-6 text-center shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <p className="font-serif text-lg leading-relaxed text-[#F6F1FC] sm:text-xl">
            “{item.backMessage}”
          </p>
          <span className="mt-4 text-[11px] font-semibold tracking-[0.22em] text-[#C084FC] uppercase">
            #{index + 1} Grateful For You
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function WishCardsGrid() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: DREAMY_EASE }}
        className="mx-auto max-w-xl text-center"
      >
        <span className="text-xs font-semibold tracking-[0.28em] text-[#C084FC] uppercase">
          Little Notes
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#F6F1FC] sm:text-5xl">
          Alasan Aku Bersyukur Punya Kamu
        </h2>
        <p className="mt-3 text-sm text-[#D8B4FE]/75 sm:text-base">
          Ketuk setiap kartu untuk membaca pesan kecil di baliknya.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {birthdayData.wishCards.map((item, idx) => (
          <FlipWishCard key={item.id} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
}