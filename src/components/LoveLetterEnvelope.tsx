"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MailOpen, Mic, Pause, Play } from "lucide-react";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";
import { useBirthdayAudio } from "@/context/AudioContext";

const WAVE_BAR_HEIGHTS = [32, 65, 45, 88, 55, 100, 70, 42, 92, 60, 78, 48, 84, 52, 68, 36];

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SecretVoiceNotePlayer({ isEnvelopeOpen }: { isEnvelopeOpen: boolean }) {
  const { duckVolume } = useBirthdayAudio();
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  // Kembalikan volume BGM jika amplop ditutup atau komponen di-unmount
  useEffect(() => {
    if (!isEnvelopeOpen && voiceRef.current && !voiceRef.current.paused) {
      voiceRef.current.pause();
      setIsVoicePlaying(false);
      duckVolume(false);
    }
  }, [isEnvelopeOpen, duckVolume]);

  useEffect(() => {
    return () => {
      duckVolume(false);
    };
  }, [duckVolume]);

  const toggleVoiceNote = () => {
    const audio = voiceRef.current;
    if (!audio) return;

    if (isVoicePlaying) {
      audio.pause();
      setIsVoicePlaying(false);
      duckVolume(false);
    } else {
      setAudioError(false);
      audio.volume = 1.0;
      audio
        .play()
        .then(() => {
          setIsVoicePlaying(true);
          duckVolume(true); // Otomatis kecilkan BGM agar suara terdengar jernih
        })
        .catch(() => {
          setAudioError(true);
          setIsVoicePlaying(false);
          duckVolume(false);
        });
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.75,
        delay: 0.45 + birthdayData.loveLetter.paragraphs.length * 0.16,
        ease: DREAMY_EASE,
      }}
      className="mt-8 rounded-2xl border border-[#C084FC]/30 bg-[#120B1F]/80 p-4 sm:p-5"
    >
      <audio
        ref={voiceRef}
        src={birthdayData.loveLetter.voiceNote.audioPath}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => {
          setIsVoicePlaying(false);
          setCurrentTime(0);
          duckVolume(false);
        }}
        onError={() => {
          setAudioError(true);
          setIsVoicePlaying(false);
          duckVolume(false);
        }}
      />

      <div className="flex items-center gap-4">
        {/* Tombol Play / Pause */}
        <button
          type="button"
          onClick={toggleVoiceNote}
          aria-label={isVoicePlaying ? "Jeda pesan suara" : "Putar pesan suara"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9333EA] to-[#6B21A8] text-white shadow-[0_6px_20px_rgba(147,51,234,0.6)] ring-1 ring-[#E9D5FF]/35 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isVoicePlaying ? (
            <Pause className="h-5 w-5 fill-white" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          )}
        </button>

        {/* Info + Visualizer Gelombang Ungu */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 truncate text-xs font-semibold tracking-wide text-[#F6F1FC] sm:text-sm">
              <Mic className="h-3.5 w-3.5 shrink-0 text-[#C084FC]" />
              <span className="truncate">
                {birthdayData.loveLetter.voiceNote.title}
              </span>
            </p>
            <span className="shrink-0 font-mono text-[11px] text-[#D8B4FE]/75">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          {/* Visualizer Gelombang Ungu Animasi */}
          <div className="mt-2.5 flex h-7 items-center gap-1">
            {WAVE_BAR_HEIGHTS.map((peak, idx) => {
              const barPct = ((idx + 1) / WAVE_BAR_HEIGHTS.length) * 100;
              const isPassed = barPct <= progressPct;

              return (
                <motion.span
                  key={idx}
                  className={`flex-1 rounded-full transition-colors duration-200 ${
                    isPassed || isVoicePlaying
                      ? "bg-gradient-to-t from-[#7E22CE] via-[#A855F7] to-[#E9D5FF]"
                      : "bg-[#C084FC]/25"
                  }`}
                  animate={
                    isVoicePlaying
                      ? {
                          height: [
                            `${Math.max(22, peak * 0.35)}%`,
                            `${peak}%`,
                            `${Math.max(25, peak * 0.45)}%`,
                          ],
                        }
                      : { height: `${Math.max(20, peak * 0.35)}%` }
                  }
                  transition={
                    isVoicePlaying
                      ? {
                          duration: 0.65 + (idx % 4) * 0.14,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: idx * 0.04,
                        }
                      : { duration: 0.35 }
                  }
                />
              );
            })}
          </div>

          <p className="mt-1.5 text-[11px] text-[#D8B4FE]/65">
            {audioError
              ? `Letakkan rekaman suaramu di public${birthdayData.loveLetter.voiceNote.audioPath}`
              : birthdayData.loveLetter.voiceNote.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoveLetterEnvelope() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative mx-auto max-w-3xl px-5 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: DREAMY_EASE }}
        className="text-center"
      >
        <span className="text-xs font-semibold tracking-[0.28em] text-[#C084FC] uppercase">
          Midnight Letter
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#F6F1FC] sm:text-5xl">
          Sepucuk Surat Untukmu
        </h2>
      </motion.div>

      <div className="mt-12 flex flex-col items-center">
        {/* Amplop Beludru Hitam & Ungu */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.45, ease: DREAMY_EASE }}
          className="relative w-full max-w-md cursor-pointer focus:outline-none"
        >
          <div className="relative mx-auto h-56 w-full overflow-hidden rounded-3xl border border-[#C084FC]/30 bg-gradient-to-br from-[#231538] via-[#170E26] to-[#2E194A] shadow-[0_24px_55px_-14px_rgba(0,0,0,0.85),0_0_30px_-8px_rgba(147,51,234,0.35)] sm:h-64">
            <motion.div
              animate={{
                rotateX: isOpen ? 180 : 0,
                opacity: isOpen ? 0.55 : 1,
              }}
              transition={{ duration: 0.75, ease: DREAMY_EASE }}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-0 z-20 h-32"
            >
              <div
                className="h-full w-full"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #3B1E66 0%, #241240 100%)",
                }}
              />
            </motion.div>

            <div
              className="absolute inset-0 z-10 opacity-40"
              style={{
                clipPath: "polygon(0 100%, 50% 45%, 100% 100%)",
                background: "#0B0712",
              }}
            />

            <motion.div
              animate={{ scale: isOpen ? 0.85 : 1, y: isOpen ? 14 : 0 }}
              transition={{ duration: 0.6, ease: DREAMY_EASE }}
              className="absolute top-1/2 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E9D5FF]/45 bg-gradient-to-br from-[#9333EA] to-[#581C87] text-white shadow-[0_8px_24px_rgba(147,51,234,0.75)]"
            >
              {isOpen ? (
                <MailOpen className="h-6 w-6" />
              ) : (
                <Heart className="h-6 w-6 fill-[#F6F1FC]" />
              )}
            </motion.div>

            <p className="absolute right-0 bottom-5 left-0 z-20 text-center text-xs font-medium tracking-wide text-[#D8B4FE]/85">
              {isOpen
                ? "Ketuk lagi untuk menutup amplop"
                : birthdayData.loveLetter.envelopePrompt}
            </p>
          </div>
        </motion.button>

        {/* Kertas Surat + Voice Note Rahasia */}
        <AnimatePresence>
          {isOpen && (
            <motion.article
              initial={{ opacity: 0, y: -26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.75, ease: DREAMY_EASE }}
              className="glass-velvet relative -mt-4 w-full max-w-2xl rounded-3xl px-7 py-9 sm:px-12 sm:py-12"
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: DREAMY_EASE }}
                className="font-serif text-2xl font-semibold italic text-[#C084FC] sm:text-3xl"
              >
                {birthdayData.loveLetter.salutation}
              </motion.p>

              <div className="mt-6 space-y-5 text-sm leading-8 text-[#F6F1FC]/90 sm:text-base">
                {birthdayData.loveLetter.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.28 + index * 0.16,
                      ease: DREAMY_EASE,
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.35 + birthdayData.loveLetter.paragraphs.length * 0.16,
                  ease: DREAMY_EASE,
                }}
                className="mt-8 border-t border-[#C084FC]/20 pt-5 text-right"
              >
                <p className="text-xs tracking-[0.2em] text-[#D8B4FE]/65 uppercase">
                  {birthdayData.loveLetter.closing}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#C084FC]">
                  {birthdayData.loveLetter.signature}
                </p>
              </motion.div>

              {/* Pemutar Voice Note Rahasia dengan Auto-Ducking BGM */}
              <SecretVoiceNotePlayer isEnvelopeOpen={isOpen} />
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}