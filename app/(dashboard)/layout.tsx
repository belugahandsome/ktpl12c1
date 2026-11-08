'use client';

import React, { useState, Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar with Suspense boundary for usePathname */}
      <Suspense fallback={<div className="w-64 bg-white border-r border-slate-200" />}>
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
          <DashboardHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Đang tải nội dung...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
