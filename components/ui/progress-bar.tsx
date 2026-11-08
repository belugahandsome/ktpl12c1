import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  barColor?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barColor = 'bg-indigo-600',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
          <span>Tiến độ</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
