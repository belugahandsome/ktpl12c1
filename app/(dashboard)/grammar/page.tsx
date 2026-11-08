'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { INITIAL_GRAMMAR_LESSONS } from '@/lib/data/initial-data';

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = INITIAL_GRAMMAR_LESSONS.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ngữ Pháp Trọng Điểm (Grammar)
            </h1>
            <Badge variant="blue" size="sm">
              10 Chuyên Đề Cốt Lõi
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng hợp toàn bộ kiến thức ngữ pháp xuất hiện trong đề thi Tốt nghiệp THPT với công thức, ví dụ và bài tập thực hành
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Tìm chuyên đề ngữ pháp..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grammar Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredLessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/grammar/${lesson.slug}`}
            className="group block"
          >
            <Card className="h-full hover:border-indigo-300 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="blue" size="sm">
                      Chuyên đề {lesson.order_index}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400">
                      {lesson.exercises.length} Bài Tập Thực Hành
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {lesson.title_vi}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {lesson.summary}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-700 truncate">
                    <code>{lesson.formula}</code>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Vào Học Chuyên Đề Này <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    Lý thuyết & Bài tập
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
