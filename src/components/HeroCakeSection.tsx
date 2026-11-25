"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Camera,
  CameraOff,
  Loader2,
  RotateCw,
  ScanFace,
  Sparkles,
  Wind,
} from "lucide-react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { birthdayData, DREAMY_EASE } from "@/data/birthdayData";

const BentoCakeScene = dynamic(
  () => import("@/components/three/BentoCakeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-36 w-36 animate-pulse rounded-full bg-[#9333EA]/25 blur-xl" />
      </div>
    ),
  }
);

// Konfigurasi presisi tiupan fisik
const BLOW_HOLD_DURATION_MS = 1500; // Jeda 1.5 detik saat memperagakan tiupan sebelum lilin padam
const BLOW_GRACE_WINDOW_MS = 280; // Toleransi jeda mikro antar-frame agar progres tidak mudah reset
const BLOW_GESTURE_THRESHOLD = 0.36; // Sensitivitas bentuk bibir/pipi meniup

export default function HeroCakeSection() {
  const router = useRouter();

  const [isBlownOut, setIsBlownOut] = useState(false);
  const [isOpeningCamera, setIsOpeningCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSensorReady, setIsSensorReady] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isActivelyBlowing, setIsActivelyBlowing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0); // 0.0 - 1.0 (durasi 1.5 detik)
  const [flameBend, setFlameBend] = useState(0); // 0.0 - 1.0 (kemiringan api lilin)

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const landmarkerPromiseRef = useRef<Promise<FaceLandmarker> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const lastTimestampRef = useRef<number>(0);
  const hasTriggeredRef = useRef(false);

  // Redam log INFO internal TensorFlow Lite XNNPACK agar tidak memicu Next.js Dev Error Overlay
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (msg.includes("Created TensorFlow Lite XNNPACK delegate")) {
        console.info(...args);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Preload model MediaPipe di latar belakang sejak halaman dimuat agar kamera instan saat diklik
  const getOrInitLandmarker = useCallback(() => {
    if (landmarkerRef.current) {
      return Promise.resolve(landmarkerRef.current);
    }
    if (landmarkerPromiseRef.current) {
      return landmarkerPromiseRef.current;
    }

    const promise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      let instance: FaceLandmarker;
      try {
        instance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      } catch {
        instance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      }

      landmarkerRef.current = instance;
      setIsSensorReady(true);
      return instance;
    })();

    landmarkerPromiseRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    getOrInitLandmarker().catch(() => {
      // Akan dicoba ulang saat user menekan tombol kamera
    });
  }, [getOrInitLandmarker]);

  const stopCameraAndSensor = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (landmarkerRef.current) {
      landmarkerRef.current.close();
      landmarkerRef.current = null;
      landmarkerPromiseRef.current = null;
    }
    setIsCameraActive(false);
    setIsFaceDetected(false);
    setIsActivelyBlowing(false);
  }, []);

  // Dipanggil setelah user memperagakan tiupan selama jeda 1.5 detik
  const completeCandleBlow = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    stopCameraAndSensor();
    setHoldProgress(1);
    setFlameBend(1);
    setIsBlownOut(true);

    confetti({
      particleCount: 85,
      spread: 85,
      origin: { y: 0.55 },
      colors: ["#9333EA", "#C084FC", "#E9D5FF", "#F5D0FE", "#FBBF24"],
      scalar: 0.9,
    });

    setTimeout(() => {
      router.push("/celebration");
    }, 2200);
  }, [router, stopCameraAndSensor]);

  useEffect(() => {
    return () => {
      stopCameraAndSensor();
    };
  }, [stopCameraAndSensor]);

  const startPhysicalBlowDetection = useCallback(
    (landmarker: FaceLandmarker) => {
      let accumulatedBlowMs = 0;
      let lastBlowActiveTime = 0;
      let prevFrameTime = performance.now();

      const detectLoop = () => {
        if (hasTriggeredRef.current) return;

        const video = videoRef.current;
        const now = performance.now();
        const deltaMs = Math.min(100, now - prevFrameTime);
        prevFrameTime = now;

        if (
          video &&
          video.readyState >= 2 &&
          video.videoWidth > 0 &&
          video.videoHeight > 0 &&
          video.currentTime !== lastVideoTimeRef.current &&
          now > lastTimestampRef.current
        ) {
          lastVideoTimeRef.current = video.currentTime;
          lastTimestampRef.current = now;

          const results = landmarker.detectForVideo(video, now);

          if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            setIsFaceDetected(true);
            const categories = results.faceBlendshapes[0].categories;

            const getScore = (name: string) =>
              categories.find((c) => c.categoryName === name)?.score ?? 0;

            const mouthPucker = getScore("mouthPucker"); // Bibir mengerucut meniup
            const mouthFunnel = getScore("mouthFunnel"); // Bibir membulat kecil
            const cheekPuff = getScore("cheekPuff"); // Pipi menggembung
            const jawOpen = getScore("jawOpen"); // Filter menguap/tertawa lebar
            const smileAvg =
              (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;

            const isFalseExpression = jawOpen > 0.42 || smileAvg > 0.45;
            const gestureStrength = isFalseExpression
              ? 0
              : Math.max(mouthPucker, mouthFunnel * 0.95, cheekPuff * 0.85);

            const isBlowingNow = gestureStrength >= BLOW_GESTURE_THRESHOLD;
            setIsActivelyBlowing(isBlowingNow);

            if (isBlowingNow) {
              lastBlowActiveTime = now;
              accumulatedBlowMs = Math.min(
                BLOW_HOLD_DURATION_MS,
                accumulatedBlowMs + deltaMs
              );
            } else if (now - lastBlowActiveTime > BLOW_GRACE_WINDOW_MS) {
              // Kurangi progres perlahan jika berhenti meniup sebelum 1.5 detik selesai
              accumulatedBlowMs = Math.max(0, accumulatedBlowMs - deltaMs * 1.2);
            }

            const progress = accumulatedBlowMs / BLOW_HOLD_DURATION_MS;
            setHoldProgress(progress);

            // Api langsung miring saat bibir meniup, dan makin rebah mendekati 1.5 detik
            setFlameBend(
              isBlowingNow ? Math.max(0.45, progress) : progress * 0.6
            );

            if (accumulatedBlowMs >= BLOW_HOLD_DURATION_MS) {
              completeCandleBlow();
              return;
            }
          } else {
            setIsFaceDetected(false);
            setIsActivelyBlowing(false);
            if (now - lastBlowActiveTime > BLOW_GRACE_WINDOW_MS) {
              accumulatedBlowMs = Math.max(0, accumulatedBlowMs - deltaMs);
              setHoldProgress(accumulatedBlowMs / BLOW_HOLD_DURATION_MS);
              setFlameBend(0);
            }
          }
        }

        rafRef.current = requestAnimationFrame(detectLoop);
      };

      rafRef.current = requestAnimationFrame(detectLoop);
    },
    [completeCandleBlow]
  );

  // Langsung putar video kamera begitu aktif, lalu pasang sensor wajah tanpa blocking UI
  useEffect(() => {
    if (!isCameraActive || !videoRef.current || !streamRef.current) return;

    let cancelled = false;
    const video = videoRef.current;
    video.srcObject = streamRef.current;

    video
      .play()
      .then(() => getOrInitLandmarker())
      .then((landmarker) => {
        if (!cancelled) {
          startPhysicalBlowDetection(landmarker);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isCameraActive, getOrInitLandmarker, startPhysicalBlowDetection]);

  const handleEnableCamera = async () => {
    setCameraError(null);
    setIsOpeningCamera(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsOpeningCamera(false);
      setCameraError("Browser ini tidak mendukung akses kamera.");
      return;
    }

    try {
      // Resolusi ringan 360x360 agar kamera depan HP/laptop terbuka dalam sekejap
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 360 },
          height: { ideal: 360 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsOpeningCamera(false);
      // Tampilkan kamera seketika tanpa menunggu model selesai inisialisasi
      setIsCameraActive(true);
    } catch {
      setIsOpeningCamera(false);
      stopCameraAndSensor();
      setCameraError(
        "Izin kamera ditolak atau perangkat tidak memiliki kamera. Kamu bisa meniup manual di bawah."
      );
    }
  };

  // Perhitungan SVG cincin progres melingkar di sekeliling cermin kamera
  const ringRadius = 106;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - holdProgress);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-12 pb-16">
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7E22CE]/20 blur-[120px]" />

      {/* Header Ucapan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: DREAMY_EASE }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="text-xs font-semibold tracking-[0.28em] text-[#C084FC] uppercase">
          {birthdayData.hero.eyebrow} • {birthdayData.birthdayDate}
        </p>

        <h1 className="mt-2.5 font-serif text-4xl font-semibold tracking-tight text-[#F6F1FC] sm:text-6xl">
          Happy {birthdayData.age}
          <span className="align-super text-xl font-normal italic text-[#C084FC] sm:text-2xl">
            nd
          </span>{" "}
          Birthday,{" "}
          <span className="bg-gradient-to-r from-[#D8B4FE] via-[#C084FC] to-[#A855F7] bg-clip-text italic text-transparent">
            {birthdayData.partnerName}
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#D8B4FE]/75 sm:text-base">
          {birthdayData.hero.subtitle}
        </p>
      </motion.div>

      {/* Panggung Utama: Kue 3D + Cermin Kamera Gestur Fisik */}
      <div className="relative z-10 mt-3 flex w-full max-w-4xl flex-col items-center justify-center gap-6 md:flex-row">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.1, ease: DREAMY_EASE }}
          className="relative h-[320px] w-full max-w-md sm:h-[390px]"
        >
          <BentoCakeScene isBlownOut={isBlownOut} blowIntensity={flameBend} />

          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#C084FC]/20 bg-[#140E21]/80 px-3.5 py-1 text-xs text-[#D8B4FE]/80 backdrop-blur-md">
            <RotateCw className="h-3 w-3 text-[#C084FC]" />
            <span>Geser untuk memutar kue 3D</span>
          </div>
        </motion.div>

        {/* Cermin Kamera Deteksi Gestur Meniup + Cincin Progres 1.5 Detik */}
        <AnimatePresence>
          {isCameraActive && !isBlownOut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 10 }}
              transition={{ duration: 0.45, ease: DREAMY_EASE }}
              className="glass-velvet flex flex-col items-center rounded-3xl p-4 text-center"
            >
              <div className="relative flex h-56 w-56 items-center justify-center">
                {/* Cincin Progres 1.5 Detik di Sekeliling Kamera */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 224 224"
                >
                  <circle
                    cx="112"
                    cy="112"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(192, 132, 252, 0.18)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r={ringRadius}
                    fill="none"
                    stroke="#C084FC"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className="transition-[stroke-dashoffset] duration-75"
                  />
                </svg>

                {/* Lingkaran Video Kamera */}
                <div
                  className={`relative h-48 w-48 overflow-hidden rounded-full border transition-colors duration-200 ${
                    isActivelyBlowing
                      ? "border-[#E9D5FF] shadow-[0_0_34px_rgba(192,132,252,0.75)]"
                      : isFaceDetected
                      ? "border-[#C084FC]/70 shadow-[0_0_24px_rgba(147,51,234,0.45)]"
                      : "border-[#C084FC]/30"
                  }`}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full -scale-x-100 object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-full ring-inset ring-6 ring-[#09060E]/30" />
                </div>
              </div>

              {/* Status & Instruksi Real-Time */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#E9D5FF]">
                {!isSensorReady ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C084FC]" />
                    <span>Mengaktifkan sensor wajah...</span>
                  </>
                ) : isActivelyBlowing ? (
                  <>
                    <Wind className="h-3.5 w-3.5 animate-bounce text-[#C084FC]" />
                    <span>Tahan tiupan... {Math.round(holdProgress * 100)}%</span>
                  </>
                ) : isFaceDetected ? (
                  <>
                    <Wind className="h-3.5 w-3.5 text-[#C084FC]" />
                    <span>Siap! Peragakan tiupan ke layar</span>
                  </>
                ) : (
                  <>
                    <ScanFace className="h-3.5 w-3.5 text-[#D8B4FE]/70" />
                    <span>Arahkan wajah ke lingkaran kamera</span>
                  </>
                )}
              </div>

              <p className="mt-1.5 max-w-[225px] text-[11px] leading-relaxed text-[#D8B4FE]/75">
                Kerucutkan bibir seperti meniup lilin dan tahan selama 1,5 detik hingga padam.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tombol Aksi & Pesan Transisi */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.25, ease: DREAMY_EASE }}
        className="relative z-10 mt-5 flex flex-col items-center text-center"
      >
        {!isBlownOut && (
          <>
            {!isCameraActive && (
              <button
                onClick={handleEnableCamera}
                disabled={isOpeningCamera}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(147,51,234,0.65)] ring-1 ring-[#E9D5FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(168,85,247,0.8)] active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isOpeningCamera ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Membuka Kamera...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>Tiup Lilin dengan Kamera</span>
                  </>
                )}
              </button>
            )}

            {cameraError && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-[#F5D0FE]/85">
                <CameraOff className="h-3.5 w-3.5 text-[#C084FC]" />
                <span>{cameraError}</span>
              </p>
            )}

            <button
              onClick={completeCandleBlow}
              className="mt-3.5 text-xs font-medium text-[#D8B4FE]/65 underline decoration-[#C084FC]/40 underline-offset-4 transition-colors hover:text-[#F6F1FC] cursor-pointer"
            >
              Atau ketuk di sini untuk tiup manual
            </button>
          </>
        )}

        <AnimatePresence>
          {isBlownOut && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: DREAMY_EASE }}
              className="glass-velvet mt-4 max-w-md rounded-3xl px-7 py-6 text-center"
            >
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C084FC]">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>{birthdayData.hero.wishMessageTitle}</span>
              </div>
              <p className="mt-2 font-serif text-xl leading-relaxed text-[#F6F1FC]">
                {birthdayData.hero.wishMessageBody}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}