"use client";
import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/blocks/SectionCard';
import { FileUploadCustom } from '@/components/forms/CustomFileUploadInput';
import { ListRow } from '@/components/blocks/ListRow';
import { ConfirmDeleteDialog } from '@/components/feedback/ConfirmDeleteDialog';
import { useToast } from '@/components/providers/UiProviders';
import { FileTextIcon, RocketIcon, TrendingUpIcon, FolderIcon } from '@/assets/icon-svg';
import { ProjectDetailModal, type Project as DetailProject } from '@/components/blocks/ProjectDetail';
import { mocks } from '@/lib/mocks';
import { UrlSection } from '@/components/blocks/UrlSection';
type LaunchItem = { id: string; name: string; createdAt: string };

export default function NewLaunches(){
  const toast = useToast();
  const [launches, setLaunches] = React.useState<LaunchItem[]>([
    { id: 'nl1', name: 'The Sen', createdAt: '2025-08-15' },
    { id: 'nl2', name: 'Skye at Holland', createdAt: '2025-08-15' },
  ]);
  const [link, setLink] = React.useState('https://example.com/project-launch');

  const [openDelete, setOpenDelete] = React.useState<string|null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewProject, setViewProject] = React.useState<DetailProject | null>(null);

  const [reportsTick, setReportsTick] = React.useState(0);
  const reports = React.useMemo(()=> mocks.presentations.slice(0, 1), [reportsTick]);
  return (
    <div>
      <PageHeader subtitle="Manage latest market updates on new launches and transaction trends" subtitleClassName="text-[--color-neutral-900]" />

      <div className="space-y-6">
        <SectionCard
          title="New project launches"
          titleClassName="font-semibold"
          titleIcon={
            <div className="w-8 h-8 rounded-md grid place-items-center" style={{ backgroundColor: 'color-mix(in oklch, var(--color-primary) 18%, white)' }}>
              <RocketIcon className="w-4 h-4 text-[--color-primary]" />
            </div>
          }
        >
          <div className="mt-6">
            <FileUploadCustom onFilesSelected={(files)=>{
              const now = new Date().toISOString().slice(0,10);
              const items = Array.from(files).map((f)=>({ id: `${Date.now()}-${f.name}`, name: f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g,' '), createdAt: now }));
              setLaunches(prev=>[...prev, ...items]);
              toast(`${files.length} file(s) added`);
            }} />
          </div>
        </SectionCard>

        <UrlSection
          title="Links for new project launches"
          titleClassName="font-semibold"
          defaultValue={link}
          placeholder="https://example.com/project-launch"
          currentLabel="Current URL:"
          onSave={(u)=>{ setLink(u); toast('Link saved'); }}
        />

        <SectionCard title="Previously Uploaded Projects" description="New project launches already uploaded" titleClassName="font-semibold">
          <div className="space-y-3">
            {launches.map(p => (
              <ListRow
                key={p.id}
                icon={<FolderIcon className="w-4 h-4" />}
                title={p.name}
                meta={`Created: ${p.createdAt}`}
                onView={()=>{
                  const proj: DetailProject = {
                    title: p.name,
                    createdAt: p.createdAt,
                    url: undefined,
                    coordinates: undefined,
                    documents: undefined,
                    videos: [],
                  };
                  setViewProject(proj);
                  setViewOpen(true);
                }}
                onDelete={()=> setOpenDelete(p.id)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Reports on Market trends"
          titleClassName="font-semibold"
          titleIcon={
            <div className="w-8 h-8 rounded-md grid place-items-center" style={{ backgroundColor: 'color-mix(in oklch, var(--color-primary) 18%, white)' }}>
              <TrendingUpIcon className="w-4 h-4 text-[--color-primary]" />
            </div>
          }
        >
          <div className="mt-4">
            <FileUploadCustom onFilesSelected={(files)=>{
              toast(`${files.length} file(s) selected for upload`);
            }} />
          </div>
        </SectionCard>

        <SectionCard title="Existing market research reports" titleClassName="font-semibold">
          <div className="space-y-3">
            {reports.map(r => (
              <ListRow
                key={r.id}
                icon={<TrendingUpIcon className="w-4 h-4 text-[--color-primary]" />}
                title={r.name}
                meta={`Uploaded: ${r.uploadedAt} • ${r.sizeMB} MB`}
                onView={()=> toast('Preview not implemented in mock') }
                onDelete={()=> {
                  mocks.removePresentation(r.id);
                  setReportsTick(t=>t+1);
                  toast('Report removed');
                }}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <ConfirmDeleteDialog
        open={!!openDelete}
        onOpenChange={(b)=> !b && setOpenDelete(null)}
        title="Delete item?"
        description="This removes the project from previously uploaded launches."
        onConfirm={()=>{
          if(!openDelete) return;
          setLaunches(prev=> prev.filter(p=>p.id !== openDelete));
          setOpenDelete(null);
          toast('Item deleted');
        }}
      />

      <ProjectDetailModal open={viewOpen} onClose={()=>setViewOpen(false)} project={viewProject} />
    </div>
  );
}
