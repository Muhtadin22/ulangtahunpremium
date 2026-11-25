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
  frontTitle: string;
  frontEmoji: string;
  backMessage: string;
  accentBg: string;
}

export const DREAMY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const birthdayData = {
  partnerName: "Alya",
  partnerNickname: "Sayang",
  senderName: "Kamu yang Selalu Mengagumimu",
  age: 22,
  birthdayDate: "25 November 2026",
  snapshotDateLabel: "25 Nov 2026", // Ditulis di bingkai Polaroid Candid
  audioPath: "/audio/birthday-bgm.mp3",

  // Kontak tujuan pengirim harapan rahasia (tanpa backend/database)
  contact: {
    whatsappNumber: "085697259015", // Ganti dengan nomor WhatsApp kamu
    email: "emailkamu@gmail.com",    // Opsional: ganti dengan email kamu
  },

  intro: {
    badge: "Midnight Celebration For You",
    headline: "Malam Ini Semesta Merayakan Hadirmu",
    subtext: "Sentuh kristal hati atau balon yang melayang untuk membuka kejutan spesial dariku.",
    ctaLabel: "Buka Kejutan",
  },

  hero: {
    eyebrow: "Make A Wish Ritual",
    subtitle: "Putar kue malam ini sesukamu, nyalakan kamera, pejamkan mata, lalu peragakan tiupan ke arah layar.",
    cakeTopText: "HBD 22",
    enableCameraLabel: "Tiup Lilin dengan Kamera",
    loadingModelLabel: "Menyiapkan Sensor Wajah...",
    noFaceHint: "Arahkan wajahmu ke dalam lingkaran cermin...",
    listeningHint: "Wajah terdeteksi — kerucutkan bibir & tiup lilinnya!",
    manualFallbackLabel: "Atau ketuk di sini untuk tiup manual",
    wishMessageTitle: "Make a Wish Terkirim ✨",
    wishMessageBody:
      "Momen tiup lilinmu sudah tersimpan. Membuka halaman kenangan kita...",
  },

  memories: [
    {
      id: "mem-1",
      image: "/images/memory-1.jpg",
      caption: "Senyum favoritku yang selalu bikin hari biasa terasa istimewa.",
      date: "Momen Pertama",
      rotation: -3,
      sticker: "heart",
    },
    {
      id: "mem-2",
      image: "/images/memory-2.jpg",
      caption: "Kopi malam, obrolan panjang, dan tawa yang tidak pernah habis.",
      date: "Malam Favorit",
      rotation: 2.5,
      sticker: "sparkle",
    },
    {
      id: "mem-3",
      image: "/images/memory-3.jpg",
      caption: "Jalan tanpa tujuan pun terasa mewah asal pulangnya sama kamu.",
      date: "Akhir Pekan",
      rotation: -2,
      sticker: "ribbon",
    },
    {
      id: "mem-4",
      image: "/images/memory-4.jpg",
      caption: "Terima kasih sudah jadi rumah paling tenang di tengah ramai.",
      date: "Selamanya",
      rotation: 3,
      sticker: "star",
    },
  ] as PolaroidMemory[],

  loveLetter: {
    envelopePrompt: "Ada surat kecil untukmu — ketuk segel untuk membuka",
    salutation: "Untuk Alya tersayang,",
    paragraphs: [
      "Selamat ulang tahun yang ke-22, ya. Rasanya baru kemarin kita berbagi cerita hal-hal kecil, dan hari ini aku kembali bersyukur karena masih bisa merayakan bertambahnya usiamu dari dekat.",
      "Terima kasih sudah menjadi pribadi yang lembut, anggun, dan tulus. Kehadiranmu diam-diam mengajarkanku banyak hal tentang sabar, tentang merayakan proses, dan tentang merasa cukup.",
      "Di babak baru ini, aku berharap kamu tidak pernah lupa betapa berharganya dirimu—bukan hanya saat semuanya berjalan sempurna, tapi juga di hari-hari saat kamu sedang lelah.",
      "Tetaplah bersinar dengan caramu sendiri yang indah. Aku akan selalu ada di barisan paling depan, mendukungmu dan merayakan setiap langkah kecilmu.",
    ],
    closing: "Dengan sepenuh hati,",
    signature: "Dari Aku 💜",
    voiceNote: {
      audioPath: "/audio/secret-voice-note.mp4",
      title: "Pesan Suara Rahasia Untukmu",
      subtitle: "Musik latar akan otomatis mengecil saat kamu memutarnya",
    },
  },

  timeCapsule: {
    eyebrow: "Kapsul Waktu • Usia 22",
    title: "Tulis Harapan Terbesarmu Tahun Ini",
    subtitle:
      "Ketik satu harapan yang paling ingin kamu wujudkan di usia baru ini. Begitu dikunci dalam kristal ungu, kapsul ini siap dikirim sebagai rahasia kecil kita.",
    placeholder: "Tulis harapan atau hal yang paling kamu inginkan tahun ini...",
    lockButtonLabel: "Kunci Harapan ke Semesta",
    lockedTitle: "Harapan Terkunci dalam Kristal Amethyst ✨",
    lockedSubtitle:
      "Kirim kapsul terenkripsi ini agar aku ikut mendoakan dan diam-diam membantumu mewujudkannya.",
  },

  wishCards: [
    {
      id: "wish-1",
      frontTitle: "Caramu Mendengarkan",
      frontEmoji: "🔮",
      backMessage: "Kamu selalu hadir sepenuhnya setiap kali aku bercerita, bahkan untuk hal paling remeh sekalipun.",
      accentBg: "from-[#1F1533] via-[#170F26] to-[#2B1947]/80",
    },
    {
      id: "wish-2",
      frontTitle: "Tawamu yang Menular",
      frontEmoji: "✨",
      backMessage: "Sesibuk atau selelah apa pun hariku, satu tawa darimu selalu cukup untuk menenangkan semuanya.",
      accentBg: "from-[#1A112B] via-[#130C20] to-[#321B54]/75",
    },
    {
      id: "wish-3",
      frontTitle: "Hati yang Hangat",
      frontEmoji: "🦋",
      backMessage: "Kebaikan kecil yang kamu lakukan ke orang-orang di sekitarmu selalu membuatku makin kagum padamu.",
      accentBg: "from-[#221638] via-[#160E24] to-[#2E1A4D]/80",
    },
    {
      id: "wish-4",
      frontTitle: "Keanggunan & Semangatmu",
      frontEmoji: "🌙",
      backMessage: "Caramu bangkit dan tetap tenang di setiap tantangan menginspirasiku untuk ikut menjadi lebih baik.",
      accentBg: "from-[#191029] via-[#120B1E] to-[#2A1845]/80",
    },
    {
      id: "wish-5",
      frontTitle: "Sisi Sederhanamu",
      frontEmoji: "🥂",
      backMessage: "Bahagia bareng kamu tidak pernah rumit—cukup duduk santai, bercerita, dan menikmati waktu berdua.",
      accentBg: "from-[#211536] via-[#150D22] to-[#301B50]/75",
    },
    {
      id: "wish-6",
      frontTitle: "Menjadi Dirimu Sendiri",
      frontEmoji: "💜",
      backMessage: "Terima kasih sudah jadi kamu apa adanya. Aku bersyukur semesta mempertemukan kita di waktu yang tepat.",
      accentBg: "from-[#1D1330] via-[#140D21] to-[#2D194A]/80",
    },
  ] as WishCardItem[],

  closing: {
    title: "Sekali Lagi, Selamat Ulang Tahun",
    subtitle: "Semoga tahun ini membawa lebih banyak tawa, ketenangan, dan kenangan indah yang kita tulis bersama.",
    replayButton: "Putar Ulang Perayaan",
  },
};