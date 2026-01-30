"use client";
import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';

const ToastContext = React.createContext<(msg: string) => void>(() => {});

export function useToast() { return React.useContext(ToastContext); }

export function UiProviders({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const show = (m: string) => { setMessage(m); setOpen(true); };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {mounted && (
        <Tooltip.Provider delayDuration={200}>
          <Toast.Provider swipeDirection="right">
            <Toast.Root
              open={open}
              onOpenChange={setOpen}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] card-base px-5 py-3 shadow-lg"
            >
              <Toast.Title className="b-font text-sm">{message}</Toast.Title>
            </Toast.Root>
            <Toast.Viewport className="fixed inset-0 pointer-events-none" />
          </Toast.Provider>
        </Tooltip.Provider>
      )}
    </ToastContext.Provider>
  );
}
