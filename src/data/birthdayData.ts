export interface PolaroidMemory {
  id: string;
  image: string;
  caption: string;
  date: string;
  rotation: number;
  sticker: "heart" | "sparkle" | "ribbon" | "star";
}

export interface WishCardItem {
  id: string;
  tag: string;
  frontTitle: string;
  frontEmoji: string;
  backMessage: string;
  footerNote: string;
  accentBg: string;
}

export const DREAMY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const birthdayData = {
  // === 1. IDENTITAS UTAMA & ASET ===
  partnerName: "Hani",
  partnerNickname: "Sayang",
  senderName: "Kamu yang Selalu Mengagumimu",
  age: 22,
  birthdayDate: "25 November 2026",
  snapshotDateLabel: "25 Nov 2026", // Tercetak otomatis di bingkai Polaroid Candid
  audioPath: "/audio/birthday-bgm.mp3",

  // === 2. KONTAK PENGIRIM HARAPAN RAHASIA (TANPA DATABASE) ===
  contact: {
    whatsappNumber: "6281234567890", // Ganti dengan nomor WhatsApp kamu (awalan 62)
    email: "emailkamu@gmail.com",    // Ganti dengan alamat email kamu
  },

  // === 3. LAYAR PEMBUKA (3D BALLOONS & STARLIGHT HEART) ===
  intro: {
    badge: "Starry Night Celebration",
    headline: "Malam Ini Langit Merayakan Hadirmu",
    subtext:
      "Sentuh kristal hati atau balon yang melayang di bawah bintang untuk membuka kejutan dariku.",
    ctaLabel: "Buka Kejutan",
  },

  // === 4. RITUAL TIUP LILIN & KAMERA ===
  hero: {
    eyebrow: "Make A Wish Ritual",
    subtitle:
      "Putar kue malam ini sesukamu, nyalakan kamera, pejamkan mata, lalu peragakan tiupan ke arah layar.",
    cakeTopText: "HBD 22",
    enableCameraLabel: "Tiup Lilin dengan Kamera",
    loadingModelLabel: "Menyiapkan Sensor Wajah...",
    noFaceHint: "Arahkan wajahmu ke dalam lingkaran cermin...",
    listeningHint: "Wajah terdeteksi — kerucutkan bibir & tiup lilinnya!",
    manualFallbackLabel: "Atau ketuk di sini untuk tiup manual",
    wishMessageTitle: "Make a Wish Terkirim ✨",
    wishMessageBody:
      "Momen tiup lilinmu sudah tersimpan di bawah bintang. Membuka halaman kenangan kita...",
  },

  // === 5. GALERI SCRAPBOOK POLAROID (FORMAT .PNG) ===
  memories: [
    {
      id: "mem-1",
      image: "/images/memory-1.png",
      caption: "Senyum favoritku yang selalu bikin hari biasa terasa istimewa.",
      date: "Momen Pertama",
      rotation: -3,
      sticker: "heart",
    },
    {
      id: "mem-2",
      image: "/images/memory-2.png",
      caption: "Kopi malam, obrolan panjang, dan tawa yang tidak pernah habis.",
      date: "Malam Favorit",
      rotation: 2.5,
      sticker: "sparkle",
    },
    {
      id: "mem-3",
      image: "/images/memory-3.png",
      caption: "Jalan tanpa tujuan pun terasa tenang asal pulangnya sama kamu.",
      date: "Akhir Pekan",
      rotation: -2,
      sticker: "ribbon",
    },
    {
      id: "mem-4",
      image: "/images/memory-4.png",
      caption: "Terima kasih sudah jadi rumah paling teduh di tengah ramai.",
      date: "Selamanya",
      rotation: 3,
      sticker: "star",
    },
  ] as PolaroidMemory[],

  // === 6. SURAT CINTA & SECRET VOICE NOTE (.MP4 / .MP3) ===
  loveLetter: {
    envelopePrompt: "Ada surat kecil untukmu — ketuk segel untuk membuka",
    salutation: "Untuk Hani tersayang,",
    paragraphs: [
      "Selamat ulang tahun yang ke-22, ya. Rasanya baru kemarin kita berbagi cerita hal-hal kecil, dan hari ini aku kembali bersyukur karena masih bisa merayakan bertambahnya usiamu dari dekat.",
      "Terima kasih sudah menjadi pribadi yang lembut, anggun, dan tulus. Kehadiranmu diam-diam mengajarkanku banyak hal tentang sabar, tentang merayakan proses, dan tentang merasa cukup.",
      "Di babak baru ini, aku berharap kamu tidak pernah lupa betapa berharganya dirimu—bukan hanya saat semuanya berjalan sempurna, tapi juga di hari-hari saat kamu sedang lelah.",
      "Tetaplah bersinar seperti bintang paling tenang di langit malam. Aku akan selalu ada di barisan paling depan, mendukungmu dan merayakan setiap langkah kecilmu.",
    ],
    closing: "Dengan sepenuh hati,",
    signature: "Dari Aku 🤍",
    voiceNote: {
      audioPath: "/audio/secret-voice-note.mp4",
      title: "Pesan Suara Rahasia Untukmu",
      subtitle: "Musik latar akan otomatis mengecil saat kamu memutarnya",
    },
  },

  // === 7. STARLIGHT LOVE NOTES (KARTU 3D FLIP) ===
  notesSection: {
    eyebrow: "Starlight Love Notes",
    title: "6 Hal yang Bikin Aku Makin Jatuh Cinta",
    subtitle:
      "Sentuh & balik semua kartunya ya, ada alasan kenapa kamu selalu jadi favoritku.",
    allOpenedToast: "Semua rahasia kecilku udah kamu baca ✨",
  },

  wishCards: [
    {
      id: "wish-1",
      tag: "MY SAFE SPACE",
      frontTitle: "Tempat Pulang Paling Nyaman",
      frontEmoji: "🌌",
      backMessage:
        "Mau se-chaotic apa pun hariku, begitu ngobrol sama kamu rasanya langsung auto-tenang. Kamu beneran safe space terbaik yang pernah aku punya.",
      footerNote: "Always my peace",
      accentBg: "from-[#132044] via-[#0B1329] to-[#1D3063]/85",
    },
    {
      id: "wish-2",
      tag: "CORE MEMORY",
      frontTitle: "Ketawa Kamu yang Candu",
      frontEmoji: "✨",
      backMessage:
        "Sumpah, ketawa kamu tuh nular banget. Hal paling receh aja bisa berubah jadi core memory paling berharga kalau ketawanya bareng kamu.",
      footerNote: "Favorite sound ever",
      accentBg: "from-[#101B3B] via-[#091024] to-[#21366E]/80",
    },
    {
      id: "wish-3",
      tag: "100% GREEN FLAG",
      frontTitle: "Peka Sama Hal-Hal Kecil",
      frontEmoji: "🦋",
      backMessage:
        "Cara kamu merhatiin detail kecil—dari ngingetin hal sepele sampai dengerin cerita random aku—selalu sukses bikin aku salting dan makin sayang.",
      footerNote: "Effortless caring",
      accentBg: "from-[#15234A] via-[#0C142B] to-[#1E3166]/85",
    },
    {
      id: "wish-4",
      tag: "TOP TIER EFFORT",
      frontTitle: "Effort Kamu Gak Main-Main",
      frontEmoji: "💫",
      backMessage:
        "Makasih ya udah selalu nyempetin waktu dan kasih effort tulus di tengah sibuknya hari kamu. I never take that for granted, sayang.",
      footerNote: "Grateful every day",
      accentBg: "from-[#0E1833] via-[#080E20] to-[#1B2C59]/85",
    },
    {
      id: "wish-5",
      tag: "BEST PARTNER",
      frontTitle: "Partner Gabut & Deep Talk",
      frontEmoji: "🥂",
      backMessage:
        "Dari bahas hal gak penting sampai deep talk tengah malam, cuma sama kamu aku bisa jadi versi paling jujur dan apa adanya dari diriku sendiri.",
      footerNote: "My favorite person",
      accentBg: "from-[#142146] via-[#0B1228] to-[#1F3268]/80",
    },
    {
      id: "wish-6",
      tag: "JUST BEING YOU",
      frontTitle: "Semua Versi Diri Kamu",
      frontEmoji: "🤍",
      backMessage:
        "Gak perlu jadi orang lain. Kamu dengan segala versi random, manja, dan hebatnya kamu udah lebih dari cukup buat bikin aku bersyukur tiap hari.",
      footerNote: "I love you endlessly",
      accentBg: "from-[#111D3D] via-[#0A1126] to-[#1C2E61]/85",
    },
  ] as WishCardItem[],

  // === 8. KAPSUL WAKTU & PENGIRIM HARAPAN ===
  timeCapsule: {
    eyebrow: "Starlight Capsule • Usia 22",
    title: "Tulis Harapan Terbesarmu Tahun Ini",
    subtitle:
      "Ketik satu harapan yang paling ingin kamu wujudkan di usia baru ini. Begitu dikunci dalam kristal biru malam, kapsul ini siap dikirim sebagai rahasia kecil kita.",
    placeholder: "Tulis harapan atau hal yang paling kamu inginkan tahun ini...",
    lockButtonLabel: "Kunci Harapan ke Langit Malam",
    lockedTitle: "Harapan Terkunci dalam Kristal Starlight ✨",
    lockedSubtitle:
      "Kirim kapsul terenkripsi ini agar aku ikut mendoakan dan diam-diam membantumu mewujudkannya.",
  },

  // === 9. PENUTUP ===
  closing: {
    title: "Sekali Lagi, Selamat Ulang Tahun",
    subtitle:
      "Semoga tahun ini membawa lebih banyak tawa, ketenangan, dan kenangan indah yang kita tulis bersama di bawah langit yang sama.",
    replayButton: "Putar Ulang Perayaan",
  },
};