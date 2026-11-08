'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                ENGLISH<span className="text-indigo-600"> HUB</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide -mt-1 uppercase">
                Luyện Thi THPT Quốc Gia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Trang Chủ
            </Link>
            <Link
              href="#features"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Tính Năng
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Lợi Ích Học Tập
            </Link>
            <Link
              href="#about"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Về Chúng Tôi
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="md">
                Đăng Nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md" className="gap-2">
                Bắt Đầu Học
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Trang Chủ
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tính Năng
          </Link>
          <Link
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Lợi Ích Học Tập
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Về Chúng Tôi
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full justify-center">
                Đăng Nhập
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full justify-center">
                Đăng Ký Tài Khoản
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
