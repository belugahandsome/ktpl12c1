'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Live Online Badge & Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Online Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>1.4k sĩ tử online</span>
            </div>

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
        </div>
      )}
    </header>
  );
}
