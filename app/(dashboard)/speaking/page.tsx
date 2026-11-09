'use client';

import React from 'react';
import { Mic, Volume2, Sparkles, Award, Target, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { AiSpeakingCoach } from '@/components/ai/ai-speaking-coach';
import Link from 'next/link';

export default function SpeakingPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── 1. HERO HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-7 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Glowing background decorations */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Công Nghệ AI Nhận Diện Giọng Nói 2027</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/30 text-purple-100 text-xs sm:text-sm font-bold">
              <Target className="w-3.5 h-3.5 text-purple-300" />
              <span>Chấm điểm theo Thang 10 Chuẩn Bộ GD</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Phòng Luyện Phát Âm & Speaking AI 🎙️
          </h1>

          <p className="text-purple-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium">
            Tự tin nói tiếng Anh chuẩn bản xứ! AI sẽ đọc phát âm mẫu chuẩn, lắng nghe bạn repeat,
            chấm điểm chính xác trên thang 10 và chỉ ra cụ thể từng âm đuôi, trọng âm cần cải thiện.
          </p>

          {/* 3 Step Flow Pills */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-bold">
              <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                1
              </span>
              <span>AI Đọc Mẫu (1.0x & Chậm)</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-bold">
              <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                2
              </span>
              <span>Người Học Repeat Vào Mic</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-bold">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                3
              </span>
              <span>Chấm Điểm Thang 10 & Sửa Lỗi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. INTERACTIVE STUDIO COMPONENT ── */}
      <AiSpeakingCoach />
    </div>
  );
}
