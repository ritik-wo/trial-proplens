import * as React from 'react';
import clsx from 'clsx';

export interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * ContentWrapper
 * A single, reusable wrapper that centers dashboard content within a max width,
 * applies consistent horizontal gutters and vertical rhythm, and avoids
 * duplicating layout styling in each page.
 */
export function ContentWrapper({ children, className, noPadding }: ContentWrapperProps) {
  const base = noPadding ? '' : 'container-max px-4 md:px-6 lg:px-8';
  const padded = noPadding ? '' : 'pt-6 lg:pt-8 pb-8 lg:pb-12 space-y-8';
  return (
    <div className={clsx(base, padded, className)}>
      {children}
    </div>
  );
}
