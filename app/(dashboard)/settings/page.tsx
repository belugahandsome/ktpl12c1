'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Target,
  School,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  getActiveUser,
  updateActiveProfile,
} from '@/lib/supabase/fallback-storage';
import { UserProfile } from '@/lib/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [school, setSchool] = useState('');
  const [targetScore, setTargetScore] = useState<number>(8.5);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    getActiveUser().then((u) => {
      if (u) {
        setUser(u);
        setDisplayName(u.display_name || '');
        setSchool(u.school || 'THPT Chuyên Hà Nội - Amsterdam');
        setTargetScore(u.target_score || 8.5);
      }
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setStatusMsg(null);

    try {
      const updated = await updateActiveProfile({
        display_name: displayName,
        school,
        target_score: targetScore,
      });
      setUser(updated);
      setStatusMsg({
        type: 'success',
        text: 'Cập nhật thông tin học viên thành công!',
      });
    } catch {
      setStatusMsg({
        type: 'error',
        text: 'Không thể lưu thông tin. Vui lòng thử lại.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setStatusMsg({
        type: 'error',
        text: 'Mật khẩu mới cần có ít nhất 6 ký tự.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMsg({
        type: 'error',
        text: 'Mật khẩu xác nhận không trùng khớp.',
      });
      return;
    }

    setPasswordSaving(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      }

      setNewPassword('');
      setConfirmPassword('');
      setStatusMsg({
        type: 'success',
        text: 'Đổi mật khẩu thành công!',
      });
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: 'error',
        text: error.message || 'Không thể đổi mật khẩu.',
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }
    document.cookie = 'eh_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'eh_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    localStorage.removeItem('eh_active_user');
    localStorage.removeItem('eh_user_progress');
    localStorage.removeItem('eh_quiz_attempts');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cài Đặt Tài Khoản (Settings)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quản lý thông tin cá nhân, mục tiêu điểm thi THPT và bảo mật tài khoản
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Hồ Sơ Học Viên
          </CardTitle>
          <CardDescription>
            Thông tin hiển thị trên bảng xếp hạng và báo cáo tiến độ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Họ và Tên
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Địa Chỉ Email
              </label>
              <Input
                type="email"
                value={user?.email || 'student@englishhub.edu.vn'}
                disabled
                icon={<Mail className="w-4 h-4" />}
                className="bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Email tài khoản được quản lý bởi Supabase Auth
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Trường THPT Đang Học
              </label>
              <Input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                icon={<School className="w-4 h-4" />}
                placeholder="Ví dụ: THPT Chu Văn An"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  Mục Tiêu Điểm Thi THPT Tiếng Anh
                </label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {targetScore.toFixed(1)} Điểm
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.5"
                value={targetScore}
                onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={profileSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu Thay Đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Security & Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            Đổi Mật Khẩu
          </CardTitle>
          <CardDescription>
            Đảm bảo mật khẩu của bạn có độ dài tối thiểu 6 ký tự
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật Khẩu Mới
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Xác Nhận Mật Khẩu Mới
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="outline"
                size="md"
                isLoading={passwordSaving}
                disabled={!newPassword}
              >
                Cập Nhật Mật Khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. Session & Logout */}
      <Card className="border-red-100">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-slate-900">
              Đăng Xuất Khỏi Tài Khoản
            </h4>
            <p className="text-xs text-slate-500">
              Kết thúc phiên đăng nhập trên thiết bị hiện tại
            </p>
          </div>

          <Button
            variant="destructive"
            size="md"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng Xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
