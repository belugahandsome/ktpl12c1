import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Award,
  Layers,
  Timer,
  BookMarked,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2">
            <Badge variant="indigo" size="md" className="py-1 px-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Chuyên biệt cho Kì thi Tốt Nghiệp THPT Quốc Gia</span>
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Learn English Smarter, <br className="hidden sm:block" />
            <span className="text-indigo-600">Not Harder.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Nền tảng học Tiếng Anh toàn diện kết hợp Flashcard thông minh, hệ thống ngữ pháp cô đọng, kho cấu trúc câu ăn điểm 8+ 9+, và đề thi thử chuẩn cấu trúc Bộ GD&ĐT có đáp án giải thích chi tiết.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 shadow-md hover:shadow-indigo-200">
                Bắt Đầu Học Miễn Phí
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12">
                Trải Nghiệm Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80 mt-12">
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">1,200+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Từ Vựng Trọng Tâm</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">12 Chuyên Đề</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Ngữ Pháp Điểm Liệt & 8+</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">100% Giải Thích</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Song Ngữ Chi Tiết</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">Chuẩn BGD</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Format Đề Thi Mới Nhất</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CORE FEATURE CARDS */}
      <section id="features" className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="blue" size="md">
              Hệ Thống 4 Trụ Cột Học Tập
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Tất cả những gì bạn cần để bứt phá điểm số môn Tiếng Anh
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Được thiết kế khoa học, tối ưu thời gian ôn tập và xây dựng phản xạ giải đề thi nhanh chóng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Vocabulary */}
            <Card className="hover:border-indigo-300 hover:shadow-lg transition-all group">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900">1. Học Từ Vựng Flashcard</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Học từ vựng theo 10 chủ đề thi THPT, phát âm IPA, ví dụ thực tế và lật thẻ Flashcard ghi nhớ dài hạn.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/vocabulary"
                    className="inline-flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform"
                  >
                    Khám phá từ vựng <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: Grammar Practice */}
            <Card className="hover:border-indigo-300 hover:shadow-lg transition-all group">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900">2. Ngữ Pháp Trọng Điểm</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    12 chuyên đề ngữ pháp then chốt từ 12 thì đến câu bị động, điều kiện, mệnh đề rút gọn có bài tập thực hành tức thì.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/grammar"
                    className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform"
                  >
                    Ôn luyện ngữ pháp <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: Sentence Structures */}
            <Card className="hover:border-indigo-300 hover:shadow-lg transition-all group">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900">3. Cấu Trúc Câu Điểm Cao</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Kho mẫu câu đảo ngữ, câu chẻ, thức giả định, so sánh kép... giúp phân loại học sinh và tối đa hóa điểm viết lại câu.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/sentence-structures"
                    className="inline-flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform"
                  >
                    Xem cấu trúc câu <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Graduation Exam Prep */}
            <Card className="hover:border-indigo-300 hover:shadow-lg transition-all group">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Timer className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900">4. Luyện Thi THPT Quốc Gia</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Làm bài thi thử có đồng hồ đếm ngược, phân loại theo dạng bài và nhận phân tích sai sót kèm điểm số trên thang 10.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/exam-practice"
                    className="inline-flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform"
                  >
                    Vào phòng thi thử <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="indigo" size="md">
                Tại sao chọn ENGLISH HUB?
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Học đúng trọng tâm, giải đúng dạng bài, bứt phá ngưỡng điểm mong ước.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Thay vì học lan man những giáo trình học thuật không sát đề, ENGLISH HUB tập trung 100% vào ma trận và dạng bài xuất hiện trực tiếp trong bài thi tốt nghiệp THPT Quốc gia môn Tiếng Anh.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Lời giải chi tiết bằng Tiếng Việt</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Không chỉ đưa ra đáp án A, B, C, D, mỗi câu hỏi đều giải thích vì sao chọn và chỉ ra bẫy thường gặp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Ghi nhớ từ vựng với Flashcard & Spaced Repetition</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lật thẻ tương tác, đánh dấu từ đã thuộc hoặc cần ôn lại, lưu danh sách yêu thích dễ dàng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Theo dõi tiến độ học tập và streak cá nhân</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Biểu đồ thống kê số từ đã học, bài thi đã làm và chuỗi ngày rèn luyện liên tục để duy trì động lực.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-7">
                    Đăng Ký Tài Khoản Ngay
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Preview Card */}
            <div className="relative">
              <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      THPT
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Mô phỏng thi thử THPT Quốc Gia</div>
                      <div className="text-xs text-slate-500">Mã đề 101 • 50 phút • Chuẩn BGD</div>
                    </div>
                  </div>
                  <Badge variant="rose" size="sm">
                    Live Timer: 42:15
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    Câu hỏi số 1: Trọng âm
                  </span>
                  <p className="text-sm font-medium text-slate-800">
                    Mark the letter A, B, C, or D to indicate the word that differs from the other three in the position of primary stress:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700">A. preserve</div>
                    <div className="p-2.5 rounded-xl border-2 border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold">B. follow</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700">C. inspire</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700">D. attract</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Chính xác! Trọng âm rơi vào âm tiết thứ 1
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    "follow" trọng âm 1 (/ˈfɒl.əʊ/), các từ còn lại "preserve", "inspire", "attract" trọng âm rơi vào âm tiết 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="about" className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sẵn sàng chinh phục điểm 9+ môn Tiếng Anh?
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto">
            Hơn hàng nghìn học sinh lớp 12 đã bắt đầu ôn luyện mỗi ngày cùng ENGLISH HUB. Hãy bắt đầu lộ trình của bạn ngay hôm nay!
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-slate-100 shadow-lg text-base h-12 px-8 font-bold"
              >
                Tạo Tài Khoản Học Ngay
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
