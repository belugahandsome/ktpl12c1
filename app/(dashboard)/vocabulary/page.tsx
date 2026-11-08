'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Search,
  Volume2,
  Star,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  BookMarked,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flashcard } from '@/components/vocabulary/flashcard';
import { VocabQuiz } from '@/components/vocabulary/vocab-quiz';
import { INITIAL_VOCABULARY } from '@/lib/data/initial-data';
import {
  getUserVocabularyStatus,
  saveUserVocabItem,
  incrementUserProgress,
} from '@/lib/supabase/fallback-storage';
import { Vocabulary, VocabTopic, VocabLearningStatus, UserVocabularyItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const TOPICS: (VocabTopic | 'All')[] = [
  'All',
  'Education',
  'Environment',
  'Technology',
  'Society',
  'Health',
  'Science',
  'Work and Career',
  'Culture',
  'Economy',
  'General Vocabulary',
];

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'flashcard' | 'quiz' | 'collection'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<VocabTopic | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [userVocabMap, setUserVocabMap] = useState<Record<string, UserVocabularyItem>>({});
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  useEffect(() => {
    getUserVocabularyStatus().then(setUserVocabMap);
  }, []);

  // Filtered vocabulary list
  const filteredVocab = useMemo(() => {
    return INITIAL_VOCABULARY.filter((item) => {
      // Search
      const matchSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition_en.toLowerCase().includes(searchQuery.toLowerCase());

      // Topic
      const matchTopic = selectedTopic === 'All' || item.topic === selectedTopic;

      // Difficulty
      const matchDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

      // Collection filter if on collection tab
      if (activeTab === 'collection') {
        const userStatus = userVocabMap[item.id];
        const isFav = userStatus?.is_favorite;
        const needsReview = userStatus?.status === 'review_needed';
        return matchSearch && matchTopic && matchDiff && (isFav || needsReview);
      }

      return matchSearch && matchTopic && matchDiff;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty, activeTab, userVocabMap]);

  const handleUpdateStatus = async (vocabId: string, status: VocabLearningStatus) => {
    const updated = await saveUserVocabItem(vocabId, { status });
    setUserVocabMap((prev) => ({ ...prev, [vocabId]: updated }));
    if (status === 'mastered') {
      await incrementUserProgress('word', 1);
    }
  };

  const handleToggleFavorite = async (vocabId: string) => {
    const current = userVocabMap[vocabId];
    const isFav = current ? !current.is_favorite : true;
    const updated = await saveUserVocabItem(vocabId, { is_favorite: isFav });
    setUserVocabMap((prev) => ({ ...prev, [vocabId]: updated }));
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Học Từ Vựng (Vocabulary)
            </h1>
            <Badge variant="indigo" size="sm">
              52+ Từ Trọng Tâm
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ghi nhớ từ vựng tiếng Anh theo chủ đề thi THPT Quốc Gia với Flashcard 3D và phát âm chuẩn bản ngữ
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('list')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeTab === 'list'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Danh Sách
          </button>
          <button
            onClick={() => {
              setActiveTab('flashcard');
              setFlashcardIndex(0);
            }}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeTab === 'flashcard'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Thẻ Flashcard
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeTab === 'quiz'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Kiểm Tra (Quiz)
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              activeTab === 'collection'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Sổ Tay Của Tôi
          </button>
        </div>
      </div>

      {/* FILTER BAR (Shown for List and Collection tabs) */}
      {(activeTab === 'list' || activeTab === 'collection') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm từ vựng, phiên âm hoặc nghĩa tiếng Việt..."
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">Tất cả độ khó</option>
                <option value="easy">Dễ (Easy)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="hard">Nâng cao (Hard)</option>
              </select>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                  selectedTopic === topic
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                )}
              >
                {topic === 'All' ? 'Tất Cả Chủ Đề' : topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1 & 4: LIST VIEW & MY COLLECTION */}
      {(activeTab === 'list' || activeTab === 'collection') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Hiển thị {filteredVocab.length} từ vựng</span>
            {activeTab === 'collection' && (
              <span className="text-amber-600">★ Các từ bạn đã lưu hoặc cần ôn lại</span>
            )}
          </div>

          {filteredVocab.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map((vocab) => {
                const userStatus = userVocabMap[vocab.id];
                const isFav = userStatus?.is_favorite || false;
                const status = userStatus?.status || 'learning';

                return (
                  <Card key={vocab.id} className="hover:border-indigo-200 hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                      {/* Top word header */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="indigo" size="sm">
                            {vocab.topic}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSpeak(vocab.word)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(vocab.id)}
                              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Lưu từ yêu thích"
                            >
                              <Star
                                className={cn(
                                  'w-4 h-4',
                                  isFav ? 'text-amber-500 fill-amber-400' : ''
                                )}
                              />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                            {vocab.word}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 mt-0.5">
                            <span>{vocab.ipa}</span>
                            <span className="text-slate-400 font-sans italic">
                              ({vocab.part_of_speech})
                            </span>
                          </div>
                        </div>

                        <div className="pt-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {vocab.meaning_vi}
                          </p>
                          <p className="text-xs text-slate-500 italic mt-0.5">
                            "{vocab.definition_en}"
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          <p className="text-slate-700">{vocab.example_en}</p>
                          <p className="text-slate-500 text-[11px]">{vocab.example_vi}</p>
                        </div>
                      </div>

                      {/* Bottom Status Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Badge
                          variant={
                            status === 'mastered'
                              ? 'emerald'
                              : status === 'review_needed'
                              ? 'rose'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {status === 'mastered'
                            ? 'Đã thuộc'
                            : status === 'review_needed'
                            ? 'Cần ôn lại'
                            : 'Đang học'}
                        </Badge>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                vocab.id,
                                status === 'mastered' ? 'learning' : 'mastered'
                              )
                            }
                            className={cn(
                              'text-xs font-semibold px-2 py-1 rounded-lg border transition-colors',
                              status === 'mastered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
                            )}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                            {status === 'mastered' ? 'Đã nắm chắc' : 'Đánh dấu thuộc'}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">Không tìm thấy từ vựng phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại chủ đề và mức độ khó.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 3D FLASHCARD CAROUSEL */}
      {activeTab === 'flashcard' && (
        <div className="py-4">
          {filteredVocab.length > 0 ? (
            <Flashcard
              vocabulary={filteredVocab[flashcardIndex]}
              currentIndex={flashcardIndex}
              totalCards={filteredVocab.length}
              status={userVocabMap[filteredVocab[flashcardIndex].id]?.status}
              isFavorite={userVocabMap[filteredVocab[flashcardIndex].id]?.is_favorite}
              onUpdateStatus={(st) =>
                handleUpdateStatus(filteredVocab[flashcardIndex].id, st)
              }
              onToggleFavorite={() =>
                handleToggleFavorite(filteredVocab[flashcardIndex].id)
              }
              onNext={() =>
                setFlashcardIndex((prev) =>
                  Math.min(filteredVocab.length - 1, prev + 1)
                )
              }
              onPrev={() => setFlashcardIndex((prev) => Math.max(0, prev - 1))}
            />
          ) : (
            <p className="text-center text-slate-500 py-12">
              Không có thẻ từ vựng nào trong bộ lọc hiện tại.
            </p>
          )}
        </div>
      )}

      {/* TAB 3: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="py-4">
          <VocabQuiz
            vocabList={filteredVocab.length >= 4 ? filteredVocab : INITIAL_VOCABULARY}
            onFinish={() => setActiveTab('list')}
          />
        </div>
      )}
    </div>
  );
}
