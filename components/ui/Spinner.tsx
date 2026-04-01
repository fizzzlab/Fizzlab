'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
const borderMap = { sm: 'border-[1.5px]', md: 'border-2', lg: 'border-2' };

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-transparent border-t-[#EB721B] animate-spin',
        sizeMap[size],
        borderMap[size],
        className
      )}
      style={{ borderTopColor: '#EB721B', borderStyle: 'solid' }}
    />
  );
}
