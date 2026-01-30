"use client";
import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/blocks/SectionCard';
import { ListRow } from '@/components/blocks/ListRow';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/assets/icon-svg';
import { ConfirmDeleteDialog } from '@/components/feedback/ConfirmDeleteDialog';
import { useToast } from '@/components/providers/UiProviders';
import { mocks } from '@/lib/mocks';
import { FolderIcon } from '@/assets/icon-svg';
import { NewProjectForm } from '@/components/blocks/AddNewProject';
import { ProjectDetailModal, type Project as DetailProject } from '@/components/blocks/ProjectDetail';

type NewCompetitionVals = any;

export default function Competition(){
  const show = useToast();
  const [showNew, setShowNew] = React.useState(false);
  const [openId, setOpenId] = React.useState<string|null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewProject, setViewProject] = React.useState<DetailProject | null>(null);
  const [tick, setTick] = React.useState(0);

  const detailsRef = React.useRef<Record<string, { url?: string; coordinates?: string; documents?: { name:string; type?:string }[] }>>({});

  const competitors = mocks.competitors;

  const listRef = React.useRef<HTMLDivElement|null>(null);

  return (
    <div>
      <PageHeader title="Information on competing projects" subtitle="Upload and manage competing project information and documentation">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNew(true)}
            title="Add New Project"
            aria-label="Add New Project"
            className="inline-flex md:hidden items-center justify-center h-8 w-8 rounded-full bg-black text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <div className="hidden md:block">
            <Button size="sm" onClick={() => setShowNew(true)} className="whitespace-nowrap">+ Add New Project</Button>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {showNew && (
          <NewProjectForm
            variant="competition"
            singleUploadMode
            showBrochure={false}
            showVideos={false}
            showFloorPlan={false}
            showSpa={false}
            showOthers={false}
            labels={{
              formTitle: 'Add New Competing Project',
              formSubtitle: 'Upload competing project details and documents',
              formTitleClassName: 'font-semibold',
              formSubtitleClassName: 'text-sm',
              documentsSectionTitle: 'Project Information',
              urlLabel: 'Project URL',
              coordinatesLabel: 'Location coordinates (Lat/Long)',
              saveButton: 'Save Project',
              genericUploadLabel: 'Project brochure or other project related documents',
            }}
            onCancel={()=>setShowNew(false)}
            onSave={(vals: NewCompetitionVals)=>{
              const createdAt = new Date().toISOString().slice(0,10);
              const id = `c${Date.now()}`;
              mocks.addCompetitor({ id, name: vals.name, createdAt });
              const brochure = vals.documents?.brochure?.[0];
              const detail = {
                url: vals.projectUrl as string | undefined,
                coordinates: vals.coordinates as string | undefined,
                documents: brochure ? [{ name: brochure.name, type: 'PDF Document' as const }] : undefined,
              };
              mocks.setCompetitorDetail(id, detail);
              detailsRef.current[id] = detail;
              setShowNew(false);
              setTick(t=>t+1);
              show('Project saved');
              listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        )}

        <div ref={listRef} />
        <SectionCard title="List of competing projects" className="p-3 md:p-4 lg:p-5">
          <div className="mt-6 space-y-3">
            {competitors.length === 0 && (
              <div className="text-sm text-[--color-neutral-600]">No competing projects</div>
            )}
            {competitors.map(p => (
              <ListRow
                key={p.id}
                icon={<FolderIcon className="w-4 h-4" />}
                title={p.name}
                meta={`Created: ${p.createdAt}`}
                onView={()=>{
                  const extra = mocks.getCompetitorDetail(p.id) || detailsRef.current[p.id];
                  const proj: DetailProject = {
                    title: p.name,
                    createdAt: p.createdAt,
                    url: extra?.url,
                    coordinates: extra?.coordinates,
                    documents: extra?.documents,
                    videos: [],
                  };
                  setViewProject(proj);
                  setViewOpen(true);
                }}
                onDelete={()=> setOpenId(p.id)}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <ConfirmDeleteDialog
        open={!!openId}
        onOpenChange={(b)=>!b && setOpenId(null)}
        title="Delete project?"
        description="This removes the project from the demo list."
        onConfirm={()=>{
          if(!openId) return;
          mocks.removeCompetitor(openId);
          delete detailsRef.current[openId];
          setOpenId(null);
          setTick(t=>t+1);
          show('Project deleted');
        }}
      />
      <ProjectDetailModal open={viewOpen} onClose={()=>setViewOpen(false)} project={viewProject} />
    </div>
  );
}
