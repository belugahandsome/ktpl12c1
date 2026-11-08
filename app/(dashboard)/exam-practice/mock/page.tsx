'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Timer,
  Flag,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_MOCK_EXAMS } from '@/lib/data/initial-data';
import { cn, formatTime } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { saveQuizAttempt } from '@/lib/supabase/fallback-storage';

function MockExamRunnerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get('id') || 'exam-thpt-2025-101';

  const exam =
    INITIAL_MOCK_EXAMS.find((e) => e.id === examId) || INITIAL_MOCK_EXAMS[0];

  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.duration_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Result state
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = exam.questions[currentQuestionIndex];

  const handleSelectOption = (optLabel: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optLabel,
    }));
  };

  const handleToggleFlag = (qId: string) => {
    if (isSubmitted) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleSubmitExam = async () => {
    setShowConfirmModal(false);
    setIsSubmitted(true);

    let correct = 0;
    exam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_option) {
        correct++;
      }
    });

    const incorrect = exam.questions.length - correct;
    const finalScore = Math.round((correct / exam.questions.length) * 10 * 10) / 10;
    const percentage = Math.round((correct / exam.questions.length) * 100);

    setCorrectCount(correct);
    setIncorrectCount(incorrect);
    setScore(finalScore);

    if (finalScore >= 8.0) {
      confetti({ particleCount: 90, spread: 70 });
    }

    // Save to database / local store
    await saveQuizAttempt({
      quiz_id: exam.id,
      quiz_title: exam.title,
      quiz_type: 'mock_exam',
      score: finalScore,
      percentage,
      total_questions: exam.questions.length,
      correct_count: correct,
      incorrect_count: incorrect,
      time_spent_seconds: timeSpent,
      answers: userAnswers,
    });
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = exam.questions.length - answeredCount;

  return (
    <div className="space-y-6">
      {/* Top Banner & Timer */}
      <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/exam-practice"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                {exam.code}
              </span>
              <Badge variant="indigo" size="sm">
                THPT Quốc Gia
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-sm">
              {exam.title}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4">
          {!isSubmitted ? (
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold shadow-xs border',
                timeLeftSeconds < 300
                  ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              )}
            >
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          ) : (
            <Badge variant="emerald" size="md">
              Đã Nộp Bài
            </Badge>
          )}

          {!isSubmitted && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowConfirmModal(true)}
              className="font-bold shadow-sm"
            >
              Nộp Bài Thi
            </Button>
          )}
        </div>
      </div>

      {/* SUBMISSION RESULTS REPORT (When exam is finished) */}
      {isSubmitted && (
        <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-white shadow-xl animate-in zoom-in-95 duration-200">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-indigo-100">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                  {score.toFixed(1)}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {score >= 8.0
                      ? 'Kết Quả Xuất Sắc!'
                      : score >= 6.5
                      ? 'Kết Quả Khá Tốt!'
                      : 'Cần Luyện Tập Thêm'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thang điểm 10 chuẩn thi Tốt nghiệp THPT Quốc Gia môn Tiếng Anh
                  </p>
                </div>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-700">{correctCount}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold uppercase">Câu Đúng</div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <div className="text-lg font-bold text-red-700">{incorrectCount}</div>
                  <div className="text-[10px] text-red-600 font-semibold uppercase">Câu Sai</div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="text-lg font-bold text-indigo-700 font-mono">
                    {formatTime(timeSpent)}
                  </div>
                  <div className="text-[10px] text-indigo-600 font-semibold uppercase">Thời Gian</div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs leading-relaxed">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Nhận xét & Khuyến nghị ôn tập:
              </div>
              <p className="text-slate-600">
                {score >= 9.0
                  ? 'Bạn đã làm chủ gần như toàn bộ các bẫy phân loại trong đề thi. Hãy duy trì giải 1 đề mỗi tuần để giữ tốc độ đọc hiểu và độ nhạy câu hỏi!'
                  : score >= 7.0
                  ? 'Kiến thức ngữ pháp cơ bản khá vững. Hãy tập trung cải thiện dạng bài Đọc hiểu văn bản và Đảo ngữ câu điều kiện để bứt phá lên 8.5+.'
                  : 'Nên củng cố lại 12 thì tiếng Anh, câu bị động và quy tắc phát âm đuôi -ed, trọng âm 2 âm tiết để lấy trọn điểm phần cơ bản.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MAIN EXAM INTERFACE: Question View + Question Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column (3 Cols): Active Question */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-slate-200/90 shadow-md">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-indigo-600 text-lg">
                    Câu {currentQuestionIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400">/ {exam.questions.length}</span>
                  <Badge variant="blue" size="sm">
                    {currentQ.category_label_vi}
                  </Badge>
                </div>

                {!isSubmitted && (
                  <button
                    onClick={() => handleToggleFlag(currentQ.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors',
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600'
                    )}
                  >
                    <Flag className={cn('w-3.5 h-3.5', flaggedQuestions[currentQ.id] && 'fill-amber-500')} />
                    <span>{flaggedQuestions[currentQ.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</span>
                  </button>
                )}
              </div>

              {/* Reading / Cloze Passage (if available) */}
              {currentQ.passage && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-64 overflow-y-auto space-y-2">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 text-[10px] block">
                    Đoạn văn đọc hiểu (Reading Passage):
                  </span>
                  <p className="whitespace-pre-line font-serif">{currentQ.passage}</p>
                </div>
              )}

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.question_text}
              </div>

              {/* Options A, B, C, D */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.label;
                  const isCorrect = opt.label === currentQ.correct_option;

                  let optStyle =
                    'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 bg-white text-slate-800';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                    } else {
                      optStyle = 'border-slate-200 opacity-50 bg-white text-slate-500';
                    }
                  } else if (isSelected) {
                    optStyle =
                      'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(opt.label)}
                      className={cn(
                        'w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between',
                        optStyle
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            'w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                            isSelected && !isSubmitted
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          )}
                        >
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </span>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation (Shown after submission) */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 space-y-2 text-xs text-indigo-950 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đáp án đúng: {currentQ.correct_option} • Lời giải chi tiết:
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-slate-700">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Question Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Câu Trước
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(exam.questions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="gap-1.5"
                >
                  Câu Tiếp Theo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Question Matrix Navigation */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Bảng Câu Hỏi ({answeredCount}/{exam.questions.length})
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">
                  Nhấp để chuyển câu
                </span>
              </div>

              {/* Question Grid Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCorrect = isSubmitted && userAnswers[q.id] === q.correct_option;
                  const isWrong = isSubmitted && isAnswered && !isCorrect;

                  let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';

                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600 text-white font-bold';
                    } else if (isWrong) {
                      btnStyle = 'bg-red-500 text-white font-bold';
                    } else {
                      btnStyle = 'bg-slate-200 text-slate-400';
                    }
                  } else if (isAnswered) {
                    btnStyle = 'bg-indigo-600 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={cn(
                        'relative h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center',
                        btnStyle,
                        isCurrent && 'ring-2 ring-indigo-600 ring-offset-2'
                      )}
                    >
                      {idx + 1}
                      {isFlagged && !isSubmitted && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-indigo-600" />
                  <span>Đã chọn đáp án</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300" />
                  <span>Chưa trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-500" />
                  <span>Đã đánh dấu xem lại</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Xác Nhận Nộp Bài Thi
                </h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc chắn muốn nộp bài thi để xem điểm và lời giải chi tiết?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Số câu đã làm:</span>
                <span className="font-bold text-indigo-600">{answeredCount} câu</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Số câu chưa trả lời:</span>
                  <span className="font-bold">{unansweredCount} câu</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowConfirmModal(false)}
              >
                Tiếp Tục Làm Bài
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitExam}
                className="font-bold shadow-sm"
              >
                Nộp Bài Ngay
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function MockExamRunnerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-semibold text-slate-500">
          Đang tải phòng thi thử...
        </div>
      }
    >
      <MockExamRunnerContent />
    </Suspense>
  );
}
