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
  title: "Happy Birthday, My Favorite Soul ✨",
  description: "Sebuah perayaan malam penuh cinta di hari spesialmu.",
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
      <body className="bg-[#09060E] text-[#F6F1FC] font-sans antialiased selection:bg-[#9333EA]/40 selection:text-[#F6F1FC] overflow-x-hidden">
        <AudioProvider>
          {children}
          <AudioControl />
        </AudioProvider>
      </body>
    </html>
  );
}