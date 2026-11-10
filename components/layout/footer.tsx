'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">
                ENG<span className="text-indigo-600">VERSE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nền tảng học Tiếng Anh thông minh & luyện thi Tốt nghiệp THPT Quốc Gia hàng đầu dành cho học sinh Việt Nam.
            </p>
          </div>

          {/* Links 1: Learning */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Chương Trình Học
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/vocabulary" className="hover:text-indigo-600 transition-colors">
                  Học Từ Vựng & Flashcards
                </Link>
              </li>
              <li>
                <Link href="/grammar" className="hover:text-indigo-600 transition-colors">
                  Ngữ Pháp Trọng Điểm
                </Link>
              </li>
              <li>
                <Link href="/sentence-structures" className="hover:text-indigo-600 transition-colors">
                  Cấu Trúc Câu Điểm 8+ 9+
                </Link>
              </li>
              <li>
                <Link href="/exam-practice" className="hover:text-indigo-600 transition-colors">
                  Đề Thi Thử THPT Quốc Gia
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2: Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Tính Năng Nổi Bật
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/exam-practice/mock" className="hover:text-indigo-600 transition-colors">
                  Thi Thử Có Bấm Giờ
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-indigo-600 transition-colors">
                  Theo Dõi Tiến Độ & Streak
                </Link>
              </li>
              <li>
                <Link href="/vocabulary" className="hover:text-indigo-600 transition-colors">
                  Sổ Tay Từ Vựng Cá Nhân
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-600 transition-colors">
                  Đặt Mục Tiêu Điểm Số
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3: Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Chuẩn Đề Thi
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs">
                <GraduationCap className="w-4 h-4" />
                <span>Bám Sát Chương Trình GDPT Mới</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đề thi và bài tập được biên soạn kỹ lưỡng theo ma trận chuẩn của Bộ Giáo dục & Đào tạo.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 - 2027 ENGVERSE. Bản quyền thuộc về nền tảng.</p>
          <p className="flex items-center gap-1">
            Thiết kế vì sự tiến bộ của học sinh Việt Nam <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
