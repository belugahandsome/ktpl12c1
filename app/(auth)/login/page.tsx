'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Email hoặc mật khẩu không chính xác.');
          setIsLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 800);
          return;
        }
      } else {
        // Fallback simulated login
        const demoUser: UserProfile = {
          id: 'user-' + Date.now(),
          email,
          display_name: email.split('@')[0],
          target_score: 8.5,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('eh_active_user', JSON.stringify(demoUser));
        setSuccessMsg('Đăng nhập thành công! Đang vào Dashboard...');
        setTimeout(() => {
          router.push(redirectPath);
        }, 600);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    const demoUser: UserProfile = {
      id: 'demo-student-id',
      email: 'student@englishhub.edu.vn',
      display_name: 'Nguyễn Văn Minh',
      target_score: 8.5,
      school: 'THPT Chuyên Hà Nội - Amsterdam',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('eh_active_user', JSON.stringify(demoUser));
    setSuccessMsg('Đang đăng nhập với tài khoản Học Sinh Mẫu...');
    setTimeout(() => {
      router.push(redirectPath);
    }, 500);
  };

  return (
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <Input
              type="email"
              placeholder="hocsinh@thpt.edu.vn"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center h-11 text-sm font-semibold"
          >
            Đăng Nhập
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">Hoặc</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleQuickDemoLogin}
          className="w-full justify-center border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
          Đăng nhập nhanh với Tài Khoản Demo
        </Button>

        <div className="text-center text-xs text-slate-600 pt-2">
          Chưa có tài khoản học tập?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
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
          Đăng nhập tài khoản
        </h2>
        <p className="text-sm text-slate-500">
          Tiếp tục lộ trình ôn luyện thi tốt nghiệp THPT của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Đang tải biểu mẫu...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
