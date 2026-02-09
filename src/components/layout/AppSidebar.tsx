"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';
import { Avatar } from '../ui/Avatar';
import { LogOut, ChevronDown, Plus } from 'lucide-react';
import { getSectionsForRole } from '@/lib/roleMenu';
import { useAuthRole } from '@/components/providers/AuthRoleProvider';
import type { Route } from 'next';
import { ConfirmDeleteDialog } from '@/components/feedback/ConfirmDeleteDialog';
import { tokenService } from '@/lib/api/tokenService';
import { ChatHistorySidebar } from './ChatHistorySidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuthRole();
  const sections = getSectionsForRole(role);
  const singleSection = sections.length === 1;
  const [openIds, setOpenIds] = React.useState<string[]>(sections[0]?.id ? [sections[0].id] : []);
  React.useEffect(() => { setOpenIds(sections[0]?.id ? [sections[0].id] : []); }, [role]);

  const isMarketRoute = pathname?.startsWith('/market-transaction');
  const [clientReady, setClientReady] = React.useState(false);
  const [lastIdMap, setLastIdMap] = React.useState<{ 'ask-buddy': string | null; 'market-transaction': string | null }>({ 'ask-buddy': null, 'market-transaction': null });

  const getLastChatKey = (mode: 'ask-buddy' | 'market-transaction') => `lastChatId:${mode}`;
  const setLastChatId = (mode: 'ask-buddy' | 'market-transaction', id: string | null) => {
    try {
      if (typeof window === 'undefined') return;
      const k = getLastChatKey(mode);
      if (id) localStorage.setItem(k, id); else localStorage.removeItem(k);
      setLastIdMap(prev => ({ ...prev, [mode]: id }));
    } catch { }
  };

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        setLastIdMap({
          'ask-buddy': localStorage.getItem(getLastChatKey('ask-buddy')) || null,
          'market-transaction': localStorage.getItem(getLastChatKey('market-transaction')) || null,
        });
      }
    } catch { }
    setClientReady(true);
  }, []);


  const handleNewChat = (chatType: 'ask-buddy' | 'market-transaction') => {
    const target = `/${chatType}` as Route;
    if (pathname?.startsWith(target)) {
      try { window.dispatchEvent(new CustomEvent('chat:new', { detail: { mode: chatType } })); } catch { }
    }
    setLastChatId(chatType, null);
    router.push(target);
  };
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const handleConfirmLogout = React.useCallback(() => {
    tokenService.clearAll();
    document.cookie = 'auth_logged_in=; path=/; max-age=0';
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userOrgId');
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(getLastChatKey('ask-buddy'));
        localStorage.removeItem(getLastChatKey('market-transaction'));
      }
    } catch { }
    router.push('/');
  }, [router]);
  return (
    <aside className="hidden md:flex md:flex-col w-56 h-screen fixed left-0 top-0 border-r border-[--color-neutral-800] bg-[--color-neutral-950]">
      <div className="pl-4 pr-6 py-5 border-b border-[--color-neutral-800] flex items-center gap-1">
        <div className="shrink-0">
          <Image src="/favicon.ico" alt="Proplens" width={32} height={32} className="object-contain" />
        </div>
        <div className="h-font text-base leading-5 font-semibold text-white">Trial</div>
      </div>
      <nav className="flex-1 pl-2 pr-4 py-3 space-y-2">
        {sections.map((section) => (
          <div key={section.id}>
            {singleSection ? (
              <div className="mt-1 space-y-1">
                {section.items.map(it => {
                  const active = pathname === it.href || pathname?.startsWith(it.href + '/') || pathname?.startsWith(it.href + '?');
                  const Icon = it.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                  const isChatItem = it.label === 'Ask Buddy' || it.label === 'Transaction Data';
                  const chatType = it.label === 'Ask Buddy' ? 'ask-buddy' : 'market-transaction';

                  if (isChatItem) {
                    const lastId = clientReady ? lastIdMap[chatType] : null;
                    const historyHref = lastId
                      ? (`/${chatType}?historyId=${lastId}` as Route)
                      : (it.href as Route);
                    return (
                      <div key={it.href} className="flex items-center gap-1">
                        <Link
                          href={historyHref}
                          className={`group flex items-center gap-2 px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent flex-1 ${active
                            ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                            : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                            }`}
                        >
                          <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                          <span className="whitespace-nowrap">{it.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleNewChat(chatType)}
                          className="flex items-center justify-center w-6 h-6 rounded-md text-[--color-neutral-500] hover:text-[--color-neutral-300] hover:bg-white/5 transition-colors"
                          title={`Start new ${it.label.toLowerCase()} conversation`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  if (it.label === 'Chat History') {
                    return (
                      <ChatHistorySidebar key={it.href} Icon={Icon} label={it.label} />
                    );
                  }

                  return (
                    <Link
                      key={it.href}
                      href={it.href as Route}
                      className={`group flex items-center gap-2 px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent w-full ${active
                        ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                        : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                        }`}
                    >
                      <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                      <span className="whitespace-nowrap">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <>
                <button
                  className="w-full flex items-center justify-between px-2 h-8 rounded-lg text-xs text-[--color-neutral-300] hover:bg-white/5"
                  onClick={() => setOpenIds(prev => prev.includes(section.id) ? prev.filter(id => id !== section.id) : [...prev, section.id])}
                  aria-expanded={openIds.includes(section.id)}
                >
                  <span className="b-font font-semibold text-sm text-white">{section.title}</span>
                  <ChevronDown className={`${openIds.includes(section.id) ? 'rotate-180' : ''} w-4 h-4 transition-transform`} />
                </button>
                <div className={`${openIds.includes(section.id) ? 'block' : 'hidden'} mt-1 space-y-1`}>
                  {section.items.map(it => {
                    const active = pathname === it.href || pathname?.startsWith(it.href + '/') || pathname?.startsWith(it.href + '?');
                    const Icon = it.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                    if (it.label === 'Chat History') {
                      return (
                        <ChatHistorySidebar key={it.href} Icon={Icon} label={it.label} />
                      );
                    }

                    const isChatItem = it.label === 'Ask Buddy' || it.label === 'Transaction Data';
                    const chatType = it.label === 'Ask Buddy' ? 'ask-buddy' : 'market-transaction';

                    if (isChatItem) {
                      const lastId = clientReady ? lastIdMap[chatType] : null;
                      const historyHref = lastId
                        ? (`/${chatType}?historyId=${lastId}` as Route)
                        : (it.href as Route);
                      return (
                        <div key={it.href} className="flex items-center gap-1">
                          <Link
                            href={historyHref}
                            className={`group flex items-center gap-2 px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent flex-1 ${active
                              ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                              : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                              }`}
                          >
                            <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                            <span className="whitespace-nowrap">{it.label}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleNewChat(chatType)}
                            className="flex items-center justify-center w-6 h-6 rounded-md text-[--color-neutral-500] hover:text-[--color-neutral-300] hover:bg-white/5 transition-colors"
                            title={`Start new ${it.label.toLowerCase()} conversation`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={it.href}
                        href={it.href as Route}
                        className={`group flex items-center gap-2 px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent w-full ${active
                          ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                          : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                          }`}
                      >
                        <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                        <span className="whitespace-nowrap">{it.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>



      <div className="px-5 py-3">
        <button
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-xs text-[--color-neutral-300] hover:bg-white/5"
          aria-label="Log out"
          onClick={() => setConfirmOpen(true)}
        >
          <LogOut className="w-5 h-5 text-[--color-neutral-400]" aria-hidden="true" />
          <span>Log out</span>
        </button>
        <ConfirmDeleteDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Log out"
          description="Are you sure you want to log out?"
          onConfirm={handleConfirmLogout}
        />
      </div>

      <div className="px-6 py-4 border-t border-[--color-neutral-800] flex items-center">
        <div className="flex items-center gap-3">
          <Avatar name="User name" />
          <div className="text-xs">
            <div className="b-font text-xs font-medium text-white">John Doe</div>
            <div className="text-[--color-neutral-400]">john@cdl.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
