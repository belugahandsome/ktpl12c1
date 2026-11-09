'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Play, LayoutDashboard, GraduationCap } from 'lucide-react';
import { getActiveUser } from '@/lib/supabase/fallback-storage';
import { UserProfile } from '@/lib/types';

export function HeroCtaButtons() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getActiveUser().then(setUser);
  }, []);

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-in-up delay-200">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <button className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base sm:text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
            <LayoutDashboard className="w-5 h-5 text-amber-300" />
            Vào Dashboard Học Tập
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>

        <Link href="/exam-practice" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base sm:text-lg shadow-xs hover:border-indigo-300 transition-all">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Luyện Đề Thi Thử
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-in-up delay-200">
      <Link href="/register" className="w-full sm:w-auto">
        <button className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base sm:text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
          <Zap className="w-5 h-5 text-amber-300" />
          Bắt Đầu Học Miễn Phí
          <ArrowRight className="w-5 h-5" />
        </button>
      </Link>

      <Link href="/login" className="w-full sm:w-auto">
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base sm:text-lg shadow-xs hover:border-indigo-300 transition-all">
          <Play className="w-5 h-5 text-indigo-600 fill-indigo-600" />
          Thử Tài Khoản Demo
        </button>
      </Link>
    </div>
  );
}
