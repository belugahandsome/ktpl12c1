import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LiveTicker } from '@/components/home/live-ticker';
import { HeroInteractive } from '@/components/home/hero-interactive';
import { AiVideoShowcase } from '@/components/home/ai-video-showcase';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { HeroCtaButtons } from '@/components/home/hero-cta-buttons';
import {
  BookOpen,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Award,
  Layers,
  Timer,
  BookMarked,
  Star,
  Zap,
  Trophy,
  Users,
  Play,
  ChevronRight,
  Volume2,
  Video,
  BarChart3,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Flashcard 3D Thông Minh',
    desc: 'Hệ thống Spaced Repetition (SRS) tối ưu hoá ghi nhớ 1.200+ từ vựng trọng tâm kèm phát âm bản xứ chuẩn IPA.',
    badge: '1.200+ từ',
  },
  {
    icon: BookMarked,
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    title: 'Ngữ Pháp Điểm Liệt & 8+',
    desc: '12 chuyên đề ngữ pháp cô đọng, hệ thống bài tập thực hành bấm giờ theo sát dạng bài thi THPT mới nhất.',
    badge: '12 chuyên đề',
  },
  {
    icon: Layers,
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    title: 'Cấu Trúc Câu Ăn Điểm Vàng',
    desc: '80+ cấu trúc câu ăn trọn điểm phần Viết lại câu, Tìm lỗi sai và Kết hợp câu có giải thích chi tiết.',
    badge: '80+ cấu trúc',
  },
  {
    icon: FileCheck2,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Đề Thi Thử Chuẩn Format BGD',
    desc: 'Đề thi 50 câu chuẩn 60 phút, chấm điểm tự động và có lời giải song ngữ chi tiết từng phương án A, B, C, D.',
    badge: 'Chuẩn BGD 2027',
  },
  {
    icon: Video,
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    title: 'Video Ngắn & Giọng Đọc AI',
    desc: 'Bí kíp 60 giây tóm gọn mẹo làm bài, phát âm tự động và AI tạo kịch bản học cấp tốc theo chủ đề.',
    badge: 'AI Powered',
  },
  {
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Báo Cáo Tiến Độ Realtime',
    desc: 'Theo dõi streak học tập liên tục, điểm trung bình các bài thi và phân tích điểm mạnh, điểm yếu theo chuyên đề.',
    badge: 'Theo dõi realtime',
  },
];

const STATS = [
  { number: '1.200+', label: 'Từ Vựng Trọng Tâm THPT', icon: Brain },
  { number: '12', label: 'Chuyên Đề Ngữ Pháp Vàng', icon: BookMarked },
  { number: '80+', label: 'Cấu Trúc Câu Bứt Phá 8+', icon: Layers },
  { number: '100%', label: 'Giải Thích Song Ngữ Chi Tiết', icon: CheckCircle2 },
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Thị Lan',
    school: 'THPT Chuyên Hà Nội – Amsterdam',
    score: '9.2',
    text: 'Nhờ ENGLISH HUB mình ôn được đúng trọng tâm. Điểm thi thử tăng từ 7.0 lên 9.2 chỉ trong 2 tháng ôn luyện!',
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
    text: 'Đề thi thử chuẩn cấu trúc BGD giúp mình làm quen áp lực phòng thi rất nhanh. Rất khuyên các bạn sĩ tử dùng!',
    avatar: 'H',
    color: 'bg-sky-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] relative">
      <AnimatedBackground />
      <Navbar />
      <LiveTicker />

      {/* ── HERO SECTION WITH 2-COLUMN INTERACTIVE SHOWCASE ── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Full-bleed Submerged Animated 3D Glass Book Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/images/bg-glass-book.jpg"
            alt="3D Glass Book Banner"
            className="w-full h-full object-cover object-center scale-125 md:scale-115 animate-subtle-zoom opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/30 via-transparent to-[#F8FAFC]" />
        </div>

        {/* Animated background ambient glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-100/70 via-purple-100/50 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-5 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 left-5 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN: HERO HEADLINE & CTA */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-7">
              {/* Animated Top Pill */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200/90 shadow-sm animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-sm sm:text-base font-black text-indigo-700 tracking-wide">
                  Luyện Thi THPT Quốc Gia Chuẩn Cấu Trúc 2027
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-500" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] animate-fade-in-up">
                Learn English{' '}
                <span className="relative">
                  <span className="gradient-text">Smarter,</span>
                </span>
                <br />
                <span className="text-slate-800">Bứt Phá Điểm 8+ 9+</span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl font-medium text-slate-700 leading-relaxed animate-fade-in-up delay-100">
                Nền tảng học Tiếng Anh thông minh kết hợp Flashcard 3D có giọng đọc chuẩn, 
                hệ thống ngữ pháp cô đọng, 80+ cấu trúc câu ăn điểm và đề thi thử chuẩn format Bộ GD&ĐT.
              </p>

              {/* Action Buttons with login status awareness */}
              <HeroCtaButtons />

              {/* User proof summary */}
              <div className="pt-3 flex items-center justify-center lg:justify-start gap-4 text-sm sm:text-base text-slate-600 font-semibold animate-fade-in-up delay-300">
                <div className="flex -space-x-2">
                  {['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'].map(
                    (bg, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full border-2 border-white ${bg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                    )
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">15.000+ Sĩ tử</span> đã tin tưởng lựa chọn
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE INTERACTIVE 3D FLASHCARD & QUIZ */}
            <div className="lg:col-span-6 animate-fade-in-up delay-200">
              <HeroInteractive />
            </div>
          </div>

          {/* Quick Stats Banner under Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mt-16 pt-8 border-t border-slate-200/80">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 text-center shadow-sm card-hover"
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-slate-700 font-bold leading-tight">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES GRID ── */}
      <section className="py-24 relative overflow-hidden" id="features">
        {/* Submerged Animated 3D Bubbles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 opacity-55 sm:opacity-70 animate-subtle-drift">
            <img
              src="/images/bg-bubbles.jpg"
              alt="3D Glass Bubbles Background"
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-sm sm:text-base font-bold mb-4 shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Lộ Trình Học Toàn Diện
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              Mọi công cụ bạn cần để <span className="gradient-text">chinh phục điểm 8+ 9+</span>
            </h2>
            <p className="text-slate-700 text-lg sm:text-xl font-medium">
              Thiết kế bám sát 100% theo ma trận đề thi tốt nghiệp THPT của Bộ Giáo dục & Đào tạo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group bg-white/95 backdrop-blur-md rounded-3xl border border-white/90 p-7 hover:border-indigo-300 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 card-hover flex flex-col justify-between shadow-lg shadow-slate-200/50"
                >
                  <div>
                    <div
                      className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-7 h-7 ${f.iconColor}`} />
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">
                        {f.title}
                      </h3>
                      <span className="ml-2 shrink-0 text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{f.desc}</p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center text-sm sm:text-base font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Khám phá ngay</span>
                    <ChevronRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI VIDEO & AUDIO SECTION ── */}
      <AiVideoShowcase />

      {/* ── 3-STEP ROADMAP ── */}
      <section className="py-24 bg-gradient-to-b from-slate-50/70 via-indigo-50/30 to-slate-50/70 relative overflow-hidden">
        {/* Full-bleed Submerged Animated 3D Rings Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/images/bg-rings.jpg"
            alt="3D Glowing Glass Rings"
            className="w-full h-full object-cover object-center scale-110 animate-subtle-zoom opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-transparent to-slate-50/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Chỉ 3 bước bứt phá điểm số
            </h2>
            <p className="text-slate-700 text-lg sm:text-xl font-medium">Đơn giản, khoa học và nhìn thấy sự tiến bộ rõ rệt từng tuần.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                step: '01',
                icon: BookOpen,
                title: 'Đăng ký tài khoản',
                desc: 'Khởi tạo tài khoản trong 30 giây. Sử dụng miễn phí toàn bộ kho từ vựng và đề thi.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-100',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Học trọng tâm theo lộ trình',
                desc: 'Học từ vựng qua Flashcard 3D, củng cố 12 chuyên đề ngữ pháp và luyện phản xạ cấu trúc câu vàng.',
                color: 'text-violet-600',
                bg: 'bg-violet-100',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Làm đề thi thử & Bứt phá',
                desc: 'Thi thử bấm giờ 60 phút, xem ngay điểm số và lời giải chi tiết song ngữ từng câu để khắc phục lỗi sai.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative text-center">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-0 h-px border-t-2 border-dashed border-slate-300 z-0" />
                  )}
                  <div className="relative z-10 space-y-3.5">
                    <div className="inline-flex items-center justify-center w-22 h-22 rounded-3xl bg-white border border-slate-200/90 shadow-md mb-2 mx-auto card-hover">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${item.color}`} />
                      </div>
                    </div>
                    <div className="text-sm sm:text-base font-black text-indigo-400 tracking-widest">{item.step}</div>
                    <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-white">
        {/* Submerged Animated Real High School Graduates Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 opacity-40 sm:opacity-55 animate-subtle-zoom">
            <img
              src="/images/bg-graduates.jpg"
              alt="High school graduates celebrating"
              className="w-full h-full object-cover object-[center_15%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/45 to-white/85" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-sm sm:text-base font-bold mb-4 shadow-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              Đánh giá thực tế từ học sinh
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Sĩ tử nói gì về <span className="gradient-text">ENGLISH HUB?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/90 p-7 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all card-hover flex flex-col justify-between shadow-lg shadow-slate-200/60"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-auto text-sm sm:text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {t.score}đ THPT
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed mb-6 italic font-medium">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/70">
                  <div
                    className={`w-11 h-11 rounded-full ${t.color} text-white font-bold text-base flex items-center justify-center shadow-xs`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BOTTOM BANNER ── */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 rounded-3xl p-10 sm:p-14 text-center overflow-hidden shadow-2xl shadow-indigo-300">
            {/* Submerged Animated Glass Book in Dark CTA */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-50 mix-blend-screen animate-subtle-drift">
              <img
                src="/images/bg-glass-book.jpg"
                alt="3D Glass Book in CTA"
                className="w-full h-full object-cover object-center scale-110"
              />
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm sm:text-base font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Hoàn toàn miễn phí 100%
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Sẵn sàng bứt phá<br />điểm 8+ môn Tiếng Anh?
              </h2>

              <p className="text-indigo-200 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Bắt đầu học ngay hôm nay để nắm chắc kiến thức và tự tin bước vào kỳ thi tốt nghiệp THPT Quốc Gia!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-3">
                <Link href="/register">
                  <button className="btn-shine inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-white text-indigo-900 font-black text-base sm:text-lg hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Đăng Ký Miễn Phí
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all">
                    <Play className="w-5 h-5 fill-white" />
                    Vào Bằng Tài Khoản Demo
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
