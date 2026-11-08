import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'indigo' | 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'indigo',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 border leading-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
