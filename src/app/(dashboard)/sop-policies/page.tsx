"use client";
import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { UploadListSection } from '@/components/blocks/UploadListSection';
import { FileUploadCustom } from '@/components/forms/CustomFileUploadInput';
import { mocks } from '@/lib/mocks';
import { FileTextIcon, UsersIcon, UserPlusIcon } from '@/assets/icon-svg';
import { useToast } from '@/components/providers/UiProviders';

export default function Sops(){
  const show = useToast();
  const [tick, setTick] = React.useState(0); 

  const sections = [
    {
      key: 'sales',
      title: 'Sales SOPs',
      description: 'Standard operating procedures for sales processes and customer interactions',
      titleIcon: (
        <div
          className="w-8 h-8 rounded-md grid place-items-center"
          style={{ backgroundColor: 'color-mix(in oklch, var(--color-metallic-gold1) 18%, white)' }}
        >
          <FileTextIcon className="w-4 h-4 text-[--color-metallic-gold1]" />
        </div>
      ),
      currentTitle: 'Current Sales SOPs',
      get items(){ return mocks.salesSops; },
      onFilesSelected:(files: FileList)=>{
        show(`${files.length} file(s) selected for upload`);
      },
      onView:(id:string)=>{ show('Preview coming soon'); },
      onDelete:(id:string)=>{ mocks.removeSalesSop(id); setTick(t=>t+1); show('Document deleted'); }
    },
    {
      key: 'kyc',
      title: 'Customer KYC/Document Upload Guidelines',
      description: 'Guidelines for customer verification and document collection processes',
      titleIcon: (
        <div
          className="w-8 h-8 rounded-md grid place-items-center"
          style={{ backgroundColor: 'color-mix(in oklch, var(--color-primary) 18%, white)' }}
        >
          <UsersIcon className="w-4 h-4 text-[--color-primary]" />
        </div>
      ),
      currentTitle: 'Current KYC Guidelines',
      get items(){ return mocks.kycGuidelines; },
      onFilesSelected:(files: FileList)=>{ show(`${files.length} file(s) selected for upload`); },
      onView:(id:string)=>{ show('Preview coming soon'); },
      onDelete:(id:string)=>{ mocks.removeKycGuideline(id); setTick(t=>t+1); show('Document deleted'); }
    },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader title="SOP & Policies Management" subtitle="Manage standard operating procedures, policies, and guidelines for your organization" />

      <div className="space-y-8">
        {sections.map(sec => (
          <UploadListSection
            key={sec.key+tick}
            title={sec.title}
            description={sec.description}
            titleIcon={sec.titleIcon}
            className="pt-2 md:pt-2 lg:pt-2"
            uploadSlot={
              <FileUploadCustom
                className="mt-6 mb-4"
                onFilesSelected={(files)=>{
                  sec.onFilesSelected?.(files);
                }}
              />
            }
            items={sec.items.map(d => ({ id: d.id, title: d.name, meta: `Uploaded: ${d.uploadedAt} • ${d.sizeMB} MB` }))}
            countLabel={"documents"}
            onView={sec.onView}
            onDelete={(id)=>{ sec.onDelete?.(id); setTick(t=>t+1); }}
            rowIcon={<FileTextIcon className="w-4 h-4 text-[--color-primary]" />}
          />
        ))}
      </div>
    </div>
  );
}
