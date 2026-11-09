'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Volume2,
  RotateCw,
  Sparkles,
  Flame,
  Target,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
  Award,
  HelpCircle,
  Play,
  Mic,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

export function HeroInteractive() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'flashcard' | 'quiz'>('flashcard');

  const word = 'Resilience';
  const ipa = '/rɪˈzɪl.jəns/';
  const meaning = 'Khả năng phục hồi, sự kiên cường vượt khó';
  const example =
    'Vietnamese students showed great resilience in overcoming exam pressure to achieve top scores.';
  const exampleVi =
    'Các bạn học sinh Việt Nam đã thể hiện sự kiên cường tuyệt vời khi vượt qua áp lực thi cử để đạt điểm cao.';

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === 'A') {
      setIsCorrect(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#7C3AED', '#38BDF8', '#10B981', '#F59E0B'],
      });
    } else {
      setIsCorrect(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* ── FLOATING BADGES AROUND THE CARD ── */}
      <div className="hidden sm:flex absolute -top-5 -left-4 z-20 items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md animate-float-slow">
        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
        </div>
        <div className="text-left">
          <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Streak 7 Ngày</div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold">Giữ nhịp ôn tập mỗi ngày</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -top-5 -right-3 z-20 items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md animate-float-delayed">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
          <Target className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-left">
          <div className="text-xs sm:text-sm font-black text-indigo-600 leading-tight">Mục tiêu 9+ THPT</div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-semibold">Bộ đề chuẩn cấu trúc BGD</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -bottom-5 -left-3 z-20 items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md animate-float-delayed">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-800">1.200+ Từ vựng trọng tâm</span>
      </div>

      <div className="hidden sm:flex absolute -bottom-5 -right-4 z-20 items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md animate-float-slow">
        <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
          <Award className="w-4 h-4 text-rose-500" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-800">Top 5% điểm thi cao</span>
      </div>

      {/* ── MAIN INTERACTIVE CONTAINER ── */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-200/60 animate-pulse-glow">
        <div className="bg-white rounded-[22px] p-6 sm:p-8 space-y-5">
          {/* Header Switcher: Flashcard vs Mini Quiz */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                Trải nghiệm học thử trực tiếp
              </span>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-bold">
              <button
                onClick={() => setActiveTab('flashcard')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg transition-all',
                  activeTab === 'flashcard'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                Flashcard 3D
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg transition-all',
                  activeTab === 'quiz'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                Trắc Nghiệm Nhanh
              </button>
            </div>
          </div>

          {/* TAB 1: 3D FLASHCARD INTERACTIVE */}
          {activeTab === 'flashcard' && (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-60 sm:h-72 cursor-pointer select-none perspective-1000"
              >
                <div
                  className={cn(
                    'relative w-full h-full duration-500 transform-style-preserve-3d transition-transform rounded-2xl shadow-sm border border-slate-200',
                    isFlipped ? 'rotate-y-180' : ''
                  )}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
                        Từ vựng điểm 8+
                      </span>
                      <button
                        onClick={handleSpeak}
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                          isPlayingAudio
                            ? 'bg-indigo-600 text-white scale-110 shadow-md'
                            : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 shadow-xs'
                        )}
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 className={cn('w-5 h-5', isPlayingAudio && 'animate-bounce')} />
                      </button>
                    </div>

                    <div className="text-center my-auto space-y-1.5">
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        {word}
                      </div>
                      <div className="text-sm sm:text-base text-indigo-600 font-bold font-mono tracking-wide">
                        {ipa} • <span className="text-slate-500 font-semibold">noun</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-2.5 font-semibold">
                      <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                        <RotateCw className="w-3.5 h-3.5" /> Chạm để lật thẻ
                      </span>
                      <span>Bấm loa để nghe phát âm</span>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
                        Định nghĩa & Ví dụ
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Chuẩn thi THPT
                      </span>
                    </div>

                    <div className="space-y-2.5 text-left my-auto">
                      <div className="text-lg sm:text-xl font-black text-indigo-950">
                        {meaning}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-800 leading-relaxed italic font-medium">
                        "{example}"
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">
                        👉 {exampleVi}
                      </div>
                    </div>

                    <div className="text-center text-xs sm:text-sm text-slate-500 font-semibold border-t border-slate-100 pt-2">
                      <span className="text-indigo-600 font-bold">Chạm lại để quay về mặt trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons under flashcard */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleSpeak}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-800 text-sm sm:text-base font-bold transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    Nghe Phát Âm Mỹ
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm sm:text-base font-bold transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    Lật Thẻ (Nghĩa Tiếng Việt)
                  </button>
                </div>
                <Link
                  href="/speaking"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black shadow-md shadow-purple-200 transition-all card-hover"
                >
                  <Mic className="w-4 h-4" />
                  <span>Luyện Phát Âm & AI Chấm Điểm Thang 10 🎙️</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: MINI QUIZ CHALLENGE */}
          {activeTab === 'quiz' && (
            <div className="space-y-4 py-1">
              <div className="text-left space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600">
                  <HelpCircle className="w-4 h-4" />
                  Câu hỏi ôn luyện điểm 8+
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  Từ nào dưới đây đồng nghĩa (CLOSEST in meaning) với <span className="text-indigo-600 underline underline-offset-2">"Resilience"</span>?
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'A', label: 'Perseverance', desc: 'Sự kiên trì, bền bỉ' },
                  { key: 'B', label: 'Hesitation', desc: 'Sự do dự, ngập ngừng' },
                  { key: 'C', label: 'Fragility', desc: 'Sự mong manh, dễ vỡ' },
                ].map((opt) => {
                  const isChosen = selectedAnswer === opt.key;
                  let btnStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white';

                  if (selectedAnswer !== null) {
                    if (opt.key === 'A') {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm';
                    } else if (isChosen && opt.key !== 'A') {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50/50 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswerSelect(opt.key)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all duration-200 card-hover flex flex-col justify-between',
                        btnStyle
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs sm:text-sm font-black flex items-center justify-center">
                          {opt.key}
                        </span>
                        {selectedAnswer !== null && opt.key === 'A' && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-sm sm:text-base font-black text-slate-900">{opt.label}</div>
                      <div className="text-xs text-slate-600 font-medium">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {selectedAnswer && (
                <div
                  className={cn(
                    'p-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-between animate-fade-in-up',
                    isCorrect
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{isCorrect ? '🎉' : '💡'}</span>
                    <div>
                      <span className="font-black">
                        {isCorrect ? 'Chính xác 100%! Tuyệt vời!' : 'Chưa đúng rồi!'}
                      </span>{' '}
                      {isCorrect
                        ? 'Resilience và Perseverance đều chỉ sự bền bỉ, kiên cường.'
                        : 'Đáp án đúng là A. Perseverance (Sự kiên trì, bền bỉ).'}
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="shrink-0 ml-2 text-xs font-bold underline hover:opacity-80"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer CTA */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Sẵn sàng thử thêm 1.200+ câu hỏi?
            </span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 group"
            >
              Làm đề thử đầy đủ
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
