import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Folder } from 'lucide-react';
import { ActionGroup } from './ActionGroup';

export function ListRow({ icon, title, meta, href, onView, onDelete }:{ icon?:React.ReactNode; title:string; meta?:string; href?:Route; onView?:()=>void; onDelete?:()=>void }){
  const Title = () => href ? (
    <Link href={href} className="text-[--color-neutral-900] hover:underline" data-testid="row-title">{title}</Link>
  ) : (
    <span className="text-[--color-neutral-900]" data-testid="row-title">{title}</span>
  );
  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-[--color-neutral-200] bg-[--color-surface] hover:bg-[--color-neutral-50]/60 transition-colors" data-testid="list-row">
      <div className="flex items-center gap-3">
        <div className="text-[--color-metallic-grey]">{icon || <Folder size={18} />}</div>
        <div>
          <div className="b-font text-sm font-medium"><Title /></div>
          {meta && <div className="text-sm text-[--color-neutral-500]">{meta}</div>}
        </div>
      </div>
      <ActionGroup onView={onView} onDelete={onDelete} />
    </div>
  );
}
