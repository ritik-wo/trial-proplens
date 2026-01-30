"use client";
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonStyles = cva(
  'btn-base h-9 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--color-primary]',
  {
    variants: {
      variant: {
        primary: 'bg-[--color-neutral-900] text-white hover:opacity-90',
        secondary: 'bg-[--color-neutral-100] text-[--color-neutral-900] hover:bg-[--color-neutral-200]',
        outline: 'border border-[--color-neutral-300] text-[--color-neutral-900] bg-white hover:bg-[--color-neutral-50]',
        ghost: 'bg-transparent hover:bg-[--color-neutral-100]',
        destructive: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: { 
        sm: 'h-8 px-2 text-xs', 
        md: 'h-9 px-3 text-sm', 
        lg: 'h-10 px-4 text-base',
        icon: 'h-9 w-9 p-0'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={clsx(buttonStyles({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';
