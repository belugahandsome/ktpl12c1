# 🎓 ENGLISH HUB – Nền Tảng Học Tiếng Anh & Luyện Thi Tốt Nghiệp THPT Quốc Gia

**ENGLISH HUB** là một nền tảng học tiếng Anh trực tuyến toàn diện, hiện đại, được thiết kế chuyên sâu dành cho học sinh THPT Việt Nam ôn luyện và bứt phá điểm 8+ và 9+ trong kỳ thi Tốt nghiệp THPT Quốc Gia môn Tiếng Anh.

---

## 🌟 Tính Năng Nổi Bật

1. **Học Từ Vựng Tương Tác (Vocabulary)**:
   - Hơn 52+ từ vựng trọng tâm phân bổ theo 10 chủ đề thi: Giáo dục, Môi trường, Công nghệ, Xã hội, Sức khỏe, Khoa học, Nghề nghiệp, Văn hóa, Kinh tế, Từ vựng chung.
   - Thẻ lật **Flashcard 3D** chân thực.
   - **Tích hợp phát âm bản ngữ (Text-To-Speech)** thông qua Web Speech API.
   - Chế độ **Trắc nghiệm từ vựng (Vocab Quiz)** chấm điểm tức thì.
   - Sổ tay cá nhân lưu từ vựng yêu thích và từ cần ôn lại.

2. **Chuyên Đề Ngữ Pháp Cốt Lõi (Grammar)**:
   - 10+ chuyên đề ngữ pháp then chốt: 12 Thì, Câu bị động, Câu điều kiện & đảo ngữ điều kiện, Mệnh đề quan hệ rút gọn, Câu tường thuật, So sánh kép, Động từ khuyết thiếu...
   - Công thức tổng quát, phân tích song ngữ Anh - Việt.
   - **Phần "Bẫy thường gặp của học sinh"**: Chỉ ra các lỗi sai kinh điển học sinh hay mất điểm và cách khắc phục.
   - Bài tập trắc nghiệm củng cố ngay cuối bài học có lời giải chi tiết.

3. **Kho Cấu Trúc Câu Điểm 8+ & 9+ (Sentence Structures)**:
   - Đảo ngữ với trạng từ phủ định, Câu chẻ (Cleft sentences), Thức giả định (Subjunctive), So sánh kép "The more... the more...", No sooner... than, Hardly... when...
   - Tìm kiếm và lọc theo danh mục nhanh chóng.
   - Bài tập thực hành kiểm tra câu trả lời ngay lập tức.

4. **Phòng Luyện Thi Chuẩn Cấu Trúc Bộ GD&ĐT (Exam Practice)**:
   - **Thi thử có bấm giờ (Mock Examination)**: Đồng hồ đếm ngược, ma trận bảng câu hỏi (1 đến 50), đánh dấu câu hỏi cần xem lại (Flag for review), nộp bài thi kèm hộp thoại xác nhận.
   - **Luyện theo chuyên đề (Topic Practice)**: Luyện tự do từng dạng bài (Phát âm, Trọng âm, Tìm lỗi sai, Ngữ pháp, Giao tiếp, Đọc hiểu văn bản, Điền từ đoạn văn) theo từng độ khó.
   - Chấm điểm tự động trên **thang điểm 10**, thống kê câu đúng, câu sai, tỷ lệ phần trăm và **lời giải thích chi tiết bằng Tiếng Việt cho từng câu hỏi**.
   - Phân tích lỗ hổng kiến thức và đưa ra khuyến nghị ôn tập tương ứng.

5. **Theo Dõi Tiến Độ Học Tập (Analytics & Streak)**:
   - Biểu đồ cột SVG hiển thị hoạt động học tập 7 ngày qua.
   - Chuỗi ngày rèn luyện liên tục (**Streak Days**).
   - Thanh tiến độ hoàn thành các học phần và dự báo điểm thi THPT.

6. **Bảo Mật & Quản Lý Tài Khoản (Supabase Auth & Settings)**:
   - Đăng ký, đăng nhập bằng Email/Password qua Supabase Auth.
   - Tự động tạo hồ sơ học viên (`profiles`) và bảng theo dõi tiến độ (`user_progress`).
   - Cài đặt mục tiêu điểm thi (Target Score: 8.0, 8.5, 9.0...).
   - Hỗ trợ chế độ Demo linh hoạt giúp kiểm thử đầy đủ tính năng ngay cả khi chưa kết nối Supabase.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành Phần | Công Nghệ |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Reusable Component Architecture (shadcn/ui style) |
| **Icons** | Lucide React |
| **Authentication** | Supabase Auth (`@supabase/ssr`) |
| **Database** | Supabase PostgreSQL + Row Level Security (RLS) |
| **Animations** | CSS 3D Transforms, Canvas Confetti |
| **Deployment** | Sẵn sàng triển khai 1-click trên Vercel |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt Dependencies

Tại thư mục gốc của dự án:

```bash
npm install
```

### 2. Thiết lập Biến Môi Trường (Environment Variables)

Sao chép tệp `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Điền thông tin dự án Supabase của bạn vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Lưu ý**: Nếu bạn chưa có tài khoản Supabase ngay lúc này, ứng dụng đã tích hợp sẵn cơ chế **Local Fallback Storage** và nút **"Đăng nhập nhanh với Tài Khoản Demo"**, cho phép bạn trải nghiệm trọn vẹn mọi tính năng tương tác, flashcard, thi thử và lưu kết quả trên trình duyệt!

### 3. Khởi Chạy Server Phát Triển

```bash
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Hướng Dẫn Thiết Lập Supabase Database

Để kết nối với cơ sở dữ liệu Supabase thực tế:

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com) và tạo một Project mới.
2. Điều hướng tới mục **SQL Editor**.
3. Mở tệp `supabase/schema.sql` trong dự án, dán vào SQL Editor và nhấn **Run** để khởi tạo:
   - 9 bảng dữ liệu: `profiles`, `vocabulary`, `user_vocabulary`, `grammar_lessons`, `sentence_structures`, `questions`, `quizzes`, `quiz_attempts`, `user_progress`.
   - Các chính sách bảo mật dữ liệu Row Level Security (RLS).
   - Trigger tự động tạo profile khi người dùng đăng ký mới.
4. Mở tệp `supabase/seed.sql`, dán vào SQL Editor và nhấn **Run** để nạp sẵn dữ liệu giáo dục ban đầu.
5. Vào **Project Settings -> API** để lấy `URL` và `anon/public key`, dán vào `.env.local`.

---

## 📦 Kiểm Tra Build & Triển Khai Lên Vercel

### Kiểm tra build nội bộ:

```bash
npm run build
```

### Triển khai lên Vercel:

1. Đẩy mã nguồn lên kho lưu trữ GitHub / GitLab.
2. Truy cập [Vercel Dashboard](https://vercel.com) và chọn **Import Project**.
3. Cấu hình biến môi trường trong phần **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Nhấn **Deploy**. Ứng dụng sẽ tự động được biên dịch và phát hành trực tuyến.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
english-hub/
├── app/
│   ├── (auth)/                  # Phân hệ Xác thực người dùng
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/             # Phân hệ Dashboard & Học tập chính
│   │   ├── dashboard/
│   │   ├── vocabulary/
│   │   ├── grammar/
│   │   │   └── [slug]/
│   │   ├── sentence-structures/
│   │   ├── exam-practice/
│   │   │   ├── mock/
│   │   │   └── topic/
│   │   ├── progress/
│   │   └── settings/
│   ├── auth/callback/           # Supabase Auth Exchange Route
│   ├── globals.css              # Theme CSS, 3D Flashcard & Design System
│   ├── layout.tsx
│   └── page.tsx                 # Trang chủ Landing Page
├── components/
│   ├── ui/                      # Reusable UI Atoms (Button, Input, Card, Badge, ProgressBar)
│   ├── layout/                  # Navbar, Footer, Sidebar, Header
│   ├── vocabulary/              # Flashcard 3D, Vocab Quiz
│   └── exam/                    # Exam Runners & Question Matrix
├── lib/
│   ├── data/initial-data.ts     # Bộ dữ liệu mẫu 52 từ vựng, 10 ngữ pháp, 16 cấu trúc câu & đề thi
│   ├── supabase/                # Supabase client, server, middleware, fallback storage
│   ├── types.ts                 # Định nghĩa TypeScript Types toàn hệ thống
│   └── utils.ts                 # Helper functions
├── supabase/
│   ├── schema.sql               # Toàn bộ DDL Schema & RLS Policies
│   └── seed.sql                 # SQL nạp dữ liệu giáo dục
└── middleware.ts                # Route Guard & Supabase Session Refresh
```
