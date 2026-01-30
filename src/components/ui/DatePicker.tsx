"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Input } from "./Input";
import clsx from "clsx";

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export function DatePicker({ id, value, onChange, className }: DatePickerProps) {
  return (
    <div className={clsx("relative max-w-xs", className)}>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-neutral-500] pointer-events-none" />
    </div>
  );
}
