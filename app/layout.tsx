import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AiTutorWidget } from '@/components/ai/ai-tutor-widget';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EngVerse - Nền tảng Học Tiếng Anh & Luyện Thi Tốt Nghiệp THPT 2027',
  description: 'Nền tảng học tiếng anh hiện đại dành cho học sinh Việt Nam. Luyện từ vựng, ngữ pháp, cấu trúc câu và đề thi thử tốt nghiệp THPT Quốc Gia với đáp án và giải thích chi tiết cùng Gia Sư AI 24/7.',
  keywords: [
    'học tiếng anh',
    'luyện thi thpt quốc gia môn tiếng anh 2027',
    'ngữ pháp tiếng anh',
    'từ vựng tiếng anh',
    'đề thi thử tiếng anh thpt',
    'gia sư ai tiếng anh',
    'engverse'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] text-[#1E293B]">
        {children}
        <AiTutorWidget />
      </body>
    </html>
  );
}
