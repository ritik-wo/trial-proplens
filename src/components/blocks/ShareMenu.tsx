"use client";
import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { Share2 } from "lucide-react";
import { MailIcon, WhatsappIcon } from "@/assets/icon-svg";

export interface ShareMenuProps {
  text: string;
  className?: string;
  align?: "left" | "right";
}

export function ShareMenu({ text, className, align = "right" }: ShareMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function shareViaEmail() {
    const subject = "Personalized Sales Pitch";
    const body = text;
    const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const link = document.createElement("a");
    link.href = href;
    link.click();
    setOpen(false);
  }

  function shareViaWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
  }

  return (
    <div className={clsx("relative inline-flex", className)}>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Share"
            onClick={() => setOpen(v => !v)}
            className="h-8 w-8 btn-base border border-[--color-neutral-300] bg-white text-[--color-neutral-900] hover:bg-[--color-neutral-50]"
          >
            <Share2 className="w-4 h-4 text-[--color-neutral-700]" strokeWidth={2.2} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={6} className="px-2 py-1 rounded-md bg-[--color-neutral-900] text-white text-xs shadow">
          Share
        </Tooltip.Content>
      </Tooltip.Root>

      {open && (
        <div
          ref={menuRef}
          className={clsx(
            "absolute bottom-10 z-[70] w-40 rounded-xl bg-white border border-[--color-neutral-200] shadow",
            align === "right" ? "right-0" : "left-0"
          )}
          role="menu"
          aria-label="Share options"
        >
          <button
            type="button"
            onClick={shareViaEmail}
            className="w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-t-xl hover:bg-[--color-neutral-100]"
            role="menuitem"
          >
            <MailIcon className="w-4 h-4 mr-2 text-[--color-neutral-700]" />
            <span className="b-font text-[13px]">Email</span>
          </button>
          <button
            type="button"
            onClick={shareViaWhatsApp}
            className="w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-b-xl hover:bg-green-50"
            role="menuitem"
          >
            <WhatsappIcon className="w-4 h-4 mr-2 text-green-600" />
            <span className="b-font text-[13px] text-green-700">WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}
