'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Check,
  Award,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_GRAMMAR_LESSONS } from '@/lib/data/initial-data';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { incrementUserProgress } from '@/lib/supabase/fallback-storage';

function GrammarLessonDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const lessonIndex = INITIAL_GRAMMAR_LESSONS.findIndex((l) => l.slug === slug);
  const lesson = INITIAL_GRAMMAR_LESSONS[lessonIndex];

  // Exercises state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedExercises, setSubmittedExercises] = useState(false);
  const [exerciseScore, setExerciseScore] = useState(0);

  if (!lesson) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy bài học ngữ pháp</h2>
        <Link href="/grammar">
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const prevLesson = lessonIndex > 0 ? INITIAL_GRAMMAR_LESSONS[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < INITIAL_GRAMMAR_LESSONS.length - 1
      ? INITIAL_GRAMMAR_LESSONS[lessonIndex + 1]
      : null;

  const handleSelectAnswer = (exId: string, optIndex: number) => {
    if (submittedExercises) return;
    setUserAnswers((prev) => ({ ...prev, [exId]: optIndex }));
  };

  const handleSubmitExercises = async () => {
    let score = 0;
    lesson.exercises.forEach((ex) => {
      if (userAnswers[ex.id] === ex.correct_answer) {
        score++;
      }
    });

    setExerciseScore(score);
    setSubmittedExercises(true);

    if (score === lesson.exercises.length) {
      confetti({ particleCount: 70, spread: 60 });
    }

    // Increment progress
    await incrementUserProgress('exercise', lesson.exercises.length);
    await incrementUserProgress('grammar', 1);
  };

  const handleResetExercises = () => {
    setUserAnswers({});
    setSubmittedExercises(false);
    setExerciseScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Ngữ Pháp Trọng Điểm</span>
        </Link>

        <Badge variant="blue" size="sm">
          Chuyên đề {lesson.order_index} / {INITIAL_GRAMMAR_LESSONS.length}
        </Badge>
      </div>

      {/* Lesson Header */}
      <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          {lesson.topic}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-base sm:text-lg font-semibold text-indigo-700">
          {lesson.title_vi}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">
          {lesson.summary}
        </p>

        {/* Highlighted Formula Card */}
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 font-bold overflow-x-auto">
          <code>{lesson.formula}</code>
        </div>
      </div>

      {/* Bilingual Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            1. Giải Thích Chi Tiết (Explanation)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400 block mb-1">
              Phân tích Tiếng Việt cho học sinh ôn thi:
            </span>
            <p>{lesson.explanation_vi}</p>
          </div>

          <div className="text-slate-600 text-xs italic px-1">
            <span className="font-semibold text-slate-500 not-italic">Academic note: </span>
            {lesson.explanation_en}
          </div>
        </CardContent>
      </Card>

      {/* Usage Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            2. Quy Tắc Áp Dụng (Usage Guidelines)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm text-slate-700">
            {lesson.usage.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Examples in Exam Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            3. Ví Dụ Mẫu Trong Đề Thi (Examples)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lesson.examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-sm"
            >
              <p className="font-bold text-slate-900">{ex.en}</p>
              <p className="text-xs text-slate-500">{ex.vi}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Common Mistakes & Traps */}
      <Card className="border-amber-200 bg-amber-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            4. Bẫy Thường Gặp Của Học Sinh (Common Mistakes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lesson.common_mistakes.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2 text-xs sm:text-sm"
            >
              <div className="flex items-start gap-2 text-red-600">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="line-through">{m.mistake}</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{m.correction}</span>
              </div>
              <p className="text-slate-600 text-xs pl-6 leading-relaxed">
                {m.explanation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interactive Practice Exercises */}
      <Card className="border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-950">
              <Award className="w-5 h-5 text-indigo-600" />
              5. Bài Tập Luyện Tập Thực Tế (Practice Exercises)
            </CardTitle>
            <Badge variant="indigo" size="sm">
              {lesson.exercises.length} Câu Trắc Nghiệm
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {lesson.exercises.map((ex, idx) => {
            const selectedOpt = userAnswers[ex.id];
            const isCorrect = selectedOpt === ex.correct_answer;

            return (
              <div
                key={ex.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3"
              >
                <div className="flex items-start gap-2 text-sm font-bold text-slate-900">
                  <span className="text-indigo-600 font-extrabold">Câu {idx + 1}:</span>
                  <p className="whitespace-pre-line">{ex.question}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {ex.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;

                    let optStyle = 'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';
                    if (submittedExercises) {
                      if (optIdx === ex.correct_answer) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'border-red-500 bg-red-50 text-red-900';
                      } else {
                        optStyle = 'border-slate-200 opacity-60 bg-white text-slate-500';
                      }
                    } else if (isSelected) {
                      optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submittedExercises}
                        onClick={() => handleSelectAnswer(ex.id, optIdx)}
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

                        {submittedExercises && optIdx === ex.correct_answer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submittedExercises && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submittedExercises && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 mt-2 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-indigo-700">
                      💡 Giải thích đáp án:
                    </span>
                    <p className="leading-relaxed">{ex.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Exercise Submit / Reset Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {!submittedExercises ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitExercises}
                disabled={Object.keys(userAnswers).length === 0}
                className="w-full sm:w-auto"
              >
                Chấm Điểm Bài Tập ({Object.keys(userAnswers).length}/{lesson.exercises.length})
              </Button>
            ) : (
              <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    Kết quả của bạn:
                  </span>
                  <Badge
                    variant={exerciseScore === lesson.exercises.length ? 'emerald' : 'indigo'}
                    size="md"
                  >
                    {exerciseScore} / {lesson.exercises.length} câu đúng
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetExercises} className="gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Làm Lại
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {prevLesson ? (
          <Link href={`/grammar/${prevLesson.slug}`}>
            <Button variant="outline" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Chuyên Đề Trước
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/grammar/${nextLesson.slug}`}>
            <Button variant="primary" size="md">
              Chuyên Đề Tiếp Theo
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        ) : (
          <Link href="/sentence-structures">
            <Button variant="primary" size="md">
              Học Cấu Trúc Câu 8+
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function GrammarLessonDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-semibold text-slate-500">
          Đang tải bài học ngữ pháp...
        </div>
      }
    >
      <GrammarLessonDetailContent />
    </Suspense>
  );
}
