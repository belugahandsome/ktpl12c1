'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_EXAM_QUESTIONS } from '@/lib/data/initial-data';
import { ExamCategory, DifficultyLevel } from '@/lib/types';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { incrementUserProgress } from '@/lib/supabase/fallback-storage';

function TopicPracticeContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ExamCategory) || 'pronunciation';

  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    return INITIAL_EXAM_QUESTIONS.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [selectedCategory, selectedDifficulty]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = async (optLabel: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ || revealedExplanations[currentQ.id]) return;

    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optLabel }));
    setRevealedExplanations((prev) => ({ ...prev, [currentQ.id]: true }));

    if (optLabel === currentQ.correct_option) {
      confetti({ particleCount: 40, spread: 45 });
    }

    await incrementUserProgress('exercise', 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link
          href="/exam-practice"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Luyện Thi THPT</span>
        </Link>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value as DifficultyLevel | 'all');
              setCurrentIndex(0);
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Mọi độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Nâng cao (8+ 9+)</option>
          </select>
        </div>
      </div>

      {currentQ ? (
        <Card className="border-slate-200/90 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Question meta */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-indigo-600 text-lg">
                  Câu {currentIndex + 1}
                </span>
                <span className="text-xs text-slate-400">/ {filteredQuestions.length}</span>
                <Badge variant="blue" size="sm">
                  {currentQ.category_label_vi}
                </Badge>
              </div>

              <Badge
                variant={
                  currentQ.difficulty === 'hard'
                    ? 'rose'
                    : currentQ.difficulty === 'medium'
                    ? 'amber'
                    : 'emerald'
                }
                size="sm"
              >
                {currentQ.difficulty.toUpperCase()}
              </Badge>
            </div>

            {/* Passage if applicable */}
            {currentQ.passage && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-line max-h-60 overflow-y-auto">
                <span className="font-bold font-sans uppercase text-[10px] text-indigo-600 block mb-1">
                  Đoạn văn đọc hiểu / điền khuyết:
                </span>
                {currentQ.passage}
              </div>
            )}

            {/* Question prompt */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
              {currentQ.question_text}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.label;
                const isRevealed = revealedExplanations[currentQ.id];
                const isCorrect = opt.label === currentQ.correct_option;

                let optStyle =
                  'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';
                if (isRevealed) {
                  if (isCorrect) {
                    optStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                  } else {
                    optStyle = 'border-slate-200 opacity-50 bg-white text-slate-500';
                  }
                }

                return (
                  <button
                    key={opt.label}
                    disabled={isRevealed}
                    onClick={() => handleSelectOption(opt.label)}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between',
                      optStyle
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </span>

                    {isRevealed && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Bilingual Explanation */}
            {revealedExplanations[currentQ.id] && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5 text-xs text-indigo-950 animate-in fade-in duration-200">
                <span className="font-bold text-indigo-700 flex items-center gap-1">
                  💡 Lời giải chi tiết:
                </span>
                <p className="leading-relaxed whitespace-pre-line text-slate-700">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Câu Trước
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(filteredQuestions.length - 1, prev + 1)
                  )
                }
                disabled={currentIndex === filteredQuestions.length - 1}
                className="gap-1.5"
              >
                Câu Tiếp Theo <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm">
            Không tìm thấy câu hỏi trong bộ lọc đã chọn.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TopicPracticeRunnerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-semibold text-slate-500">
          Đang tải bài tập chuyên đề...
        </div>
      }
    >
      <TopicPracticeContent />
    </Suspense>
  );
}
