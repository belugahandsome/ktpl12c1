'use client';

import React from 'react';
import { Sparkles, BookOpen, GraduationCap, Brain, Star, Flame, Award } from 'lucide-react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* ── 1. AMBIENT GLOWING GRADIENT ORBS ── */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-indigo-300/25 via-purple-300/20 to-transparent rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute top-1/4 -right-32 w-[550px] h-[550px] bg-gradient-to-bl from-violet-300/20 via-pink-300/15 to-transparent rounded-full blur-[110px] animate-float-delayed" />
      <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 via-cyan-300/15 to-transparent rounded-full blur-[120px] animate-float-slow" />

      {/* ── 2. SUBTLE MATRIX / GRID PATTERN ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px), radial-gradient(#7c3aed 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* ── 3. FLOATING EDUCATIONAL SHAPES (LOW OPACITY) ── */}
      {/* Top Left Floating Sparkle */}
      <div className="absolute top-24 left-[10%] opacity-20 text-indigo-500 animate-float-slow hidden md:block">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Top Right Floating Graduation Cap */}
      <div className="absolute top-36 right-[12%] opacity-15 text-purple-600 animate-float-delayed hidden md:block">
        <GraduationCap className="w-10 h-10" />
      </div>

      {/* Middle Left Floating Book */}
      <div className="absolute top-[52%] left-[6%] opacity-15 text-indigo-400 animate-float-delayed hidden lg:block">
        <BookOpen className="w-9 h-9" />
      </div>

      {/* Middle Right Floating Brain */}
      <div className="absolute top-[48%] right-[8%] opacity-15 text-cyan-500 animate-float-slow hidden lg:block">
        <Brain className="w-10 h-10" />
      </div>

      {/* Lower Left Floating Star */}
      <div className="absolute bottom-32 left-[14%] opacity-20 text-amber-400 animate-float-slow hidden md:block">
        <Star className="w-7 h-7 fill-amber-300" />
      </div>

      {/* Lower Right Floating Award */}
      <div className="absolute bottom-28 right-[15%] opacity-15 text-rose-500 animate-float-delayed hidden md:block">
        <Award className="w-9 h-9" />
      </div>

      {/* Center Floating Flame */}
      <div className="absolute top-[75%] left-[45%] opacity-15 text-amber-500 animate-float-slow hidden md:block">
        <Flame className="w-8 h-8 fill-amber-400" />
      </div>
    </div>
  );
}
