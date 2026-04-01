import React from 'react';
import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-surface-200 dark:bg-surface-800',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
