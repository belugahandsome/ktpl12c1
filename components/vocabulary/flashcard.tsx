'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, RotateCw, CheckCircle2, Bookmark, Star, ArrowLeft, ArrowRight, Mic } from 'lucide-react';
import { Vocabulary, VocabLearningStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FlashcardProps {
  vocabulary: Vocabulary;
  status?: VocabLearningStatus;
  isFavorite?: boolean;
  onUpdateStatus: (status: VocabLearningStatus) => void;
  onToggleFavorite: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}

export function Flashcard({
  vocabulary,
  status = 'learning',
  isFavorite = false,
  onUpdateStatus,
  onToggleFavorite,
  onNext,
  onPrev,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocabulary.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Top Controls: Card Counter & Favorite */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
          Thẻ {currentIndex + 1} / {totalCards}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant={vocabulary.difficulty === 'hard' ? 'rose' : vocabulary.difficulty === 'medium' ? 'amber' : 'emerald'}>
            {vocabulary.difficulty.toUpperCase()}
          </Badge>
          <button
            onClick={onToggleFavorite}
            className={cn(
              'p-2 rounded-xl border transition-colors',
              isFavorite
                ? 'bg-amber-50 border-amber-300 text-amber-500'
                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
            )}
            title={isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào sổ tay'}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-amber-400')} />
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div
        onClick={handleFlip}
        className="w-full h-80 sm:h-96 cursor-pointer select-none perspective-1000"
      >
        <div
          className={cn(
            'relative w-full h-full duration-500 transform-style-preserve-3d transition-transform rounded-3xl shadow-lg border border-slate-200/90',
            isFlipped ? 'rotate-y-180' : ''
          )}
        >
          {/* FRONT SIDE (English word, IPA, Audio, Topic) */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {vocabulary.topic}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/speaking"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors shadow-xs"
                  title="Luyện nói & Chấm điểm từ này với AI"
                >
                  <Mic className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleSpeak}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-center transition-colors"
                  title="Phát âm tiếng Anh"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center space-y-3 my-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {vocabulary.word}
              </h2>
              <p className="text-base sm:text-lg font-mono text-indigo-600 font-medium">
                {vocabulary.ipa}
              </p>
              <span className="inline-block text-xs font-semibold text-slate-400 italic">
                ({vocabulary.part_of_speech})
              </span>
            </div>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              Nhấn vào thẻ để xem nghĩa Tiếng Việt
            </div>
          </div>

          {/* BACK SIDE (Vietnamese meaning, Definition, Examples, Synonyms) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-b from-indigo-50/50 via-white to-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {vocabulary.word} • {vocabulary.part_of_speech}
              </span>
              <button
                onClick={handleSpeak}
                className="p-1 text-slate-400 hover:text-indigo-600"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-auto py-2">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Nghĩa Tiếng Việt
                </p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700 mt-0.5">
                  {vocabulary.meaning_vi}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Định nghĩa tiếng Anh
                </p>
                <p className="text-xs sm:text-sm text-slate-700 italic mt-0.5">
                  "{vocabulary.definition_en}"
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <p className="font-semibold text-slate-800">
                  {vocabulary.example_en}
                </p>
                <p className="text-slate-500">
                  {vocabulary.example_vi}
                </p>
              </div>

              {vocabulary.synonyms.length > 0 && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-500">Đồng nghĩa: </span>
                  <span className="text-indigo-600 font-medium">
                    {vocabulary.synonyms.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100">
              <RotateCw className="w-3.5 h-3.5" />
              Nhấn để lật lại mặt trước
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Status Marking */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant={status === 'review_needed' ? 'destructive' : 'outline'}
          size="md"
          onClick={() => onUpdateStatus('review_needed')}
          className="flex-1 max-w-[200px]"
        >
          Cần Ôn Lại
        </Button>
        <Button
          variant={status === 'mastered' ? 'success' : 'primary'}
          size="md"
          onClick={() => onUpdateStatus('mastered')}
          className="flex-1 max-w-[200px]"
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Đã Thuộc Từ Này
        </Button>
      </div>

      {/* Navigation Buttons: Prev & Next */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setIsFlipped(false);
            onPrev();
          }}
          disabled={currentIndex === 0}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Từ Trước
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setIsFlipped(false);
            onNext();
          }}
          disabled={currentIndex === totalCards - 1}
          className="gap-1.5"
        >
          Từ Tiếp Theo <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
