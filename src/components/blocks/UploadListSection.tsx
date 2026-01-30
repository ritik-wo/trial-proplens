"use client";
import * as React from 'react';
import { SectionCard } from '@/components/blocks/SectionCard';
import { ListRow } from '@/components/blocks/ListRow';

export interface UploadListItem {
  id: string;
  title: string;
  meta?: string;
}

export interface UploadListSectionProps {
  title: string;
  description?: string;
  titleIcon?: React.ReactNode;
  uploadSlot?: React.ReactNode;
  items: UploadListItem[];
  countLabel?: string;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
  rowIcon?: React.ReactNode;
}

export function UploadListSection({
  title,
  description,
  titleIcon,
  uploadSlot,
  items,
  countLabel,
  onView,
  onDelete,
  className,
  rowIcon,
}: UploadListSectionProps) {
  const noun = countLabel ?? 'items';
  const countText = items.length === 1
    ? (noun.endsWith('s') ? noun.slice(0, -1) : noun)
    : noun;
  return (
    <SectionCard title={title} description={description} titleIcon={titleIcon} compactHeader className={className}>
      {uploadSlot}

      <div className="flex items-center justify-between mb-2">
        <h3 className="b-font text-sm font-semibold text-[--color-neutral-800]">Current {countLabel ?? 'Items'}</h3>
        <div className="text-sm text-[--color-neutral-600]">{items.length} {countText}</div>
      </div>

      <div className="mt-3 space-y-3">
        {items.map((it) => (
          <ListRow
            key={it.id}
            icon={rowIcon}
            title={it.title}
            meta={it.meta}
            onView={onView ? () => onView(it.id) : undefined}
            onDelete={onDelete ? () => onDelete(it.id) : undefined}
          />
        ))}
      </div>
    </SectionCard>
  );
}
