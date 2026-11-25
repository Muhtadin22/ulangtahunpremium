import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { AudioProvider } from "@/context/AudioContext";
import AudioControl from "@/components/AudioControl";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday, My Starlight ✨",
  description: "Sebuah perayaan malam berbintang di hari spesialmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth`}
    >
      <body className="bg-[#050811] text-[#F4F7FC] font-sans antialiased selection:bg-[#7AA2F7]/35 selection:text-[#F4F7FC] overflow-x-hidden">
        <AudioProvider>
          {children}
          <AudioControl />
        </AudioProvider>
      </body>
    </html>
  );
}