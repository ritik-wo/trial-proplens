"use client";
import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/blocks/SectionCard';
import { ListRow } from '@/components/blocks/ListRow';
import { ConfirmDeleteDialog } from '@/components/feedback/ConfirmDeleteDialog';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/assets/icon-svg';
import { NewProjectForm } from '@/components/blocks/AddNewProject';
import { ProjectDetailModal } from '@/components/blocks/ProjectDetail';
import { mocks } from '@/lib/mocks';
import { useToast } from '@/components/providers/UiProviders';
import { FormUrlField } from '@/components/forms/FormUrlField';

export default function OurProjectsPage() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const show = useToast();
  const projects = mocks.projects;
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewProject, setViewProject] = React.useState<{ title: string; createdAt: string; url?: string; videos?: { label: string; url: string }[]; coordinates?: string; documents?: { name: string; type?: string }[] } | null>(null);

  const remove = (id: string) => { mocks.removeProject(id); setTick(t => t + 1); show('Project deleted'); setOpenId(null); };

  const projectsRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <PageHeader title="Details about our projects" subtitle="Upload and manage project documentation and details">
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

      <div className="space-y-7">
        {showNew && (
          <NewProjectForm
            onCancel={() => setShowNew(false)}
            onSave={(vals) => {
              const createdAt = new Date().toISOString().slice(0, 10);
              mocks.addProject({ id: `p${Date.now()}`, name: vals.name, createdAt });
              setShowNew(false);
              setTick(t => t + 1);
              show('Project saved');
              projectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        )}
        <div ref={projectsRef} />
        <SectionCard title="Existing Projects" className="p-3 md:p-4 lg:p-5">
          <div className="mt-6 space-y-3">
            {projects.length === 0 && <div data-testid="empty-projects" className="text-sm text-[--color-neutral-600]">No projects</div>}
            {projects.map(p => (
              <ListRow
                key={p.id}
                title={p.name}
                meta={`Created: ${p.createdAt}`}
                onView={() => {
                  const detailed = mocks.DEFAULT_PROJECTS.find(dp => dp.title === p.name);
                  setViewProject(detailed || { title: p.name, createdAt: p.createdAt });
                  setViewOpen(true);
                }}
                onDelete={() => setOpenId(p.id)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Sharepoint link for project sales brochures">
          <SharepointForm />
        </SectionCard>
      </div>

      <ConfirmDeleteDialog open={!!openId} onOpenChange={(b) => !b && setOpenId(null)} title="Delete project?" description="This removes the project from the demo list." onConfirm={() => openId && remove(openId)} />
      <ProjectDetailModal open={viewOpen} onClose={() => setViewOpen(false)} project={viewProject} />
    </div>
  );
}

function SharepointForm() {
  const show = useToast();
  const [url, setUrl] = React.useState('');
  const onSave = (v: string) => { setUrl(v); show('Link saved'); };
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const v = (new FormData(e.currentTarget).get('sharepointUrl') as string) || ''; onSave(v); }}
      className="w-full max-w-xl mt-5"
    >
      <input
        name="sharepointUrl"
        defaultValue={url}
        placeholder="https://sharepoint.com/..."
        onBlur={(e) => onSave(e.currentTarget.value)}
        className="w-full rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1.5 placeholder:text-[--color-neutral-500] placeholder:text-xs focus:outline-none focus:ring-0 focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
        type="url"
        aria-label="SharePoint URL"
      />
      <input type="submit" hidden />
    </form>
  );
}
