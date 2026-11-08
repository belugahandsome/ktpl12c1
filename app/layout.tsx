import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ENGLISH HUB - Nền tảng Học Tiếng Anh & Luyện Thi Tốt Nghiệp THPT',
  description: 'Nền tảng học tiếng anh hiện đại dành cho học sinh Việt Nam. Luyện từ vựng, ngữ pháp, cấu trúc câu và đề thi thử tốt nghiệp THPT Quốc Gia với đáp án và giải thích chi tiết.',
  keywords: [
    'học tiếng anh',
    'luyện thi thpt quốc gia môn tiếng anh',
    'ngữ pháp tiếng anh',
    'từ vựng tiếng anh',
    'đề thi thử tiếng anh thpt',
    'english hub'
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
      </body>
    </html>
  );
}
