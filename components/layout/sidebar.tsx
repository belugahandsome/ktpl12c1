'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  BookMarked,
  Layers,
  GraduationCap,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Home,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Từ Vựng (Vocab)',
    href: '/vocabulary',
    icon: Brain,
  },
  {
    name: 'Ngữ Pháp (Grammar)',
    href: '/grammar',
    icon: BookMarked,
  },
  {
    name: 'Cấu Trúc Câu',
    href: '/sentence-structures',
    icon: Layers,
  },
  {
    name: 'Luyện Thi THPT',
    href: '/exam-practice',
    icon: GraduationCap,
  },
  {
    name: 'Tiến Độ Học Tập',
    href: '/progress',
    icon: TrendingUp,
  },
  {
    name: 'Cài Đặt Tài Khoản',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Về Trang Chủ',
    href: '/',
    icon: Home,
  },
];

function NavLinksList({
  isCollapsed,
  onNavigate,
}: {
  isCollapsed: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-base font-bold transition-all duration-150 group',
              isActive
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/60 text-indigo-700 shadow-xs border border-indigo-100'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <Icon
              className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-400 group-hover:text-slate-600'
              )}
            />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                ENGLISH<span className="text-indigo-600"> HUB</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-1">
                Ôn Thi THPT
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links with Suspense */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <Suspense fallback={<div className="space-y-2 p-2" />}>
          <NavLinksList
            isCollapsed={isCollapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        </Suspense>
      </nav>

      {/* Collapse Toggle Footer (Desktop only) */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-slate-100">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 w-full text-xs font-semibold"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Thu gọn menu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:block shrink-0 transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className={cn('fixed top-0 bottom-0 z-30 transition-all duration-200', isCollapsed ? 'w-20' : 'w-64')}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
