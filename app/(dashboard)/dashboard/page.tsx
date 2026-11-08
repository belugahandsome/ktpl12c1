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
    // Dynamic greeting based on current local hour
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');

    getActiveUser().then(setUser);
    getUserProgress().then(setProgress);
    getQuizAttempts().then(setRecentAttempts);
  }, []);

  const totalWords = progress?.words_learned || 28;
  const grammarCount = progress?.grammar_completed || 6;
  const exercisesCount = progress?.exercises_completed || 45;
  const streak = progress?.streak_days || 7;

  // Daily target: e.g. 15 exercises per day
  const dailyTarget = 15;
  const dailyDone = Math.min(dailyTarget, 11);
  const dailyPercent = Math.round((dailyDone / dailyTarget) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. WELCOME SECTION */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kỳ thi Tốt nghiệp THPT Quốc Gia 2025</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {greeting}, {user?.display_name || 'Học viên'}!
          </h1>

          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            "Sự kiên trì hôm nay là số điểm bứt phá ngày mai." Hãy hoàn thành mục tiêu ôn tập hàng ngày để nắm chắc điểm 8+ và 9+ môn Tiếng Anh!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/exam-practice/mock">
              <Button size="md" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold shadow-md">
                <GraduationCap className="w-4 h-4 mr-1.5 text-indigo-600" />
                Làm Đề Thi Thử Ngay
              </Button>
            </Link>
            <Link href="/vocabulary">
              <Button size="md" variant="ghost" className="text-white hover:bg-white/15">
                <Brain className="w-4 h-4 mr-1.5" />
                Ôn Từ Vựng Hôm Nay
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. LEARNING OVERVIEW STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Words */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Từ Vựng Đã Học</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{totalWords}</h3>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +5 từ hôm nay
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Grammar */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Chuyên Đề Ngữ Pháp</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{grammarCount}/12</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Hoàn thành {Math.round((grammarCount / 12) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Exercises */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Bài Tập Đã Làm</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{exercisesCount}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Độ chính xác ~ 86%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: Streak */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Chuỗi Học Tập (Streak)</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{streak} Ngày</h3>
              <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                Rèn luyện tuyệt vời!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Continue Learning & 4 Categories */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3. CONTINUE LEARNING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Tiếp Tục Bài Học</h2>
              <span className="text-xs text-slate-500">Gần đây nhất</span>
            </div>

            <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white hover:border-indigo-200 transition-colors">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="indigo" size="sm">
                    Đang học dở
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900">
                    Chuyên đề 03: Câu điều kiện & Đảo ngữ (Conditionals & Inversion)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Đã hoàn thành phần lý thuyết • Còn 2 câu bài tập kiểm tra trắc nghiệm
                  </p>
                  <div className="w-64 max-w-full pt-1">
                    <ProgressBar value={75} barColor="bg-indigo-600" />
                  </div>
                </div>

                <Link href="/grammar/conditional-sentences-and-inversion" className="shrink-0">
                  <Button size="md" variant="primary" className="gap-1.5 shadow-sm">
                    Học Tiếp <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 4. LEARNING CATEGORIES (4 CARDS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Các Trụ Cột Ôn Luyện</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category 1 */}
              <Link href="/vocabulary" className="group">
                <Card className="h-full hover:border-indigo-300 hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        Từ Vựng Flashcard
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        10 chủ đề bám sát kỳ thi, tra cứu IPA, phát âm bản ngữ và flashcards 3D.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 2 */}
              <Link href="/grammar" className="group">
                <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                        Ngữ Pháp Trọng Điểm
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        12 chuyên đề then chốt: Thì, Bị động, Thể truyền khiến, Mệnh đề quan hệ.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 3 */}
              <Link href="/sentence-structures" className="group">
                <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                        Cấu Trúc Câu Điểm 8+
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Đảo ngữ, câu chẻ, câu giả định, so sánh kép... ăn chắc điểm viết lại câu.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Category 4 */}
              <Link href="/exam-practice" className="group">
                <Card className="h-full hover:border-purple-300 hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                        Luyện Đề Chuẩn Bộ GD
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Phòng thi bấm giờ, chấm điểm tự động và lời giải chi tiết từng câu.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Daily Goal & Recent Activities */}
        <div className="space-y-8">
          {/* 5. DAILY LEARNING GOAL */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  Mục Tiêu Hôm Nay
                </CardTitle>
                <span className="text-xs font-bold text-indigo-600">{dailyPercent}%</span>
              </div>
              <CardDescription>
                Hoàn thành 15 bài tập mỗi ngày để giữ vững phong độ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={dailyPercent} barColor="bg-indigo-600" />
              <div className="flex justify-between text-xs text-slate-600 font-semibold pt-1">
                <span>Đã làm: {dailyDone} bài</span>
                <span>Chỉ tiêu: {dailyTarget} bài</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                💡 <strong>Mẹo hôm nay:</strong> Làm 1 đề thi thử ngắn 15 câu giúp bạn ôn luyện đồng thời cả từ vựng và ngữ pháp!
              </div>
            </CardContent>
          </Card>

          {/* 6. RECENT ACTIVITIES */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Hoạt Động Gần Đây
                </CardTitle>
                <Link href="/progress" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Xem tất cả
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAttempts.length > 0 ? (
                recentAttempts.slice(0, 3).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <p className="font-bold text-slate-900 truncate">
                        {attempt.quiz_title}
                      </p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-2">
                        <span>Đúng: {attempt.correct_count}/{attempt.total_questions}</span>
                        <span>•</span>
                        <span>{formatTime(attempt.time_spent_seconds)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-indigo-600">
                        {attempt.score.toFixed(1)}đ
                      </div>
                      <Badge variant={attempt.score >= 8 ? 'emerald' : 'blue'} size="sm">
                        {attempt.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Chưa có hoạt động làm đề thi nào. Bắt đầu ngay hôm nay!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
