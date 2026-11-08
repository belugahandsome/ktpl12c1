'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Timer,
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_MOCK_EXAMS, INITIAL_EXAM_QUESTIONS } from '@/lib/data/initial-data';
import { getQuizAttempts } from '@/lib/supabase/fallback-storage';
import { QuizAttempt, ExamCategory } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';

const TOPIC_CATEGORIES: {
  category: ExamCategory;
  name: string;
  description: string;
  count: number;
}[] = [
  {
    category: 'pronunciation',
    name: '1. Phát Âm (Pronunciation)',
    description: 'Quy tắc phát âm đuôi -ed, -s/es và nguyên âm/phụ âm.',
    count: 12,
  },
  {
    category: 'word_stress',
    name: '2. Trọng Âm (Word Stress)',
    description: 'Trọng âm từ 2 và 3 âm tiết, quy tắc tiền tố và hậu tố.',
    count: 12,
  },
  {
    category: 'error_identification',
    name: '3. Tìm Lỗi Sai (Error Identification)',
    description: 'Hòa hợp thì, đại từ thay thế, trật tự từ và từ vựng gây nhầm lẫn.',
    count: 15,
  },
  {
    category: 'vocabulary',
    name: '4. Từ Vựng & Cụm Cố Định (Collocations)',
    description: 'Từ vựng theo chủ đề, thành ngữ (idioms) và collocations.',
    count: 20,
  },
  {
    category: 'grammar',
    name: '5. Ngữ Pháp Tổng Hợp (Grammar)',
    description: 'Câu điều kiện, câu bị động, câu hỏi đuôi và mệnh đề quan hệ.',
    count: 18,
  },
  {
    category: 'communication',
    name: '6. Giao Tiếp Tình Huống (Communication)',
    description: 'Hội thoại thường ngày, lời cảm ơn, xin lỗi, đồng ý và từ chối.',
    count: 10,
  },
  {
    category: 'sentence_transformation',
    name: '7. Biến Đổi & Kết Hợp Câu (Transformation)',
    description: 'Viết lại câu tương đương, đảo ngữ, câu điều kiện và câu ước.',
    count: 16,
  },
  {
    category: 'reading_comprehension',
    name: '8. Đọc Hiểu Văn Bản (Reading)',
    description: 'Ý chính đoạn văn, suy luận logic, từ đồng nghĩa trong ngữ cảnh.',
    count: 14,
  },
  {
    category: 'cloze_test',
    name: '9. Điền Từ Vào Đoạn Văn (Cloze Test)',
    description: 'Liên từ nối câu, đại từ quan hệ, từ hạn định và từ vựng.',
    count: 10,
  },
];

export default function ExamPracticePage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    getQuizAttempts().then(setAttempts);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Luyện Thi Tốt Nghiệp THPT Quốc Gia
          </h1>
          <Badge variant="indigo" size="sm">
            Chuẩn Cấu Trúc Bộ GD&ĐT
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hệ thống đề thi thử bám sát ma trận mới nhất, thi thử bấm giờ, chấm điểm tự động và lời giải chi tiết
        </p>
      </div>

      {/* SECTION 1: MOCK EXAMS (Phòng thi thử trực tuyến) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Đề Thi Thử Chuẩn Cấu Trúc (Mock Examinations)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Có đồng hồ bấm giờ & xếp hạng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_MOCK_EXAMS.map((exam) => (
            <Card
              key={exam.id}
              className="border-indigo-100 bg-gradient-to-br from-white to-slate-50/60 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="md">
                      {exam.code}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {exam.duration_minutes} Phút • {exam.total_questions} Câu
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exam.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">Phát âm & Trọng âm</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">Ngữ pháp & Từ vựng</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">Đọc hiểu & Điền từ</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Có đáp án & giải thích
                  </span>
                  <Link href={`/exam-practice/mock?id=${exam.id}`}>
                    <Button variant="primary" size="md" className="gap-2 shadow-sm font-semibold">
                      Vào Thi Thử <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2: TOPIC-BASED PRACTICE (Luyện theo từng dạng bài) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Luyện Tập Theo Dạng Bài (Topic Practice)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Không giới hạn thời gian • Học tức thì
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.category}
              href={`/exam-practice/topic?category=${cat.category}`}
              className="group block"
            >
              <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                        Chuyên đề ôn tập
                      </span>
                      <Badge variant="blue" size="sm">
                        {cat.count} câu
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Bắt Đầu Luyện <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-400 text-[11px]">Tự do luyện</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* SECTION 3: RECENT ATTEMPTS & HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Lịch Sử Thi & Luyện Tập
          </h2>
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {attempts.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tên Bài Thi / Luyện Tập</th>
                    <th className="py-3 px-4">Loại Hình</th>
                    <th className="py-3 px-4">Điểm Số (Thang 10)</th>
                    <th className="py-3 px-4">Tỷ Lệ Đúng</th>
                    <th className="py-3 px-4">Thời Gian</th>
                    <th className="py-3 px-4">Ngày Hoàn Thành</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                        {att.quiz_title}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={att.quiz_type === 'mock_exam' ? 'indigo' : 'blue'}
                          size="sm"
                        >
                          {att.quiz_type === 'mock_exam' ? 'Thi Thử' : 'Luyện Dạng'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-indigo-700 text-sm">
                        {att.score.toFixed(1)} / 10
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {att.correct_count}/{att.total_questions} ({att.percentage}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {formatTime(att.time_spent_seconds)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(att.completed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chưa có lịch sử làm bài nào. Hãy thử sức với một đề thi thử ngay trên!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
