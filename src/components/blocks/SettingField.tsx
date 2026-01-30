"use client";
import * as React from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface SettingFieldProps {
  label: string;
  description?: string;
  type?: 'select' | 'number' | 'text' | 'slider';
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  inputClassName?: string;
  id?: string;
}

export function SettingField({
  label,
  description,
  type = 'text',
  value,
  onChange,
  options = [],
  min = 0,
  max = 100,
  step = 1,
  inputClassName,
  id,
}: SettingFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  if (type === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} className="text-xs font-medium text-[--color-neutral-900]">
          {label}
        </Label>
        {description && <p className="text-xs text-[--color-neutral-600]">{description}</p>}
        <div className="max-w-xs">
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger id={fieldId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (type === 'slider') {
    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium text-[--color-neutral-900]">
          {label} ({value})
        </Label>
        {description && <p className="text-xs text-[--color-neutral-600]">{description}</p>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number(value)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-3.5 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-neutral-900) 0%, var(--color-neutral-900) ${((Number(value) - min) / (max - min)) * 100}%, var(--color-neutral-300) ${((Number(value) - min) / (max - min)) * 100}%, var(--color-neutral-300) 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-xs font-medium text-[--color-neutral-900]">
        {label}
      </Label>
      {description && <p className="text-xs text-[--color-neutral-600]">{description}</p>}
      <Input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? e.target.value : e.target.value)}
        className={inputClassName || 'max-w-[120px]'}
      />
    </div>
  );
}
