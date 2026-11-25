"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Heart, Ribbon, Sparkles, Star, X } from "lucide-react";
import {
  birthdayData,
  DREAMY_EASE,
  PolaroidMemory,
} from "@/data/birthdayData";

function StickerBadge({ type }: { type: PolaroidMemory["sticker"] }) {
  const icons = {
    heart: <Heart className="h-4 w-4 fill-[#A855F7] text-[#D8B4FE]" />,
    sparkle: <Sparkles className="h-4 w-4 text-[#C084FC]" />,
    ribbon: <Ribbon className="h-4 w-4 text-[#D8B4FE]" />,
    star: <Star className="h-4 w-4 fill-[#9333EA] text-[#E9D5FF]" />,
  };

  return (
    <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#C084FC]/35 bg-[#191129] shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
      {icons[type]}
    </div>
  );
}

function PolaroidCard({
  memory,
  onSelect,
}: {
  memory: PolaroidMemory;
  onSelect: (m: PolaroidMemory) => void;
}) {
  const [imgError, setImgError] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 220,
    damping: 22,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: DREAMY_EASE }}
      className="perspective-1000"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ: memory.rotation,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.03, rotateZ: 0 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.45, ease: DREAMY_EASE }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={() => onSelect(memory)}
        className="relative cursor-pointer rounded-3xl border border-[#C084FC]/25 bg-gradient-to-b from-[#1B122B]/90 to-[#110B1C]/95 p-3.5 pb-6 shadow-[0_20px_45px_-14px_rgba(0,0,0,0.85),0_0_24px_-8px_rgba(147,51,234,0.28)] backdrop-blur-md"
      >
        {/* Selotip Washi Amethyst Translucent */}
        <div className="pointer-events-none absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-sm border border-[#E9D5FF]/20 bg-[#9333EA]/40 backdrop-blur-xs" />

        {/* Stiker Mini */}
        <StickerBadge type={memory.sticker} />

        {/* Bingkai Foto */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#C084FC]/15 bg-gradient-to-br from-[#261740] via-[#150E22] to-[#341C59]">
          {!imgError ? (
            <img
              src={memory.image}
              alt={memory.caption}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <Heart className="h-8 w-8 text-[#C084FC]/60" />
              <p className="mt-2 text-xs text-[#D8B4FE]/65">
                Letakkan foto di <br />
                <code className="font-mono text-[11px] text-[#E9D5FF]">{memory.image}</code>
              </p>
            </div>
          )}
        </div>

        {/* Caption Polaroid */}
        <div className="mt-4 px-1 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C084FC] uppercase">
            {memory.date}
          </p>
          <p className="mt-1 font-serif text-lg leading-snug text-[#F6F1FC]">
            {memory.caption}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PolaroidGallery() {
  const [selectedMemory, setSelectedMemory] = useState<PolaroidMemory | null>(
    null
  );

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
          Velvet Scrapbook
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#F6F1FC] sm:text-5xl">
          Potongan Momen Favorit Kita
        </h2>
        <p className="mt-3 text-sm text-[#D8B4FE]/75 sm:text-base">
          Sentuh atau klik tiap polaroid untuk melihat kenangan lebih dekat.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4">
        {birthdayData.memories.map((memory) => (
          <PolaroidCard
            key={memory.id}
            memory={memory}
            onSelect={setSelectedMemory}
          />
        ))}
      </div>

      {/* Modal Zoom Dark Velvet */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: DREAMY_EASE }}
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050308]/80 p-5 backdrop-blur-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.45, ease: DREAMY_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="glass-velvet relative w-full max-w-md overflow-hidden rounded-3xl p-4 pb-6"
            >
              <button
                onClick={() => setSelectedMemory(null)}
                aria-label="Tutup pratinjau"
                className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#C084FC]/30 bg-[#140E21]/85 text-[#F6F1FC] shadow-lg backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#261740] to-[#150E22]">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.caption}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 px-2 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#C084FC] uppercase">
                  {selectedMemory.date}
                </p>
                <p className="mt-1.5 font-serif text-2xl leading-snug text-[#F6F1FC]">
                  {selectedMemory.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}