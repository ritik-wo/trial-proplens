"use client";
import * as React from 'react';
import { SectionCard } from '@/components/blocks/SectionCard';
import { FileUploadCustom } from '@/components/forms/CustomFileUploadInput';
import { ListRow } from '@/components/blocks/ListRow';
import { FileTextIcon } from '@/assets/icon-svg';
import { useToast } from '@/components/providers/UiProviders';

export interface DocItem { id: string; name: string; uploadedAt: string; sizeMB: number; }

export interface DocumentSectionProps {
  title: string;
  description: string;
  titleIcon?: React.ReactNode;
  currentTitle: string;
  items: DocItem[];
  onFilesSelected?: (files: FileList) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function DocumentSection({
  title,
  description,
  titleIcon,
  currentTitle,
  items,
  onFilesSelected,
  onView,
  onDelete,
  className
}: DocumentSectionProps){
  const toast = useToast();

  return (
    <div className={className}>
      <SectionCard title={title} description={description} titleIcon={titleIcon}>
        <FileUploadCustom className="mb-4" onFilesSelected={(files)=>{
          onFilesSelected?.(files);
          toast(`${files.length} file(s) selected for upload`);
        }} />

        <div className="flex items-center justify-between mb-3">
          <h3 className="b-font text-sm font-semibold text-[--color-neutral-800]">{currentTitle}</h3>
          <div className="text-xs text-[--color-neutral-600]">{items.length} document{items.length === 1 ? '' : 's'}</div>
        </div>

        <div className="space-y-3">
          {items.map(d => (
            <ListRow key={d.id} icon={<FileTextIcon className="w-4 h-4" />} title={d.name} meta={`Uploaded: ${d.uploadedAt} • ${d.sizeMB} MB`} onView={()=>onView?.(d.id)} onDelete={()=>onDelete?.(d.id)} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
