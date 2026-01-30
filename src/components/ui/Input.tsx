"use client";
import * as React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'w-full h-9 px-3 rounded-md border bg-[--color-neutral-100] border-[--color-neutral-200] text-sm text-[--color-neutral-900]',
      'placeholder:text-[--color-neutral-500]',
      'outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-[--color-neutral-400] focus:border-[--color-neutral-400]',
      'focus:ring-0 focus-visible:ring-0',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
