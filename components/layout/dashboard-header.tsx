'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Flame,
  Target,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getActiveUser, getUserProgress } from '@/lib/supabase/fallback-storage';
import { UserProfile, UserProgress } from '@/lib/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getActiveUser().then(setUser);
    getUserProgress().then(setProgress);
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    localStorage.removeItem('eh_active_user');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Kỳ thi Tốt nghiệp THPT 2025</span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-600 font-bold">Môn Tiếng Anh</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{progress?.streak_days || 7} Ngày Streak</span>
        </div>

        {/* Target score pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mục tiêu: {user?.target_score?.toFixed(1) || '8.5'}đ</span>
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
              {user?.display_name || 'Học viên'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.display_name || 'Học viên'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Hồ sơ & Đổi mục tiêu
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
