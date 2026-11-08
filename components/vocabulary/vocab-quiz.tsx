'use client';

import React, { useState, useMemo } from 'react';
import { Vocabulary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { saveQuizAttempt } from '@/lib/supabase/fallback-storage';

export interface VocabQuizProps {
  vocabList: Vocabulary[];
  onFinish?: () => void;
}

interface Question {
  id: string;
  word: string;
  ipa: string;
  correctAnswer: string;
  options: string[];
}

export function VocabQuiz({ vocabList, onFinish }: VocabQuizProps) {
  const questions: Question[] = useMemo(() => {
    // Generate questions from vocab list
    const shuffled = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map((v, idx) => {
      // Pick 3 random wrong meanings
      const otherMeanings = vocabList
        .filter((item) => item.id !== v.id)
        .map((item) => item.meaning_vi);
      const randomWrong = otherMeanings
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [v.meaning_vi, ...randomWrong].sort(() => 0.5 - Math.random());

      return {
        id: `q-${idx}`,
        word: v.word,
        ipa: v.ipa,
        correctAnswer: v.meaning_vi,
        options,
      };
    });
  }, [vocabList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 70, spread: 60 });
      // Record quiz attempt
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 0 : 0);
      saveQuizAttempt({
        quiz_id: 'vocab-quiz-' + Date.now(),
        quiz_title: 'Kiểm Tra Từ Vựng Trắc Nghiệm (10 câu)',
        quiz_type: 'vocabulary',
        score: Math.round(((finalScore + (selectedOption === currentQ.correctAnswer ? 1 : 0)) / questions.length) * 10 * 10) / 10,
        percentage: Math.round(((finalScore + (selectedOption === currentQ.correctAnswer ? 1 : 0)) / questions.length) * 100),
        total_questions: questions.length,
        correct_count: finalScore + (selectedOption === currentQ.correctAnswer ? 1 : 0),
        incorrect_count: questions.length - (finalScore + (selectedOption === currentQ.correctAnswer ? 1 : 0)),
        time_spent_seconds: 90,
        answers: {},
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <Card className="max-w-lg mx-auto text-center p-8 border-indigo-100 shadow-xl">
        <CardContent className="space-y-6 pt-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Hoàn Thành Bài Kiểm Tra!
            </h3>
            <p className="text-sm text-slate-500">
              Bạn đã trả lời đúng {finalScore} / {questions.length} câu hỏi từ vựng
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100">
            <div className="text-4xl font-black text-indigo-700">
              {percentage}%
            </div>
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              {percentage >= 80 ? 'Xuất sắc! Vốn từ của bạn rất vững chắc.' : 'Luyện tập thêm để nâng cao vốn từ nhé!'}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="md" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Làm Lại Đề Này
            </Button>
            {onFinish && (
              <Button variant="primary" size="md" onClick={onFinish}>
                Quay Lại Danh Sách
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Progress & Score Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
        <Badge variant="indigo">Điểm: {score} câu đúng</Badge>
      </div>

      <Card className="border-slate-200/90 shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Chọn nghĩa tiếng Việt chính xác
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentQ.word}
            </h3>
            <p className="text-sm font-mono text-slate-400">{currentQ.ipa}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let buttonStyle = 'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                } else {
                  buttonStyle = 'border-slate-200 opacity-50 bg-white text-slate-600';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left text-sm transition-all duration-150 flex items-center justify-between',
                    buttonStyle
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-2 animate-in fade-in duration-200">
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                className="w-full justify-center h-11"
              >
                {currentIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
