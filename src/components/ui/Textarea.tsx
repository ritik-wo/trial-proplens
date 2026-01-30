"use client";
import * as React from 'react';
import clsx from 'clsx';
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      'w-full min-h-24 p-3 rounded-md border text-sm',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--color-neutral-400]',
      'focus:border-[--color-neutral-400] focus:ring-0 focus-visible:ring-0',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
