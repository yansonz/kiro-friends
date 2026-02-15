import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MusicPlayer from "@/components/MusicPlayer";
import { I18nProvider } from "@/contexts/I18nContext";
import AmplitudeProvider from "@/components/AmplitudeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "당신은 어떤 Kiro 프렌즈?",
  description: "한국 전통 설화 캐릭터로 알아보는 나의 개발자 유형 테스트. 16문항, 약 2분 소요.",
  openGraph: {
    title: "당신은 어떤 Kiro 프렌즈?",
    description: "한국 전통 설화 캐릭터로 알아보는 나의 개발자 유형 테스트",
    images: [{ url: "https://kiro-friends.yanbert.com/og/default.png", width: 1200, height: 630 }],
  },
};

// 모바일 뷰 고정을 위한 viewport 설정
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AmplitudeProvider>
          <I18nProvider>
            <MusicPlayer />
            {children}
          </I18nProvider>
        </AmplitudeProvider>
      </body>
    </html>
  );
}
