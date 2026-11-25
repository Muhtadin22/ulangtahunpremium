"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { birthdayData } from "@/data/birthdayData";

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  playAudio: () => void;
  toggleMute: () => void;
  duckVolume: (duck: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.45;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const duckVolume = (duck: boolean) => {
    if (!audioRef.current) return;
    audioRef.current.volume = duck ? 0.1 : 0.45;
  };

  return (
    <AudioContext.Provider
      value={{ isPlaying, isMuted, playAudio, toggleMute, duckVolume }}
    >
      <audio
        ref={audioRef}
        src={birthdayData.audioPath}
        loop
        preload="auto"
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useBirthdayAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useBirthdayAudio harus digunakan di dalam AudioProvider");
  }
  return context;
}