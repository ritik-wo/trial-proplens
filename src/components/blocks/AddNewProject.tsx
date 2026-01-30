"use client";
import React from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { FileIcon, LinkIcon, VideoIcon, MapPinIcon, PlusIcon, UploadIcon } from '@/assets/icon-svg';
import { FileUploadCustom } from '@/components/forms/CustomFileUploadInput';

export type NewProjectFormProps = {
  onCancel?: () => void;
  onSave?: (values: any) => void;
  variant?: 'project' | 'competition';
  showVideos?: boolean;
  showBrochure?: boolean;
  showFloorPlan?: boolean;
  showSpa?: boolean;
  showOthers?: boolean;
  singleUploadMode?: boolean;
  labels?: {
    formTitle?: string;
    formSubtitle?: string;
    formTitleClassName?: string;
    formSubtitleClassName?: string;
    documentsSectionTitle?: string;
    urlLabel?: string;
    coordinatesLabel?: string;
    saveButton?: string;
    genericUploadLabel?: string;
  };
  urlRequired?: boolean;
  coordinatesRequired?: boolean;
};

type FormValues = {
  name: string;
  projectUrl: string;
  coordinates: string;
  videos: { url: string; description: string }[];
  documents: {
    brochure: File[];
    floorPlan: File[];
    spa: File[];
    others: File[];
  };
};

export function NewProjectForm({ onCancel, onSave, variant = 'project', showVideos, showBrochure, showFloorPlan, showSpa, showOthers, singleUploadMode, labels, urlRequired, coordinatesRequired }: NewProjectFormProps) {
  const useVideos = showVideos ?? (variant === 'project');
  const useBrochure = showBrochure ?? (variant === 'project');
  const useFloorPlan = showFloorPlan ?? (variant === 'project');
  const useSpa = showSpa ?? (variant === 'project');
  const useOthers = showOthers ?? (variant === 'project');
  const oneUpload = singleUploadMode ?? (variant === 'competition');
  const isUrlRequired = urlRequired ?? true;
  const isCoordsRequired = coordinatesRequired ?? true;

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      projectUrl: '',
      coordinates: '',
      videos: useVideos ? [{ url: '', description: '' }] : [],
      documents: {
        brochure: [],
        floorPlan: [],
        spa: [],
        others: [],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'videos' });
  const watchedUrl = useWatch({ control, name: 'projectUrl' });

  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <form
      onSubmit={handleSubmit((vals: FormValues) => {
        onSave?.(vals);
      })}
      className="card-base pt-5 pb-7 px-6 space-y-6"
      data-testid="new-project-form"
    >
      <div className="mb-4">
        <h2 className={`text-sm text-[--color-neutral-900] ${labels?.formTitleClassName ?? ''}`}>{labels?.formTitle || 'Add New Project'}</h2>
        {labels?.formSubtitle && (
          <p className={`mt-1 text-[--color-neutral-600] ${labels?.formSubtitleClassName ?? 'text-xs'}`}>{labels.formSubtitle}</p>
        )}
      </div>
      <div>
        <label htmlFor="project-name" className="text-xs font-medium mb-2.5 block text-[--color-neutral-900]">
          Project Name *
        </label>
        <input
          id="project-name"
          className="w-[40%] rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1 placeholder:text-[--color-neutral-500] placeholder:text-xs focus:outline-none focus:ring-0 focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
          placeholder="Enter project name"
          {...register('name', { required: 'Project name is required', setValueAs: (v) => (typeof v === 'string' ? v.trim() : v) })}
          aria-invalid={!!errors.name}
        />
        {errors.name?.message && (
          <span className="mt-1 block text-[11px] text-red-600" aria-live="polite">{errors.name.message}</span>
        )}
      </div>

      <div className="border-t my-2" />
      <div className="space-y-3">
        <div className="text-xs font-medium">{labels?.documentsSectionTitle || 'Project Documents'}</div>
        {oneUpload && variant !== 'competition' ? (
          <div>
            <div className="text-xs font-medium mb-2 flex items-center gap-2">
              <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> {labels?.genericUploadLabel || 'Project brochure or other project related documents'}
            </div>
            <Controller
              control={control}
              name={'documents.brochure'}
              render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
                <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
              )}
            />
          </div>
        ) : (
          <>
            {useBrochure && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> Brochure
                </div>
                <Controller
                  control={control}
                  name={'documents.brochure'}
                  render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
                    <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
                  )}
                />
              </div>
            )}
            {useFloorPlan && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> Floor Plan set
                </div>
                <Controller
                  control={control}
                  name={'documents.floorPlan'}
                  render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
                    <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
                  )}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <label htmlFor="project-url" className="text-xs font-medium mb-2.5 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[--color-neutral-500]" /> {labels?.urlLabel || 'Project URL'}{isUrlRequired ? ' *' : ''}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="project-url"
            className="w-[40%] rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1 placeholder:text-[--color-neutral-500] placeholder:text-xs focus:outline-none focus:ring-0 focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
            placeholder="https://example.com/project"
            {...register('projectUrl', {
              required: isUrlRequired ? 'Project URL is required' : false,
              validate: (v) => (isValidUrl(v) ? true : 'Please enter a valid url'),
            })}
            aria-invalid={!!errors.projectUrl}
          />
          <button
            type="button"
            disabled={!isValidUrl(watchedUrl || '')}
            onClick={() => {
              if (isValidUrl(watchedUrl || '')) window.open(watchedUrl, '_blank', 'noopener');
            }}
            className="inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] bg-[--color-surface] h-8 px-3 text-xs font-medium text-[--color-neutral-700] hover:bg-[--color-neutral-100] shadow-sm"
          >
            <LinkIcon className="w-[14px] h-[14px]" />
            Open
          </button>
        </div>
        {errors.projectUrl?.message && (
          <span className="mt-1 block text-[11px] text-red-600" aria-live="polite">{errors.projectUrl.message}</span>
        )}
      </div>
      {useVideos && (
      <div className="space-y-3">
        <div className="text-xs font-medium flex items-center gap-2">
          <VideoIcon className="w-4 h-4 text-[--color-neutral-500]" /> Project Video Links
        </div>
        {fields.map((field, idx: number) => (
          <div key={field.id} className="rounded-lg border border-[--color-neutral-200] p-3 space-y-2 relative bg-[--color-surface]">
            {fields.length > 1 && (
              <button
                type="button"
                aria-label="Remove video link"
                className="absolute right-2 top-2 h-6 w-6 rounded-md border border-[--color-neutral-300] text-xs text-[--color-neutral-400] hover:bg-[--color-neutral-100]"
                onClick={() => remove(idx)}
              >
                ×
              </button>
            )}
            <div>
              <label htmlFor={`videos.${idx}.url`} className="text-xs font-medium mb-2 inline-block">Video URL</label>
              <input
                id={`videos.${idx}.url`}
                className="w-full rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1 placeholder:text-xs placeholder:text-[--color-neutral-500] focus:outline-none focus:ring-0 focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
                placeholder="https://youtube.com/watch?v=..."
                {...register(`videos.${idx}.url` as const, {
                  validate: (v) => (!v || isValidUrl(v) ? true : 'Enter a valid URL'),
                })}
              />
            </div>
            <div>
              <label htmlFor={`videos.${idx}.description`} className="text-xs font-medium mb-2 inline-block">Video description</label>
              <input
                id={`videos.${idx}.description`}
                className="w-full rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1 placeholder:text-xs placeholder:text-[--color-neutral-500] focus:outline-none focus:ring-0 focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
                placeholder="e.g., Project Overview, Virtual Tour, Amenities..."
                {...register(`videos.${idx}.description` as const, { maxLength: 120 })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] bg-[--color-surface] h-8 px-3 text-xs text-[--color-neutral-900] hover:bg-[--color-neutral-100]"
          onClick={() => append({ url: '', description: '' })}
        >
          <PlusIcon className="w-4 h-4" />
          Add more links
        </button>
      </div>
      )}
      <div>
        <label htmlFor="coordinates" className="text-xs font-medium mb-2.5 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-[--color-neutral-500]" /> {labels?.coordinatesLabel || 'Location coordinates (Lat/Long)'}{isCoordsRequired ? ' *' : ''}
        </label>
        <input
          id="coordinates"
          className="w-[40%] rounded-md border border-transparent bg-[--color-neutral-50] text-[--color-neutral-700] text-xs px-3 py-1 placeholder:text-[--color-neutral-500] focus:outline-none focus:ring-0 placeholder:text-xs focus:bg-[--color-neutral-100] focus:border-[--color-neutral-300] focus:shadow-sm transition-colors"
          placeholder="e.g., 19.0760, 72.8777"
          {...register('coordinates', {
            required: isCoordsRequired ? 'Location coordinates are required' : false,
            validate: (v) => {
              if (!v || !v.trim()) return true;
              const m = v.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
              if (!m) return 'Enter as "lat, long"';
              const lat = parseFloat(m[1]);
              const lng = parseFloat(m[2]);
              if (lat < -90 || lat > 90) return 'Latitude must be between -90 and 90';
              if (lng < -180 || lng > 180) return 'Longitude must be between -180 and 180';
              return true;
            },
          })}
          aria-invalid={!!errors.coordinates}
        />
        {errors.coordinates?.message && (
          <span className="mt-1 block text-[11px] text-red-600" aria-live="polite">{errors.coordinates.message}</span>
        )}
      </div>
      {oneUpload && variant === 'competition' && (
        <div className="space-y-2">
          <div className="text-xs font-medium mb-2 flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> {labels?.genericUploadLabel || 'Project brochure or other project related documents'}
          </div>
          <Controller
            control={control}
            name={'documents.brochure'}
            render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
              <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
            )}
          />
        </div>
      )}
      {!oneUpload && (
      <div className="space-y-3">
        {useSpa && (
        <div>
          <div className="text-xs font-medium mb-2 flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> SPA (Sales Purchase Agreement)
          </div>
          <Controller
            control={control}
            name={'documents.spa'}
            render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
              <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
            )}
          />
        </div>
        )}
        {useOthers && (
        <div>
          <div className="text-xs font-medium mb-2 flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-[--color-neutral-500]" /> Other Project Documents
          </div>
          <Controller
            control={control}
            name={'documents.others'}
            render={({ field }: { field: { value: File[]; onChange: (v: File[]) => void } }) => (
              <FileUploadCustom multiple={false} onFilesSelected={(fl) => field.onChange(Array.from(fl))} />
            )}
          />
        </div>
        )}
      </div>
      )}
      <div className="border-t my-4" />
      <div className="mt-3 flex items-center gap-2">
        <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-black text-white h-9 px-4 text-xs hover:bg-black/90">
          <UploadIcon className="w-4 h-4" />
          {labels?.saveButton || 'Save Project'}
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] h-9 px-4 text-xs hover:bg-[--color-neutral-100]" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
