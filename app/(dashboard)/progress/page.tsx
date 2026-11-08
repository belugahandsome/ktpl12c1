'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Brain,
  BookMarked,
  CheckCircle2,
  Flame,
  Award,
  Calendar,
  Layers,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getUserProgress,
  getQuizAttempts,
  getActiveUser,
} from '@/lib/supabase/fallback-storage';
import { UserProgress, QuizAttempt, UserProfile } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';

export default function ProgressPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    getActiveUser().then(setUser);
    getUserProgress().then(setProgress);
    getQuizAttempts().then(setAttempts);
  }, []);

  const wordsLearned = progress?.words_learned || 28;
  const totalVocabTarget = 52;
  const vocabPercent = Math.min(100, Math.round((wordsLearned / totalVocabTarget) * 100));

  const grammarCompleted = progress?.grammar_completed || 6;
  const totalGrammarTarget = 10;
  const grammarPercent = Math.min(100, Math.round((grammarCompleted / totalGrammarTarget) * 100));

  const exercisesCompleted = progress?.exercises_completed || 45;

  // Calculate average exam score
  const avgScore =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) * 10
        ) / 10
      : 8.5;

  const weeklyData = progress?.weekly_activity || [
    { day: 'T2', count: 12 },
    { day: 'T3', count: 18 },
    { day: 'T4', count: 15 },
    { day: 'T5', count: 25 },
    { day: 'T6', count: 20 },
    { day: 'T7', count: 32 },
    { day: 'CN', count: 22 },
  ];

  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), 35);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tiến Độ Học Tập (Analytics)
          </h1>
          <Badge variant="emerald" size="sm">
            Dữ Liệu Cá Nhân
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi sát sao từng giờ học, số lượng từ vựng tích lũy và phong độ giải đề thi THPT Quốc Gia
        </p>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Từ Vựng Đã Học</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{wordsLearned}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Mục tiêu: {totalVocabTarget} từ</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Chuyên Đề Ngữ Pháp</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{grammarCompleted}/10</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Hoàn thành {grammarPercent}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Bài Tập Đã Giải</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{exercisesCompleted}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Độ chính xác ~88%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Điểm Thi Thử Trung Bình</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{avgScore.toFixed(1)}đ</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
                Mục tiêu: {user?.target_score?.toFixed(1) || '8.5'}đ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Weekly Activity Chart & Category Meters */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Activity Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Hoạt Động Học Tập 7 Ngày Qua
                  </CardTitle>
                  <CardDescription>
                    Số lượng câu hỏi và thẻ từ vựng đã ôn luyện mỗi ngày
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{progress?.streak_days || 7} Ngày Liên Tục</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Responsive SVG Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b border-slate-100 pb-3">
                {weeklyData.map((d, idx) => {
                  const heightPercent = Math.round((d.count / maxWeeklyCount) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {d.count}
                      </span>
                      <div className="w-full max-w-[42px] bg-slate-100 rounded-xl overflow-hidden h-40 flex items-end">
                        <div
                          className="w-full bg-indigo-600 group-hover:bg-indigo-700 transition-all duration-500 rounded-xl"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 mt-1">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Module Progress Meters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mức Độ Hoàn Thành Các Học Phần</CardTitle>
              <CardDescription>
                Tiến độ bao phủ kiến thức thi tốt nghiệp THPT Quốc Gia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vocab meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Brain className="w-4 h-4 text-indigo-600" /> Từ Vựng (10 Chủ Đề)
                  </span>
                  <span className="text-indigo-600 font-bold">
                    {wordsLearned} / {totalVocabTarget} từ ({vocabPercent}%)
                  </span>
                </div>
                <ProgressBar value={vocabPercent} barColor="bg-indigo-600" />
              </div>

              {/* Grammar meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <BookMarked className="w-4 h-4 text-blue-600" /> Ngữ Pháp Trọng Điểm
                  </span>
                  <span className="text-blue-600 font-bold">
                    {grammarCompleted} / {totalGrammarTarget} chuyên đề ({grammarPercent}%)
                  </span>
                </div>
                <ProgressBar value={grammarPercent} barColor="bg-blue-600" />
              </div>

              {/* Mock Exam Practice meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <GraduationCap className="w-4 h-4 text-purple-600" /> Luyện Đề Thi Thử
                  </span>
                  <span className="text-purple-600 font-bold">
                    {attempts.length} đề đã làm
                  </span>
                </div>
                <ProgressBar
                  value={Math.min(100, attempts.length * 50)}
                  barColor="bg-purple-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Exam Performance & Recommendations */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Đánh Giá Năng Lực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block">
                  🎯 Dự báo điểm thi THPT: {avgScore.toFixed(1)} - {(avgScore + 0.5).toFixed(1)}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Dựa trên các bài thi thử gần đây, bạn đang duy trì phong độ rất ổn định ở các câu hỏi Ngữ âm và Trọng âm.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900">Điểm mạnh nổi trội:</h4>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="emerald" size="sm">Phát âm -ed & -s</Badge>
                  <Badge variant="emerald" size="sm">12 Thì tiếng Anh</Badge>
                  <Badge variant="emerald" size="sm">Câu bị động</Badge>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900">Cần tiếp tục cải thiện:</h4>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="amber" size="sm">Đảo ngữ điều kiện</Badge>
                  <Badge variant="amber" size="sm">Đọc hiểu đoạn dài</Badge>
                  <Badge variant="amber" size="sm">Thành ngữ (Idioms)</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link href="/exam-practice">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Luyện Đề Bù Lỗ Hổng <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
