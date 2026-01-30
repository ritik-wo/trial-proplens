import { ViewButton, DeleteButton } from '@/components/action/ActionButton';

export function ActionGroup({ onView, onDelete }:{ onView?:()=>void; onDelete?:()=>void }){
  return (
    <div className="flex gap-2">
      <ViewButton onClick={onView || (()=>{})} />
      <DeleteButton onClick={onDelete || (()=>{})} />
    </div>
  );
}
