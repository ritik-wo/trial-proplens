"use client";
import React, { useRef } from 'react';
import { FolderIcon, LinkIcon, VideoIcon, MapPinIcon, FileIcon } from '@/assets/icon-svg';
import { ViewButton } from '@/components/action/ActionButton';

export type Project = {
  title: string;
  createdAt: string;
  url?: string;
  videos?: Array<{ label: string; url: string }>;
  coordinates?: string;
  documents?: Array<{ name: string; type?: string }>;
};

export type ProjectDetailModalProps = {
  open: boolean;
  onClose: () => void;
  project: Project | null;
};

export function ProjectDetailModal({ open, onClose, project }: ProjectDetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="project-details-title">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 px-4 sm:px-6 flex items-center justify-center">
        <div className="mx-auto w-full max-w-[38.4rem] max-h-[90vh] overflow-y-auto rounded-xl bg-[--color-surface] border border-[--color-neutral-200] shadow-lg">
          <div className="flex items-start justify-between border-b border-[--color-neutral-200] px-6 pt-6 pb-4">
            <div>
              <h2 id="project-details-title" className="text-md font-semibold">Project Details</h2>
              <p className="text-xs text-[--color-neutral-600]">Competing project information and documentation</p>
            </div>
            <button ref={closeBtnRef} onClick={onClose} className="text-xs font-semibold text-[--color-neutral-500] hover:text-[--color-neutral-700] hover:bg-[--color-neutral-100] px-2 py-1 rounded transition-colors">✕ Close</button>
          </div>
          <div className="px-6 pt-6 pb-6 space-y-4">
            <div>
              <div className="text-xs font-medium mb-2 flex items-center gap-2 text-[--color-neutral-900]">
                <FolderIcon className="w-4 h-4 text-[--color-neutral-500]" />
                Project Name
              </div>
              <div className="rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-4 py-3 text-xs text-[--color-neutral-700]">{project.title}</div>
            </div>
            {project.url && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2 text-[--color-neutral-900]">
                  <LinkIcon className="w-4 h-4 text-[--color-neutral-500]" />
                  Project URL
                </div>
                <div className="flex items-center justify-between rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-4 py-3">
                  <div className="text-xs text-[--color-neutral-700] truncate flex-1">{project.url}</div>
                  <a className="inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] bg-[--color-surface] h-8 px-3 text-xs font-medium text-[--color-neutral-700] hover:bg-[--color-neutral-100] ml-2" href={project.url} target="_blank" rel="noreferrer">
                    <LinkIcon className="w-4 h-4" />
                    Open
                  </a>
                </div>
              </div>
            )}
            {!!project.videos?.length && (
              <div className="space-y-2">
                <div className="text-xs font-medium flex items-center gap-2 text-[--color-neutral-900]"><VideoIcon className="w-4 h-4 text-[--color-neutral-500]" /> Project Video Links</div>
                {project.videos!.map((v) => (
                  <div key={v.url} className="flex items-center justify-between rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-5 py-4">
                    <div className="flex items-start">
                      <VideoIcon className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <div className="text-xs font-medium mb-2">{v.label}</div>
                        <div className="text-[11px] text-[--color-neutral-500] -ml-6">{v.url}</div>
                      </div>
                    </div>
                    <a href={v.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] bg-[--color-surface] h-8 px-3 text-xs font-medium text-[--color-neutral-700] hover:bg-[--color-neutral-100]">
                      <VideoIcon className="w-4 h-4" />
                      Watch
                    </a>
                  </div>
                ))}
              </div>
            )}
            {project.coordinates && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2 text-[--color-neutral-900]">
                  <MapPinIcon className="w-4 h-4 text-[--color-neutral-500]" />
                  Google Coordinates
                </div>
                <div className="rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-4 py-3 text-xs text-[--color-neutral-700]">{project.coordinates}</div>
              </div>
            )}
            <div className="space-y-2">
              <div className="text-xs font-medium flex items-center gap-2 text-[--color-neutral-900]">
                <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> Project Documents
              </div>
              <div className="flex items-center justify-between rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-4 py-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center mt-0.5">
                    <FileIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">Sample_Project_Brochure.pdf</div>
                    <div className="text-[11px] text-[--color-neutral-500]">PDF Document</div>
                  </div>
                </div>
                <ViewButton onClick={() => {}} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium mb-2 flex items-center gap-2 text-[--color-neutral-900]">
                <FolderIcon className="w-4 h-4 text-[--color-neutral-500]" />
                Created Date
              </div>
              <div className="rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] px-4 py-3 text-xs text-[--color-neutral-700]">{project.createdAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
