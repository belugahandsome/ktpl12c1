'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Sparkles,
  Volume2,
  Video,
  Wand2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Film,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ShortLesson {
  id: string;
  title: string;
  subject: string;
  duration: string;
  views: string;
  gradient: string;
  tags: string[];
  script: string;
  summary: string[];
}

const SHORT_LESSONS: ShortLesson[] = [
  {
    id: 'lesson-1',
    title: 'Mẹo Ăn Trọn Điểm Đảo Ngữ "No Sooner" & "Hardly"',
    subject: 'Ngữ Pháp THPT',
    duration: '0:45',
    views: '18.4K',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    tags: ['Đảo ngữ', 'Điểm 8+', 'Ngữ pháp'],
    script:
      'Ghi nhớ quy tắc vàng: No sooner đi với THAN, Hardly đi với WHEN. Cả hai đều đảo Trợ động từ Had lên trước chủ ngữ. Ví dụ: No sooner HAD I arrived THAN it began to rain. Rất dễ nhớ đúng không các bạn!',
    summary: [
      'Cấu trúc 1: No sooner + HAD + S + V3/ed + THAN + S + V2/ed',
      'Cấu trúc 2: Hardly / Scarcely + HAD + S + V3/ed + WHEN + S + V2/ed',
      'Ý nghĩa: Vừa mới... thì...',
    ],
  },
  {
    id: 'lesson-2',
    title: '3 Bí Kíp Xử Lý Bài Đọc Điền Từ Khó Trong 60s',
    subject: 'Kỹ Năng Đọc Hiểu',
    duration: '0:55',
    views: '24.1K',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    tags: ['Đọc hiểu', 'Chiến thuật', 'Điểm 9+'],
    script:
      'Bước một: Xác định từ loại cần điền trước và sau chỗ trống. Bước hai: Chú ý giới từ đi kèm để nhận diện collocations. Bước ba: Dịch nghĩa đại thể để tránh bẫy ngữ cảnh!',
    summary: [
      'Bước 1: Soi kỹ từ loại (danh từ, động từ, tính từ hay trạng từ)',
      'Bước 2: Tìm giới từ đi kèm để bắt cụm Collocation',
      'Bước 3: Đọc 1 câu trước & 1 câu sau để nắm trọn ngữ cảnh',
    ],
  },
  {
    id: 'lesson-3',
    title: 'Top 5 Cụm Collocations "Ăn Điểm" Hay Gặp Nhất 2025',
    subject: 'Từ Vựng & Cụm Từ',
    duration: '0:50',
    views: '31.2K',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    tags: ['Collocations', 'Trọng tâm', 'Từ vựng'],
    script:
      'Lưu ngay 3 cụm vàng: Pay attention to - chú ý đến; Make a contribution to - đóng góp cho; và Take something into account - cân nhắc điều gì khi ra quyết định.',
    summary: [
      '1. Make a contribution to = Đóng góp cho',
      '2. Take something into account/consideration = Xem xét, tính đến',
      '3. Pay attention to = Chú ý lắng nghe',
    ],
  },
];

export function AiVideoShowcase() {
  const [selectedLesson, setSelectedLesson] = useState<ShortLesson>(SHORT_LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customTopic, setCustomTopic] = useState('Câu điều kiện loại 3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const handleTogglePlay = (lesson: ShortLesson) => {
    setSelectedLesson(lesson);

    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lesson.script);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenerateScript = () => {
    setIsGenerating(true);
    setGeneratedScript(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedScript(
        `🎬 [KỊCH BẢN VIDEO AI 45s: ${customTopic.toUpperCase()}]\n\n` +
          `[0:00 - 0:10 | Mở đầu cuốn hút]:\n"Bạn có biết đây là câu hỏi làm mất điểm oan của hơn 70% sĩ tử thi THPT Quốc Gia?"\n\n` +
          `[0:10 - 0:30 | Công thức cô đọng]:\n"Quy tắc vàng của ${customTopic}: Diễn tả một sự việc trái ngược với quá khứ. Công thức: If + S + had + V3/ed, S + would/could + have + V3/ed."\n\n` +
          `[0:30 - 0:45 | Ví dụ thực chiến & Chốt điểm]:\n"Ví dụ: If I had studied harder, I would have passed the exam. Nhớ bấm Lưu để xem lại trước ngày thi nhé!"`
      );
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 900);
  };

  const handleSpeakGenerated = () => {
    if (!generatedScript) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = generatedScript.replace(/\[.*?\]/g, '').replace(/🎬/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold mb-4 shadow-xs">
            <Video className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI Short Video & Audio Học Tiếng Anh</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Học qua <span className="gradient-text">Video Ngắn & Giọng Đọc AI</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Mỗi bài giảng chỉ từ 45 - 60 giây, cô đọng đúng 1 trọng điểm ngữ pháp hoặc từ vựng thi THPT.
            Bấm để nghe giảng trực tiếp hoặc dùng AI tạo kịch bản video riêng!
          </p>
        </div>

        {/* ── 3 SHORT VIDEO CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SHORT_LESSONS.map((lesson) => {
            const isCurrent = selectedLesson.id === lesson.id && isPlaying;

            return (
              <div
                key={lesson.id}
                className={cn(
                  'group relative bg-white rounded-3xl border transition-all duration-300 card-hover overflow-hidden flex flex-col',
                  isCurrent
                    ? 'border-indigo-500 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500/30'
                    : 'border-slate-200/80 hover:border-indigo-300 shadow-sm'
                )}
              >
                {/* Video Header / Mock Player */}
                <div
                  className={cn(
                    'relative h-48 p-5 text-white flex flex-col justify-between overflow-hidden bg-gradient-to-br',
                    lesson.gradient
                  )}
                >
                  {/* Subtle particle animation overlay */}
                  <div className="absolute inset-0 bg-black/15" />

                  {/* Top tags */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      {lesson.subject}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md">
                      ⏱ {lesson.duration}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="relative z-10 my-auto flex justify-center">
                    <button
                      onClick={() => handleTogglePlay(lesson)}
                      className={cn(
                        'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg',
                        isCurrent
                          ? 'bg-white text-indigo-600 scale-110 glow-indigo'
                          : 'bg-white/90 hover:bg-white text-slate-900 group-hover:scale-105'
                      )}
                      title={isCurrent ? 'Tạm dừng nghe' : 'Nghe AI Giảng bài'}
                    >
                      {isCurrent ? (
                        <Pause className="w-6 h-6 fill-indigo-600" />
                      ) : (
                        <Play className="w-6 h-6 ml-1 fill-slate-900" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Stats & Soundwave */}
                  <div className="relative z-10 flex items-center justify-between text-[11px]">
                    <span className="opacity-90">{lesson.views} lượt xem</span>
                    {isCurrent ? (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                        <span className="w-1 h-4 bg-white rounded-full animate-bounce delay-100" />
                        <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-200" />
                        <span className="text-xs font-bold ml-1">Đang phát audio...</span>
                      </div>
                    ) : (
                      <span className="opacity-80 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> Bấm nghe thử
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                      {lesson.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {lesson.summary.map((line, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {lesson.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleTogglePlay(lesson)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      {isCurrent ? 'Dừng' : 'Phát'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── INTERACTIVE AI SCRIPT & VIDEO GENERATOR TOOL ── */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Công cụ AI: Tự tạo kịch bản video tiếng Anh ngắn theo chủ đề</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Bạn muốn học nhanh chủ đề nào hôm nay?
              </h3>
              <p className="text-slate-300 text-sm">
                Chọn chủ đề bên dưới và AI sẽ tự động tạo kịch bản video ngắn 45 giây kèm giọng đọc AI thực chiến.
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Câu điều kiện loại 3',
                'Mệnh đề quan hệ rút gọn',
                'Đảo ngữ với Not only... but also',
                'Câu ước Wish / If only',
                'Cụm động từ Phrasal Verbs ăn điểm',
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setCustomTopic(topic)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    customTopic === topic
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Generate Action Button */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleGenerateScript}
                disabled={isGenerating}
                className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-[1.02]"
              >
                <Wand2 className="w-4 h-4" />
                {isGenerating ? 'AI đang biên soạn kịch bản...' : `Tạo Video AI: "${customTopic}"`}
              </button>
            </div>

            {/* AI Generated Result Box */}
            {generatedScript && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Đã tạo kịch bản thành công!
                  </span>
                  <button
                    onClick={handleSpeakGenerated}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe AI Đọc To Kịch Bản
                  </button>
                </div>

                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedScript}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
