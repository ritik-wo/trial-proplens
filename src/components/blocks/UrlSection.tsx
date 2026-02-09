"use client";
import * as React from 'react';
import { SectionCard } from '@/components/blocks/SectionCard';
import { FormUrlField } from '@/components/forms/FormUrlField';
import { Button } from '@/components/ui/Button';
import { LinkIcon, UploadIcon, openUrlIcon as OpenUrlIcon } from '@/assets/icon-svg';

export interface UrlSectionProps {
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  onSave?: (url: string) => void;
  currentLabel?: string;
  className?: string;
  titleClassName?: string;
}

export function UrlSection({
  title,
  description,
  defaultValue,
  placeholder = "https://...",
  onSave,
  currentLabel = 'Current Website:',
  className,
  titleClassName,
}: UrlSectionProps) {
  const [live, setLive] = React.useState(defaultValue || '');
  const formId = 'url-section-form';
  const urlColor = 'var(--color-primary)';

  return (
    <SectionCard
      title={title}
      description={description}
      compactHeader
      titleClassName={titleClassName}
      titleIcon={
        <div
          className="w-8 h-8 rounded-md grid place-items-center"
          style={{
            backgroundColor: 'color-mix(in oklch, var(--color-primary) 18%, white)',
          }}
        >
          <LinkIcon className="w-4 h-4 text-[--color-primary]" aria-hidden="true" />
        </div>
      }
    >
      <div className={className}>
        <div className="w-full md:w-4/5 lg:w-3/4">
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div className="w-full sm:flex-1 md:w-[62%]">
              <FormUrlField
                formId={formId}
                defaultValue={defaultValue}
                variant="simple"
                placeholder={placeholder}
                onValueChange={(v)=> setLive(v)}
                onSave={(v)=> onSave?.(v)}
                showSaveButton={false}
                showErrorSpace={false}
                inputClassName="bg-[--color-neutral-100] text-[--color-neutral-800] text-xs"
              />
            </div>
            <a href={live || defaultValue || '#'} target="_blank" rel="noreferrer" aria-label="Open current URL in a new tab" className="shrink-0 mt-2 sm:mt-0">
              <Button type="button" variant="outline" size="sm" className="gap-1 px-3.5 py-0 h-7 leading-none">
                <OpenUrlIcon className="w-4 h-4 text-[--color-primary]" aria-hidden="true" />
                Open
              </Button>
            </a>
            <Button form={formId} type="submit" size="sm" className="shrink-0 mt-2 sm:mt-0 gap-1 px-3.5 py-0 h-7 leading-none">
              <UploadIcon className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-[--color-neutral-100] text-[--color-neutral-800] px-3 py-3 text-sm">
          <div className="flex items-start flex-wrap gap-2">
            <LinkIcon className="w-4 h-4 text-[--color-primary]" aria-hidden="true" />
            <div className="min-w-0">
              <span className="font-medium">{currentLabel}</span>{' '}
              <a href={live || defaultValue || '#'} target="_blank" rel="noreferrer" className="underline break-all text-[--color-primary]">{live || defaultValue}</a>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}