'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, User, Target, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetScore, setTargetScore] = useState<number>(8.5);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              target_score: targetScore,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }

        // If email confirmation is required:
        if (data.user && !data.session) {
          setSuccessMsg(
            'Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác nhận tài khoản.'
          );
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Đăng ký tài khoản thành công! Đang vào Dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        // Fallback local persistence
        const newUser: UserProfile = {
          id: 'user-' + Date.now(),
          email,
          display_name: fullName,
          target_score: targetScore,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('eh_active_user', JSON.stringify(newUser));
        setSuccessMsg('Tài khoản đã tạo thành công! Đang chuyển hướng...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ENGLISH<span className="text-indigo-600"> HUB</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tạo tài khoản học tập
        </h2>
        <p className="text-sm text-slate-500">
          Gia nhập cộng đồng ôn thi THPT Quốc Gia cùng hàng nghìn sĩ tử
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-200/80 shadow-lg">
          <CardContent className="pt-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Họ và tên học sinh
                </label>
                <Input
                  type="text"
                  placeholder="Ví dụ: Trần Quốc Tuấn"
                  icon={<User className="w-4 h-4" />}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa chỉ Email
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mật khẩu bảo mật
                </label>
                <Input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    Mục tiêu điểm thi THPT Tiếng Anh
                  </span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {targetScore.toFixed(1)} Điểm
                  </span>
                </label>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.5"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5.0 (Tốt nghiệp)</span>
                  <span>8.0 (Đại học Top)</span>
                  <span>10.0 (Thủ khoa)</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full justify-center h-11 text-sm font-semibold mt-2"
              >
                Đăng Ký Tài Khoản
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
              Đã có tài khoản học tập?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
