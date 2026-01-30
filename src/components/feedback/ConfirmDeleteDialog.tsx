"use client";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from '../ui/Button';

export function ConfirmDeleteDialog(
  { open, onOpenChange, title, description, onConfirm }:{ open:boolean; onOpenChange:(b:boolean)=>void; title:string; description?:string; onConfirm:()=>void }
){
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 card-base w-[480px] p-6 rounded-xl shadow-lg">
          <AlertDialog.Title className="h-font text-lg font-semibold mb-2">{title}</AlertDialog.Title>
          {description && <AlertDialog.Description className="b-font text-sm text-[--color-neutral-600] mb-5">{description}</AlertDialog.Description>}
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" data-testid="dialog-cancel">No</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="primary" data-testid="dialog-confirm" onClick={onConfirm}>Yes</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
