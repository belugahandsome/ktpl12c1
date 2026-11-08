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
      <div className="hidden sm:flex absolute -top-5 -left-4 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md animate-float-slow">
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-800 leading-tight">Streak 7 Ngày</div>
          <div className="text-[9px] text-slate-400 font-medium">Giữ nhịp ôn tập mỗi ngày</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -top-5 -right-3 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md animate-float-delayed">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-indigo-600 leading-tight">Mục tiêu 9+ THPT</div>
          <div className="text-[9px] text-slate-400 font-medium">Bộ đề chuẩn cấu trúc BGD</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -bottom-5 -left-3 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md animate-float-delayed">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <span className="text-[11px] font-bold text-slate-700">1.200+ Từ vựng trọng tâm</span>
      </div>

      <div className="hidden sm:flex absolute -bottom-5 -right-4 z-20 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md animate-float-slow">
        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
          <Award className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <span className="text-[11px] font-bold text-slate-700">Top 5% điểm thi cao</span>
      </div>

      {/* ── MAIN INTERACTIVE CONTAINER ── */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-200/60 animate-pulse-glow">
        <div className="bg-white rounded-[22px] p-5 sm:p-7 space-y-4">
          {/* Header Switcher: Flashcard vs Mini Quiz */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Trải nghiệm học thử trực tiếp
              </span>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('flashcard')}
                className={cn(
                  'px-3 py-1 rounded-lg transition-all',
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
                  'px-3 py-1 rounded-lg transition-all',
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
                className="w-full h-56 sm:h-64 cursor-pointer select-none perspective-1000"
              >
                <div
                  className={cn(
                    'relative w-full h-full duration-500 transform-style-preserve-3d transition-transform rounded-2xl shadow-sm border border-slate-200',
                    isFlipped ? 'rotate-y-180' : ''
                  )}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Từ vựng điểm 8+
                      </span>
                      <button
                        onClick={handleSpeak}
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                          isPlayingAudio
                            ? 'bg-indigo-600 text-white scale-110 shadow-md'
                            : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 shadow-xs'
                        )}
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 className={cn('w-4 h-4', isPlayingAudio && 'animate-bounce')} />
                      </button>
                    </div>

                    <div className="text-center my-auto space-y-1">
                      <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {word}
                      </div>
                      <div className="text-xs text-indigo-600 font-semibold font-mono tracking-wide">
                        {ipa} • <span className="text-slate-400 font-normal">noun</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
                      <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                        <RotateCw className="w-3 h-3" /> Chạm để lật thẻ
                      </span>
                      <span>Bấm loa để nghe phát âm</span>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Định nghĩa & Ví dụ
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Chuẩn thi THPT
                      </span>
                    </div>

                    <div className="space-y-2 text-left my-auto">
                      <div className="text-base sm:text-lg font-bold text-indigo-950">
                        {meaning}
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                        "{example}"
                      </div>
                      <div className="text-[11px] text-slate-500">
                        👉 {exampleVi}
                      </div>
                    </div>

                    <div className="text-center text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-2">
                      <span className="text-indigo-600 font-semibold">Chạm lại để quay về mặt trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons under flashcard */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleSpeak}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe Phát Âm Mỹ
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Lật Thẻ (Nghĩa Tiếng Việt)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MINI QUIZ CHALLENGE */}
          {activeTab === 'quiz' && (
            <div className="space-y-3.5 py-1">
              <div className="text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Câu hỏi ôn luyện điểm 8+
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  Từ nào dưới đây đồng nghĩa (CLOSEST in meaning) với <span className="text-indigo-600 underline underline-offset-2">"Resilience"</span>?
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                        'p-3 rounded-xl border text-left transition-all duration-200 card-hover flex flex-col justify-between',
                        btnStyle
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                          {opt.key}
                        </span>
                        {selectedAnswer !== null && opt.key === 'A' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {selectedAnswer && (
                <div
                  className={cn(
                    'p-3 rounded-xl text-xs flex items-center justify-between animate-fade-in-up',
                    isCorrect
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{isCorrect ? '🎉' : '💡'}</span>
                    <div>
                      <span className="font-bold">
                        {isCorrect ? 'Chính xác 100%! Tuyệt vời!' : 'Chưa đúng rồi!'}
                      </span>{' '}
                      {isCorrect
                        ? 'Resilience và Perseverance đều chỉ sự bền bỉ, kiên cường.'
                        : 'Đáp án đúng là A. Perseverance (Sự kiên trì, bền bỉ).'}
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="shrink-0 ml-2 text-[11px] font-bold underline hover:opacity-80"
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
