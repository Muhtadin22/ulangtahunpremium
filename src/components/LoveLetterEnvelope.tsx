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
  const voiceRef = useRef<HTMLVideoElement | null>(null);

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

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
    const media = voiceRef.current;
    if (!media) return;

    if (isVoicePlaying) {
      media.pause();
      setIsVoicePlaying(false);
      duckVolume(false);
    } else {
      setAudioError(false);
      media.volume = 1.0;
      media
        .play()
        .then(() => {
          setIsVoicePlaying(true);
          duckVolume(true);
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
      className="mt-8 rounded-2xl border border-[#9BB1E8]/30 bg-[#080E1E]/85 p-4 sm:p-5"
    >
      {/* Mendukung .mp4 sekaligus .mp3 di iOS & Android */}
      <video
        ref={voiceRef}
        src={birthdayData.loveLetter.voiceNote.audioPath}
        preload="metadata"
        playsInline
        className="hidden"
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
        <button
          type="button"
          onClick={toggleVoiceNote}
          aria-label={isVoicePlaying ? "Jeda pesan suara" : "Putar pesan suara"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4F75D1] to-[#1E3A8A] text-white shadow-[0_6px_20px_rgba(79,117,209,0.6)] ring-1 ring-[#E2E8F0]/35 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isVoicePlaying ? (
            <Pause className="h-5 w-5 fill-white" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 truncate text-xs font-semibold tracking-wide text-[#F4F7FC] sm:text-sm">
              <Mic className="h-3.5 w-3.5 shrink-0 text-[#9BB1E8]" />
              <span className="truncate">
                {birthdayData.loveLetter.voiceNote.title}
              </span>
            </p>
            <span className="shrink-0 font-mono text-[11px] text-[#A3B4D4]">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          {/* Visualizer Gelombang Starlight Silver-Blue */}
          <div className="mt-2.5 flex h-7 items-center gap-1">
            {WAVE_BAR_HEIGHTS.map((peak, idx) => {
              const barPct = ((idx + 1) / WAVE_BAR_HEIGHTS.length) * 100;
              const isPassed = barPct <= progressPct;

              return (
                <motion.span
                  key={idx}
                  className={`flex-1 rounded-full transition-colors duration-200 ${
                    isPassed || isVoicePlaying
                      ? "bg-gradient-to-t from-[#2B4C9B] via-[#7AA2F7] to-[#E2E8F0]"
                      : "bg-[#9BB1E8]/25"
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

          <p className="mt-1.5 text-[11px] text-[#A3B4D4]/80">
            {audioError
              ? `Letakkan file suara kamu di public${birthdayData.loveLetter.voiceNote.audioPath}`
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
        <span className="text-xs font-semibold tracking-[0.28em] text-[#9BB1E8] uppercase">
          Starlight Letter
        </span>
        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#F4F7FC] sm:text-5xl">
          Sepucuk Surat Untukmu
        </h2>
      </motion.div>

      <div className="mt-12 flex flex-col items-center">
        {/* Amplop Satin Midnight Navy & Silver Seal */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.45, ease: DREAMY_EASE }}
          className="relative w-full max-w-md cursor-pointer focus:outline-none"
        >
          <div className="relative mx-auto h-56 w-full overflow-hidden rounded-3xl border border-[#9BB1E8]/30 bg-gradient-to-br from-[#16244A] via-[#0D162E] to-[#1E3163] shadow-[0_24px_55px_-14px_rgba(0,0,0,0.85),0_0_30px_-8px_rgba(122,162,247,0.3)] sm:h-64">
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
                  background: "linear-gradient(180deg, #243B75 0%, #142247 100%)",
                }}
              />
            </motion.div>

            <div
              className="absolute inset-0 z-10 opacity-45"
              style={{
                clipPath: "polygon(0 100%, 50% 45%, 100% 100%)",
                background: "#060913",
              }}
            />

            {/* Segel Lilin Celestial Sapphire & Silver */}
            <motion.div
              animate={{ scale: isOpen ? 0.85 : 1, y: isOpen ? 14 : 0 }}
              transition={{ duration: 0.6, ease: DREAMY_EASE }}
              className="absolute top-1/2 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0]/45 bg-gradient-to-br from-[#4F75D1] to-[#1E3A8A] text-white shadow-[0_8px_24px_rgba(79,117,209,0.75)]"
            >
              {isOpen ? (
                <MailOpen className="h-6 w-6" />
              ) : (
                <Heart className="h-6 w-6 fill-[#F4F7FC]" />
              )}
            </motion.div>

            <p className="absolute right-0 bottom-5 left-0 z-20 text-center text-xs font-medium tracking-wide text-[#CBD5E1]/90">
              {isOpen
                ? "Ketuk lagi untuk menutup amplop"
                : birthdayData.loveLetter.envelopePrompt}
            </p>
          </div>
        </motion.button>

        {/* Kertas Surat */}
        <AnimatePresence>
          {isOpen && (
            <motion.article
              initial={{ opacity: 0, y: -26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.75, ease: DREAMY_EASE }}
              className="glass-celestial relative -mt-4 w-full max-w-2xl rounded-3xl px-7 py-9 sm:px-12 sm:py-12"
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: DREAMY_EASE }}
                className="font-serif text-2xl font-semibold italic text-[#9BB1E8] sm:text-3xl"
              >
                {birthdayData.loveLetter.salutation}
              </motion.p>

              <div className="mt-6 space-y-5 text-sm leading-8 text-[#F4F7FC]/90 sm:text-base">
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
                className="mt-8 border-t border-[#9BB1E8]/20 pt-5 text-right"
              >
                <p className="text-xs tracking-[0.2em] text-[#A3B4D4] uppercase">
                  {birthdayData.loveLetter.closing}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#9BB1E8]">
                  {birthdayData.loveLetter.signature}
                </p>
              </motion.div>

              <SecretVoiceNotePlayer isEnvelopeOpen={isOpen} />
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}