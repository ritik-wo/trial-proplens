"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={clsx(
        "fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60]",
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={clsx(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61]",
          "card-base w-[min(92vw,900px)] max-h-[80vh] p-0 rounded-xl bg-[--color-surface]",
          "flex flex-col",
          "focus:outline-none",
          className
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-5 py-4 border-b border-[--color-neutral-200] flex items-center justify-between gap-3", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={clsx("h-font text-base md:text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={clsx("b-font text-sm text-[--color-neutral-600]", className)} {...props} />;
}

export const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("px-5 py-4 overflow-auto flex-1 flex flex-col", className)} {...props} />
  )
);
DialogBody.displayName = 'DialogBody';

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-5 py-3 border-t border-[--color-neutral-200] flex items-center justify-center gap-4", className)} {...props} />;
}
