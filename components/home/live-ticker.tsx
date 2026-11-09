'use client';

import React from 'react';
import { Flame, Sparkles, TrendingUp, Trophy, Clock, CheckCircle2 } from 'lucide-react';

const TICKER_ITEMS = [
  {
    icon: Flame,
    color: 'text-amber-500',
    text: 'Sĩ tử 2009: Hơn 15.200 học sinh đang ôn luyện chuẩn bị THPT Quốc Gia 2027!',
  },
  {
    icon: Trophy,
    color: 'text-emerald-500',
    text: 'Top điểm cao tuần này: Nguyễn Hoàng Nam (9.6đ) • Lê Mai Chi (9.4đ) • Vũ Minh Nhật (9.2đ)',
  },
  {
    icon: Sparkles,
    color: 'text-indigo-500',
    text: 'Bí kíp 9+: Nắm chắc bộ 80+ Cấu Trúc Câu Vàng ăn trọn điểm phần Viết lại câu & Tìm lỗi sai',
  },
  {
    icon: Clock,
    color: 'text-rose-500',
    text: 'Kỳ thi Tốt nghiệp THPT 2027: Lộ trình 30 ngày phá đảo ngữ pháp điểm liệt & bứt phá điểm 8+',
  },
  {
    icon: TrendingUp,
    color: 'text-cyan-500',
    text: 'Flashcard SRS: Ghi nhớ 1.200+ từ vựng trọng tâm không bao giờ quên với phương pháp lặp lại ngắt quãng',
  },
  {
    icon: CheckCircle2,
    color: 'text-purple-500',
    text: '100% Đề thi thử có đáp án chi tiết & giải thích song ngữ theo form mới nhất của Bộ GD&ĐT',
  },
];

export function LiveTicker() {
  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 text-white overflow-hidden py-3 relative select-none">
      {/* Subtle glowing side masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
        {/* Render items twice for infinite seamless loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-slate-200 hover:text-white transition-colors cursor-default"
            >
              <Icon className={`w-4 h-4 ${item.color} shrink-0 animate-pulse`} />
              <span>{item.text}</span>
              <span className="text-slate-600 ml-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
