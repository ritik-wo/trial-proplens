"use client";
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Button } from '../ui/Button';
import { FormTextField } from './FormTextField';
import { useToast } from '../providers/UiProviders';

export function FormUrlField({
  defaultValue,
  onSave,
  name = 'url',
  variant = 'default',
  saveOnBlur = variant === 'simple',
  onValueChange,
  showSaveButton = true,
  formId,
  placeholder = 'https://sharepoint.com/...',
  inputClassName,
  showErrorSpace,
}:{ defaultValue?: string; onSave?: (url:string)=>void; name?: string; variant?: 'default' | 'simple'; saveOnBlur?: boolean; onValueChange?: (url:string)=>void; showSaveButton?: boolean; formId?: string; placeholder?: string; inputClassName?: string; showErrorSpace?: boolean }){
  const show = useToast();
  const { control, handleSubmit, formState } = useForm<{ [k:string]: string }>({
    resolver: joiResolver(Joi.object({ [name]: Joi.string().uri({ scheme: [/https?/] }).required() })),
    defaultValues: { [name]: defaultValue || '' }
  });
  const submit = handleSubmit(v => { onSave?.(v[name]); show('Saved'); });
  if (variant === 'simple') {
    return (
      <form id={formId} onSubmit={submit} className="w-full">
        <FormTextField
          control={control}
          name={name as any}
          label={'' as any}
          placeholder={placeholder}
          type="url"
          onValueChange={(v)=> onValueChange?.(v)}
          inputClassName={inputClassName}
          showErrorSpace={showErrorSpace}
        />
        {saveOnBlur && (
          <input type="submit" hidden />
        )}
      </form>
    );
  }
  return (
    <form id={formId} onSubmit={submit} className="flex items-end gap-2">
      <div className="flex-1">
        <FormTextField control={control} name={name as any} label="URL" placeholder={placeholder} type="url" onValueChange={(v)=> onValueChange?.(v)} inputClassName={inputClassName} showErrorSpace={showErrorSpace} />
      </div>
      {showSaveButton && (
        <Button type="submit" disabled={!formState.isDirty || !formState.isValid}>Save</Button>
      )}
    </form>
  );
}
