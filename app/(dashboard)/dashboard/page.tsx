'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Brain,
  BookMarked,
  Layers,
  GraduationCap,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Target,
  Video,
  Play,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  getActiveUser,
  getUserProgress,
  getQuizAttempts,
} from '@/lib/supabase/fallback-storage';
import { UserProfile, UserProgress, QuizAttempt } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [greeting, setGreeting] = useState('Chào buổi sáng');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');

    getActiveUser().then(setUser);
    getUserProgress().then(setProgress);
    getQuizAttempts().then(setRecentAttempts);
  }, []);

  // Precise statistics without hardcoded defaults for new users
  const totalWords = progress?.words_learned ?? 0;
  const grammarCount = progress?.grammar_completed ?? 0;
  const exercisesCount = progress?.exercises_completed ?? 0;
  const streak = progress?.streak_days !== undefined ? progress.streak_days : 1;

  // Daily target: 15 exercises per day
  const dailyTarget = 15;
  const dailyDone = progress?.exercises_completed
    ? Math.min(dailyTarget, progress.exercises_completed)
    : 0;
  const dailyPercent = Math.round((dailyDone / dailyTarget) * 100);

  const targetScore = user?.target_score ? user.target_score.toFixed(1) : '8.0';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. WELCOME HERO BANNER ── */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-7 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Ambient glowing blobs */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Kỳ thi Tốt nghiệp THPT Quốc Gia 2027</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/30 text-indigo-100 text-xs sm:text-sm font-bold">
              <Target className="w-3.5 h-3.5 text-indigo-300" />
              <span>Mục tiêu: {targetScore}đ</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {greeting}, {user?.display_name || 'Học viên'}! 👋
          </h1>

          <p className="text-indigo-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium">
            "Sự kiên trì hôm nay là số điểm bứt phá ngày mai." Hãy hoàn thành mục tiêu 15 câu bài tập
            hôm nay để củng cố kiến thức và tự tin đạt điểm 8+ 9+ môn Tiếng Anh!
          </p>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <Link href="/exam-practice/mock">
              <button className="btn-shine inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-black text-sm sm:text-base shadow-md transition-all">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Làm Đề Thi Thử Ngay
              </button>
            </Link>
            <Link href="/vocabulary">
              <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base transition-all backdrop-blur-md border border-white/20">
                <Brain className="w-5 h-5 text-amber-300" />
                Ôn Từ Vựng Flashcard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. REALTIME LEARNING STATS (4 CARDS) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Words Learned */}
        <Card className="hover:shadow-md transition-shadow card-hover">
          <CardContent className="p-6 flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-600">Từ Vựng Đã Học</p>
              <h3 className="text-3xl sm:text-4xl font-black gradient-text">{totalWords}</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                {totalWords > 0 ? `Đang ôn ${totalWords}/1.200 từ` : 'Bắt đầu học 10 từ đầu tiên'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Grammar Completed */}
        <Card className="hover:shadow-md transition-shadow card-hover">
          <CardContent className="p-6 flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-600">Chuyên Đề Ngữ Pháp</p>
              <h3 className="text-3xl sm:text-4xl font-black gradient-text">{grammarCount}/12</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                {grammarCount > 0 ? `Đạt ${Math.round((grammarCount / 12) * 100)}%` : '12 chuyên đề điểm 8+'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Exercises Completed */}
        <Card className="hover:shadow-md transition-shadow card-hover">
          <CardContent className="p-6 flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-600">Bài Tập Đã Làm</p>
              <h3 className="text-3xl sm:text-4xl font-black gradient-text">{exercisesCount}</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                {exercisesCount > 0 ? 'Có lời giải chi tiết' : 'Chưa có bài tập nào'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: Streak Days */}
        <Card className="hover:shadow-md transition-shadow card-hover">
          <CardContent className="p-6 flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="w-7 h-7 fill-amber-500 text-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-600">Chuỗi Streak</p>
              <h3 className="text-3xl sm:text-4xl font-black gradient-text">{streak} Ngày</h3>
              <p className="text-xs sm:text-sm text-amber-700 font-bold mt-0.5">
                {streak > 1 ? 'Giữ vững ngọn lửa!' : 'Bắt đầu ngày 1!'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT AREA (2 COLUMNS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Core Learning Pillars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Các Trụ Cột Ôn Luyện</h2>
            <span className="text-xs sm:text-sm text-slate-500 font-bold">Bám sát cấu trúc Bộ GD&ĐT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Pillar 1: Vocab */}
            <Link href="/vocabulary" className="group">
              <Card className="h-full hover:border-indigo-300 hover:shadow-xl transition-all card-hover">
                <CardContent className="p-6 space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      Từ Vựng Flashcard 3D
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-medium">
                      10 chủ đề trọng tâm, phát âm chuẩn IPA bản xứ và phương pháp lặp lại ngắt quãng.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-xs sm:text-sm font-black text-indigo-600">
                    <span>1.200+ từ vựng</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Pillar 2: Grammar */}
            <Link href="/grammar" className="group">
              <Card className="h-full hover:border-blue-300 hover:shadow-xl transition-all card-hover">
                <CardContent className="p-6 space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                      Ngữ Pháp Trọng Điểm
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-medium">
                      12 chuyên đề then chốt: Thì, Bị động, Câu điều kiện, Đảo ngữ, Mệnh đề quan hệ.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-xs sm:text-sm font-black text-blue-600">
                    <span>12 Chuyên đề trọng tâm</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Pillar 3: Sentence Structures */}
            <Link href="/sentence-structures" className="group">
              <Card className="h-full hover:border-emerald-300 hover:shadow-xl transition-all card-hover">
                <CardContent className="p-6 space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                      Cấu Trúc Câu Điểm 8+
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-medium">
                      Đảo ngữ, câu chẻ, câu giả định, so sánh kép... ăn trọn điểm phần viết lại câu.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-xs sm:text-sm font-black text-emerald-600">
                    <span>80+ Cấu trúc vàng</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Pillar 4: Mock Exams */}
            <Link href="/exam-practice" className="group">
              <Card className="h-full hover:border-purple-300 hover:shadow-xl transition-all card-hover">
                <CardContent className="p-6 space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                      Luyện Đề Chuẩn Bộ GD
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-medium">
                      Phòng thi bấm giờ 60 phút, chấm điểm tự động và lời giải thích song ngữ từng câu.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-xs sm:text-sm font-black text-purple-600">
                    <span>Format thi mới nhất</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Column (1 Col): Daily Goal & Recent Attempts */}
        <div className="space-y-6">
          {/* DAILY LEARNING GOAL */}
          <Card>
            <CardHeader className="pb-3.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Mục Tiêu Hôm Nay
                </CardTitle>
                <span className="text-sm sm:text-base font-black text-indigo-600">{dailyPercent}%</span>
              </div>
              <CardDescription className="text-xs sm:text-sm font-medium">
                Chỉ tiêu 15 bài tập mỗi ngày để bứt phá điểm số
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={dailyPercent} barColor="bg-indigo-600" />
              <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-bold pt-1">
                <span>Đã làm: {dailyDone} bài</span>
                <span>Chỉ tiêu: {dailyTarget} bài</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {dailyDone === 0 ? (
                  <span>
                    💡 <strong>Gợi ý:</strong> Làm thử 1 đề kiểm tra 10 câu trắc nghiệm để hoàn thành 66% mục tiêu ngày hôm nay!
                  </span>
                ) : (
                  <span>
                    🎉 <strong>Xuất sắc!</strong> Bạn đang tiến rất gần đến mục tiêu điểm {targetScore}đ!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RECENT ACTIVITIES */}
          <Card>
            <CardHeader className="pb-3.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Hoạt Động Gần Đây
                </CardTitle>
                {recentAttempts.length > 0 && (
                  <Link
                    href="/progress"
                    className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline"
                  >
                    Xem tất cả
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {recentAttempts.length > 0 ? (
                recentAttempts.slice(0, 3).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <p className="font-black text-sm sm:text-base text-slate-900 truncate">
                        {attempt.quiz_title}
                      </p>
                      <p className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center gap-2">
                        <span>
                          Đúng: {attempt.correct_count}/{attempt.total_questions}
                        </span>
                        <span>•</span>
                        <span>{formatTime(attempt.time_spent_seconds)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-indigo-600">
                        {attempt.score.toFixed(1)}đ
                      </div>
                      <Badge variant={attempt.score >= 8 ? 'emerald' : 'blue'} size="sm">
                        {attempt.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-7 px-4 text-center space-y-3.5 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-black text-slate-900">
                      Chưa có bài thi nào
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto font-medium">
                      Hãy bắt đầu bằng một bài kiểm tra ngắn để ghi nhận số điểm đầu tiên của bạn!
                    </p>
                  </div>
                  <Link href="/exam-practice/mock">
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      Làm bài kiểm tra đầu tiên
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
