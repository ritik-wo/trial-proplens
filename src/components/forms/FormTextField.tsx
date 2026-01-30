"use client";
import { Controller, type Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export function FormTextField<T extends FieldValues>({ control, name, label, placeholder, description, type, onValueChange, showErrorSpace = true, inputClassName }:{ control: Control<T>; name: Path<T>; label?: string; placeholder?: string; description?: string; type?: string; onValueChange?: (val: string) => void; showErrorSpace?: boolean; inputClassName?: string; }){
  return (
    <div>
      {label && <Label htmlFor={name as string}>{label}</Label>}
      <Controller control={control} name={name} render={({ field, fieldState }) => (
        <>
          <Input
            id={name as string}
            type={type || 'text'}
            placeholder={placeholder}
            aria-invalid={!!fieldState.error}
            value={field.value as any}
            onChange={(e) => {
              field.onChange(e);
              onValueChange?.(e.target.value);
            }}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            className={inputClassName}
          />
          {showErrorSpace && (
            <div className="text-xs text-red-600 mt-1 h-4">{fieldState.error?.message as string}</div>
          )}
          {description && <p className="text-xs text-[--color-neutral-600]">{description}</p>}
        </>
      )} />
    </div>
  );
}
