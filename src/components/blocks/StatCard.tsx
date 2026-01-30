import * as React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className={clsx('card-base p-4 bg-white', className)}>
      <p className="b-font text-xs text-[--color-neutral-600] mb-2">{label}</p>
      <p className="b-font text-2xl font-semibold text-[--color-primary]">{value}</p>
    </div>
  );
}
