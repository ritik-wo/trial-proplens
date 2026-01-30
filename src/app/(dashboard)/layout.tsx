"use client";
import '../globals.css';
import '../../styles/fonts.css';
import * as React from 'react';
import Image from 'next/image';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { UiProviders } from '@/components/providers/UiProviders';
import { MobileSheet } from '@/components/layout/MobileSheet';
import { ContentWrapper } from '@/components/layout/ContentWrapper';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => { setMounted(true); }, []);
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function updateOffset() {
      const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767.98px)').matches;
      const h = isMobile && headerRef.current ? Math.round(headerRef.current.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty('--app-header-offset', `${h}px`);
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    window.addEventListener('orientationchange', updateOffset);
    return () => {
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('orientationchange', updateOffset);
    };
  }, []);
  const noPadding =
    pathname?.startsWith('/ask-buddy') ||
    pathname?.startsWith('/personalize-pitches') ||
    pathname?.startsWith('/chat-history');
  return (
    <UiProviders>
      <div className="md:pl-56 min-h-screen" suppressHydrationWarning>
        <AppSidebar />
        <div ref={headerRef} className="md:hidden sticky top-0 z-40 bg-[--color-neutral-950] border-b border-[--color-neutral-800]" suppressHydrationWarning>
          <div className="container-max px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                <Image src="/favicon.ico" alt="Proplens" width={32} height={32} className="object-contain" />
              </div>
              <div className="h-font text-white">Trial</div>
            </div>
            <MobileSheet />
          </div>
        </div>
        <main className="md:min-h-screen min-h-[calc(100dvh-var(--app-header-offset,56px))]">
          {mounted ? (
            <ContentWrapper noPadding={noPadding}>
              {children}
            </ContentWrapper>
          ) : null}
        </main>
      </div>
    </UiProviders>
  );
}
