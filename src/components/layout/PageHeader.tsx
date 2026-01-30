import * as React from 'react';

export function PageHeader({ title, subtitle, children, subtitleClassName }:{ title?: string; subtitle?: string; children?: React.ReactNode; subtitleClassName?: string }){
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {title && <h1 className="h-font text-md leading-7 text-[--color-neutral-900] font-bold">{title}</h1>}
        {subtitle && (
          <p suppressHydrationWarning className={`b-font text-sm leading-5 ${subtitleClassName ?? 'text-[--color-neutral-600]'}`}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
