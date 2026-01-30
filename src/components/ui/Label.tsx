import * as React from 'react';
import clsx from 'clsx';
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx('block text-sm mb-1 text-[--color-neutral-700] b-font', className)} {...props} />;
}
