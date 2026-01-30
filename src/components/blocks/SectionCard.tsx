import * as React from 'react';

export function SectionCard({ title, description, actions, children, titleIcon, compactHeader = false, className, titleClassName }:{ title?:string; description?:string; actions?:React.ReactNode; children:React.ReactNode; titleIcon?: React.ReactNode; compactHeader?: boolean; className?: string; titleClassName?: string }){
  return (
    <section className={`card-base px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6 ${compactHeader ? 'pt-3 md:pt-4 lg:pt-5' : ''} ${className || ''}`}>
      {(title || actions) && (
        <div className={`flex ${(!description || compactHeader) ? 'items-center' : 'items-start'} justify-between ${compactHeader ? 'mb-1.5' : 'mb-3'}`}>
          <div className={`flex ${(!description || compactHeader) ? 'items-center' : 'items-start'} gap-3`}>
            {titleIcon && <div className={`${(!description || compactHeader) ? '' : 'mt-0.5'}`}>{titleIcon}</div>}
            <div>
              {title && <h2 className={`h-font text-sm ${titleClassName || ''}`}>{title}</h2>}
              {description && <p className="b-font text-sm text-[--color-neutral-600]">{description}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
