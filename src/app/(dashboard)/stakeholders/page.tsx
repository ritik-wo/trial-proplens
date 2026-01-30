"use client";
import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { UrlSection } from '@/components/blocks/UrlSection';
import { useToast } from '@/components/providers/UiProviders';
import { UploadListSection } from '@/components/blocks/UploadListSection';
import { FileUploadCustom } from '@/components/forms/CustomFileUploadInput';
import { mocks } from '@/lib/mocks';
import { UsersIcon } from '@/assets/icon-svg';

export default function Stakeholders() {
  const show = useToast();
  const [sharepoint, setSharepoint] = React.useState('https://company.sharepoint.com/');
  const [tick, setTick] = React.useState(0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Stakeholder Identification"
        subtitle="Help business teams identify the right team member for a specific business process support"
      />

      <UrlSection
        title="SharePoint URL"
        description="Manage your stakeholder lists for different processes"
        defaultValue={sharepoint}
        onSave={(u) => { setSharepoint(u); show('SharePoint URL saved'); }}
        currentLabel="Current SharePoint Site:"
        placeholder="https://company.sharepoint.com/"
      />

      <UploadListSection
        key={tick}
        title="Upload contact list of team members across departments"
        description="Maintain a central list of contacts that business teams can reference while identifying stakeholders."
        titleIcon={
          <div
            className="w-8 h-8 rounded-md grid place-items-center"
            style={{ backgroundColor: 'color-mix(in oklch, var(--color-primary) 18%, white)' }}
          >
            <UsersIcon className="w-4 h-4 text-[--color-primary]" />
          </div>
        }
        className="pt-2 md:pt-2 lg:pt-2"
        uploadSlot={
          <FileUploadCustom
            className="mt-6 mb-4"
            onFilesSelected={(files) => {
              const today = new Date().toISOString().slice(0, 10);
              Array.from(files).forEach((file, idx) => {
                mocks.addStakeholderContact({
                  id: `stakeholder-contact-${Date.now()}-${idx}`,
                  name: file.name,
                  uploadedAt: today,
                  sizeMB: +(file.size / (1024 * 1024)).toFixed(1),
                });
              });
              setTick(t => t + 1);
              show(`${files.length} file(s) added to contact list`);
            }}
          />
        }
        items={mocks.stakeholderContacts.map(d => ({
          id: d.id,
          title: d.name,
          meta: `Uploaded: ${d.uploadedAt} • ${d.sizeMB} MB`,
        }))}
        countLabel="documents"
        onView={(id) => { show('Preview coming soon'); }}
        onDelete={(id) => { mocks.removeStakeholderContact(id); setTick(t => t + 1); show('Document deleted'); }}
        rowIcon={<UsersIcon className="w-4 h-4 text-[--color-primary]" />}
      />
    </div>
  );
}
