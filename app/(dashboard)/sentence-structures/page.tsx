'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { INITIAL_SENTENCE_STRUCTURES } from '@/lib/data/initial-data';
import { StructureCategory, SentenceStructure } from '@/lib/types';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { incrementUserProgress } from '@/lib/supabase/fallback-storage';

const CATEGORIES: { label: string; value: StructureCategory | 'all' }[] = [
  { label: 'Tất Cả Mẫu Câu', value: 'all' },
  { label: 'Đảo Ngữ (Inversion)', value: 'inversion' },
  { label: 'Câu Chẻ (Cleft)', value: 'cleft' },
  { label: 'Giả Định (Subjunctive)', value: 'subjunctive' },
  { label: 'So Sánh Kép (Comparison)', value: 'comparison' },
  { label: 'Câu Phức (Complex)', value: 'compound_complex' },
  { label: 'Cơ Bản (Basic)', value: 'basic' },
];

export default function SentenceStructuresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StructureCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(
    INITIAL_SENTENCE_STRUCTURES[0]?.id || null
  );

  // Exercise states for each structure
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedCards, setSubmittedCards] = useState<Record<string, boolean>>({});

  const filteredStructures = useMemo(() => {
    return INITIAL_SENTENCE_STRUCTURES.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSelectAnswer = (structId: string, optIndex: number) => {
    if (submittedCards[structId]) return;
    setUserAnswers((prev) => ({ ...prev, [structId]: optIndex }));
  };

  const handleSubmitExercise = async (struct: SentenceStructure) => {
    setSubmittedCards((prev) => ({ ...prev, [struct.id]: true }));
    const exercise = struct.exercises[0];
    if (exercise && userAnswers[struct.id] === exercise.correct_answer) {
      confetti({ particleCount: 50, spread: 50 });
    }
    await incrementUserProgress('exercise', 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cấu Trúc Câu Điểm 8+ 9+
            </h1>
            <Badge variant="emerald" size="sm">
              Mẫu Câu Phân Loại
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chinh phục các dạng câu đảo ngữ, câu chẻ, câu giả định và biến đổi câu trong đề thi THPT Quốc Gia
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Tìm kiếm cấu trúc câu..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border',
              selectedCategory === cat.value
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Structures List */}
      <div className="space-y-4">
        {filteredStructures.length > 0 ? (
          filteredStructures.map((struct) => {
            const isExpanded = expandedId === struct.id;
            const isSubmitted = submittedCards[struct.id];
            const currentAnswer = userAnswers[struct.id];
            const exercise = struct.exercises[0];

            return (
              <Card
                key={struct.id}
                className={cn(
                  'transition-all duration-200',
                  isExpanded ? 'border-emerald-300 shadow-md ring-1 ring-emerald-100' : 'hover:border-slate-300'
                )}
              >
                {/* Header (Always Visible) */}
                <div
                  onClick={() => toggleExpand(struct.id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="sm">
                        {struct.category_label_vi}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">
                        THPT Phân loại
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {struct.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                      {struct.meaning_vi}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <span className="text-xs text-slate-400 block">
                        {isExpanded ? 'Thu gọn' : 'Xem chi tiết & bài tập'}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Formula pill */}
                <div className="px-5 sm:px-6 pb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto">
                    <code>{struct.formula}</code>
                  </div>
                </div>

                {/* Collapsible Details Body */}
                {isExpanded && (
                  <CardContent className="border-t border-slate-100 pt-5 space-y-6 animate-in fade-in duration-200">
                    {/* Usage */}
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Cách dùng và phân tích:
                      </span>
                      <p className="text-slate-600 leading-relaxed pl-5">
                        {struct.usage}
                      </p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Ví dụ mẫu trong bài thi:
                      </span>
                      <div className="space-y-2">
                        {struct.examples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm space-y-0.5"
                          >
                            <p className="font-bold text-slate-900">{ex.en}</p>
                            <p className="text-xs text-slate-500">{ex.vi}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Mistakes */}
                    {struct.common_mistakes.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2 text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Lỗi sai học sinh hay mắc phải:
                        </span>
                        <div className="space-y-1 pl-4">
                          <p className="text-red-600 line-through">
                            {struct.common_mistakes[0].mistake}
                          </p>
                          <p className="text-emerald-700 font-bold">
                            {struct.common_mistakes[0].correction}
                          </p>
                          <p className="text-slate-600 pt-0.5">
                            {struct.common_mistakes[0].explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Practice Exercise */}
                    {exercise && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-indigo-600" />
                            Bài tập thực hành nhanh:
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Trắc nghiệm chuẩn THPT
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line">
                          {exercise.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {exercise.options.map((opt, optIdx) => {
                            const isSelected = currentAnswer === optIdx;
                            const isCorrect = optIdx === exercise.correct_answer;

                            let optStyle =
                              'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';
                            if (isSubmitted) {
                              if (isCorrect) {
                                optStyle =
                                  'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                              } else if (isSelected && !isCorrect) {
                                optStyle = 'border-red-500 bg-red-50 text-red-900';
                              } else {
                                optStyle = 'border-slate-200 opacity-50 bg-white text-slate-500';
                              }
                            } else if (isSelected) {
                              optStyle =
                                'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectAnswer(struct.id, optIdx)}
                                className={cn(
                                  'p-3 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between',
                                  optStyle
                                )}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </span>

                                {isSubmitted && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {isSubmitted && isSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {!isSubmitted ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={currentAnswer === undefined}
                            onClick={() => handleSubmitExercise(struct)}
                            className="mt-2"
                          >
                            Kiểm Tra Câu Trả Lời
                          </Button>
                        ) : (
                          <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                            <span className="font-bold">💡 Lời giải thích:</span>
                            <p>{exercise.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Không tìm thấy mẫu câu phù hợp</h3>
            <p className="text-xs text-slate-500">
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục "Tất Cả Mẫu Câu".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
