'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X, ArrowRight, Sparkles, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveUser } from '@/lib/supabase/fallback-storage';
import { UserProfile } from '@/lib/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getActiveUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }
    document.cookie = 'eh_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'eh_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    localStorage.removeItem('eh_active_user');
    localStorage.removeItem('eh_user_progress');
    localStorage.removeItem('eh_quiz_attempts');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with interactive glow */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 group-hover:scale-105 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                ENGLISH<span className="text-indigo-600"> HUB</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider -mt-1 uppercase">
                Luyện Thi THPT Quốc Gia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Trang Chủ
            </Link>
            <Link
              href="#features"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Tính Năng
            </Link>
            <Link
              href="/vocabulary"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Từ Vựng (Vocab)
            </Link>
            <Link
              href="/grammar"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Ngữ Pháp (Grammar)
            </Link>
            <Link
              href="/exam-practice"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Luyện Đề THPT
            </Link>
          </nav>

          {/* User Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Online Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>1.4k sĩ tử online</span>
            </div>

            {user ? (
              /* ALREADY LOGGED IN: SHOW DASHBOARD SHORTCUT & USER PROFILE */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all card-hover"
                  title="Nhấp để vào trang quản lý học tập"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {user.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.display_name}</span>
                  {user.id === 'demo-student-id' && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      Demo
                    </span>
                  )}
                </Link>

                <Link href="/dashboard">
                  <button className="btn-shine inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Vào Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Đăng Xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* GUEST: SHOW LOGIN & REGISTER */
              <>
                <Link href="/login">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all">
                    Đăng Nhập
                  </button>
                </Link>

                <Link href="/register">
                  <button className="btn-shine inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Bắt Đầu Học
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in-up">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Hơn 1.400 học sinh đang ôn luyện trực tuyến</span>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Trang Chủ
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Tính Năng
          </Link>
          <Link
            href="/vocabulary"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Từ Vựng (Vocab)
          </Link>
          <Link
            href="/grammar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Ngữ Pháp (Grammar)
          </Link>
          <Link
            href="/exam-practice"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Luyện Đề THPT
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{user.display_name}</span>
                <span className="text-slate-400">{user.email}</span>
              </div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center btn-shine gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Vào Dashboard Của Bạn
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full justify-center">
                  Đăng Nhập
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center btn-shine">
                  Đăng Ký Miễn Phí
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
