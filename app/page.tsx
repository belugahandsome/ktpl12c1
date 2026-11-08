import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen, FileCheck2, Sparkles, ArrowRight, CheckCircle2,
  TrendingUp, Brain, ShieldCheck, Award, Layers, Timer,
  BookMarked, Star, Zap, Trophy, Users, Play, ChevronRight,
  Volume2, MessageSquare, BarChart3,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Flashcard Thông Minh',
    desc: 'Hệ thống Spaced Repetition (SRS) tối ưu hoá việc ghi nhớ 1,200+ từ vựng trọng tâm theo từng level.',
    badge: '1,200+ từ',
  },
  {
    icon: BookMarked,
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    title: 'Ngữ Pháp Điểm Liệt & 8+',
    desc: '12 chuyên đề ngữ pháp từ cơ bản đến nâng cao, trình bày cô đọng với ví dụ thực tế bám sát đề thi.',
    badge: '12 chuyên đề',
  },
  {
    icon: Layers,
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    title: 'Cấu Trúc Câu Ăn Điểm',
    desc: '80+ cấu trúc câu "golden" dùng được ngay trong Writing & speaking, kèm bài tập áp dụng ngay.',
    badge: '80+ cấu trúc',
  },
  {
    icon: FileCheck2,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Đề Thi Thử Chuẩn BGD',
    desc: 'Kho đề thi thử sát cấu trúc Bộ GD&ĐT, có đáp án và giải thích chi tiết song ngữ từng câu.',
    badge: 'Chuẩn BGD 2025',
  },
  {
    icon: TrendingUp,
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    title: 'Theo Dõi Tiến Độ',
    desc: 'Biểu đồ học tập chi tiết: streak hàng ngày, số từ đã học, điểm trung bình qua các bài thi.',
    badge: 'Realtime tracking',
  },
  {
    icon: Volume2,
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    title: 'AI Phát Âm & Luyện Nghe',
    desc: 'Text-to-Speech chuẩn British & American giúp luyện nghe và phát âm đúng mọi lúc mọi nơi.',
    badge: 'AI-powered',
  },
];

const STATS = [
  { number: '1,200+', label: 'Từ Vựng Trọng Tâm', icon: Brain },
  { number: '12', label: 'Chuyên Đề Ngữ Pháp', icon: BookMarked },
  { number: '80+', label: 'Cấu Trúc Câu Vàng', icon: Layers },
  { number: '100%', label: 'Giải Thích Song Ngữ', icon: CheckCircle2 },
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Thị Lan',
    school: 'THPT Chuyên Hà Nội – Amsterdam',
    score: '9.2',
    text: 'Nhờ ENGLISH HUB mình ôn được đúng trọng tâm. Điểm thi thử tăng từ 7.0 lên 9.2 chỉ trong 2 tháng!',
    avatar: 'L',
    color: 'bg-indigo-500',
  },
  {
    name: 'Trần Minh Khôi',
    school: 'THPT Lê Hồng Phong – TP.HCM',
    score: '8.8',
    text: 'Phần cấu trúc câu và ngữ pháp giải thích rất rõ. Mình dùng flashcard mỗi ngày và điểm cải thiện rõ rệt.',
    avatar: 'K',
    color: 'bg-violet-500',
  },
  {
    name: 'Phạm Thu Hà',
    school: 'THPT Phan Đình Phùng – Hà Nội',
    score: '8.5',
    text: 'Đề thi thử chuẩn cấu trúc BGD giúp mình làm quen dạng bài rất nhanh. Rất khuyên dùng!',
    avatar: 'H',
    color: 'bg-sky-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-100/80 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-72 h-72 bg-violet-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Chuyên biệt cho Kỳ thi Tốt Nghiệp THPT Quốc Gia 2025
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
            Learn English{' '}
            <span className="relative">
              <span className="gradient-text">Smarter,</span>
            </span>
            <br />
            <span className="text-slate-800">Not Harder.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 animate-fade-in-up delay-100">
            Nền tảng học Tiếng Anh toàn diện kết hợp Flashcard thông minh, hệ thống ngữ pháp cô đọng,
            kho cấu trúc câu ăn điểm 8+ 9+, và đề thi thử chuẩn cấu trúc Bộ GD&ĐT.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-200">
            <Link href="/register">
              <button className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-200 hover:-translate-y-0.5">
                <Zap className="w-4 h-4" />
                Bắt Đầu Miễn Phí
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-indigo-300 transition-all duration-200 shadow-sm">
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                Thử Demo Ngay
              </button>
            </Link>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up delay-300">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 text-center shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 card-hover">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 mb-1">{stat.number}</div>
                  <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Tính năng nổi bật
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Mọi thứ bạn cần để{' '}
              <span className="gradient-text">chinh phục điểm 8+</span>
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 text-base">
              Từ từ vựng, ngữ pháp đến đề thi thử — tất cả trong một nền tảng được thiết kế riêng cho học sinh THPT Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-250 card-hover">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{f.title}</h3>
                    <span className="ml-2 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-indigo-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Chỉ 3 bước để bắt đầu
            </h2>
            <p className="text-slate-500">Đơn giản, nhanh chóng, hiệu quả ngay từ ngày đầu tiên.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: BookOpen, title: 'Đăng ký miễn phí', desc: 'Tạo tài khoản trong 30 giây. Không cần thẻ tín dụng, dùng ngay tất cả tính năng.', color: 'text-indigo-600', bg: 'bg-indigo-100' },
              { step: '02', icon: Brain, title: 'Chọn lộ trình học', desc: 'Từ từ vựng, ngữ pháp đến làm đề thi — học theo thứ tự hoặc tùy chọn chủ đề bạn yếu.', color: 'text-violet-600', bg: 'bg-violet-100' },
              { step: '03', icon: Trophy, title: 'Theo dõi & cải thiện', desc: 'Dashboard hiển thị tiến độ realtime. Duy trì streak và thấy điểm số tăng dần mỗi ngày.', color: 'text-emerald-600', bg: 'bg-emerald-100' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative text-center">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-0 h-px border-t-2 border-dashed border-slate-200 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white border-2 border-slate-200 shadow-sm mb-5 mx-auto">
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-300 mb-2 tracking-widest">{item.step}</div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold mb-4">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Học sinh đánh giá 5 sao
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Học sinh nói gì về <span className="gradient-text">ENGLISH HUB?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-md transition-shadow card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-auto text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {t.score}đ
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white font-bold text-sm flex items-center justify-center`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-10 sm:p-14 text-center overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hoàn toàn miễn phí
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Sẵn sàng chinh phục<br />điểm 8+ môn Tiếng Anh?
              </h2>
              <p className="text-indigo-200 mb-8 text-base">
                Tham gia cùng hàng ngàn học sinh THPT đang ôn luyện hiệu quả trên ENGLISH HUB.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-900 font-bold text-base hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:-translate-y-0.5">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    Đăng Ký Miễn Phí
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all duration-200">
                    <Play className="w-4 h-4 fill-white" />
                    Thử Demo Ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
