"use client";
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getSectionsForRole } from '@/lib/roleMenu';
import { useAuthRole } from '@/components/providers/AuthRoleProvider';
import { ChevronDown, Menu, X, MessageSquare, Calendar, Plus } from 'lucide-react';
import type { Route } from 'next';

import { buddyApi } from '@/lib/api';

export function MobileSheet() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { role } = useAuthRole();
  const sections = getSectionsForRole(role);
  const singleSection = sections.length === 1;
  const [openId, setOpenId] = React.useState<string | null>(sections[0]?.id ?? null);
  React.useEffect(() => { setOpenId(sections[0]?.id ?? null); }, [role]);
  const pathname = usePathname();
  const [historyQ, setHistoryQ] = React.useState('');
  const [historySelectedId, setHistorySelectedId] = React.useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const authUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '67fe0defb1bb16718f027aab' : '67fe0defb1bb16718f027aab';

  type HistoryMessage = { id: string; role: 'user' | 'assistant'; content: string; time: string };
  type HistoryConversation = { id: string; title: string; subtitle: string; createdAt: string | null; messages?: HistoryMessage[] };
  const [historyConversations, setHistoryConversations] = React.useState<HistoryConversation[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);
  const preferredHistoryId = React.useMemo(() => {
    if (!historyConversations.length) return null;
    const validIds = new Set(historyConversations.map(c => c.id));
    if (historySelectedId && validIds.has(historySelectedId)) return historySelectedId;
    return historyConversations[0]?.id || null;
  }, [historySelectedId, historyConversations]);
  const isMarketRoute = pathname?.startsWith('/market-transaction');

  const getLastChatKey = (mode: 'ask-buddy' | 'market-transaction') => `lastChatId:${mode}`;
  const getLastChatId = (mode: 'ask-buddy' | 'market-transaction') => {
    try { return typeof window !== 'undefined' ? (localStorage.getItem(getLastChatKey(mode)) || null) : null; } catch { return null; }
  };
  const setLastChatId = (mode: 'ask-buddy' | 'market-transaction', id: string | null) => {
    try {
      if (typeof window === 'undefined') return;
      const k = getLastChatKey(mode);
      if (id) localStorage.setItem(k, id); else localStorage.removeItem(k);
    } catch { }
  };

  const fetchHistory = React.useCallback(async () => {
    if (!authUserId) return;
    let cancelled = false;
    setIsHistoryLoading(true);
    try {
      const isMarket = pathname?.startsWith('/market-transaction');
      const { data, error } = isMarket
        ? await buddyApi.getMarketChats(authUserId)
        : await buddyApi.getChats(authUserId);
      if (cancelled || !data || error) return;
      const mapped: HistoryConversation[] = data
        .map((chat: any, idx: number) => {
          const id = (chat && (chat._id || chat.id)) || String(idx);
          const msgs = Array.isArray(chat.messages) ? chat.messages : [];
          const firstMsg = msgs[0] as any | undefined;
          const firstMsgText = firstMsg?.text || firstMsg?.content || '';
          const title = chat.title || (firstMsgText ? firstMsgText.slice(0, 50) + (firstMsgText.length > 50 ? '...' : '') : `Chat ${idx + 1}`);
          const lastMsg = msgs[msgs.length - 1] as any | undefined;
          const subtitle = lastMsg?.text || lastMsg?.content || '';
          const createdAt: string | null = chat.created_at || chat.createdAt || null;
          return { id, title, subtitle, createdAt };
        })
        .sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
      setHistoryConversations(mapped);
    } finally {
      setIsHistoryLoading(false);
    }
    return () => { cancelled = true; };
  }, [authUserId, pathname]);

  React.useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  React.useEffect(() => {
    const onNewChat = () => { void fetchHistory(); };
    const onChatUpdated = () => { void fetchHistory(); };
    window.addEventListener('chat:new', onNewChat as EventListener);
    window.addEventListener('chat:updated', onChatUpdated as EventListener);
    return () => {
      window.removeEventListener('chat:new', onNewChat as EventListener);
      window.removeEventListener('chat:updated', onChatUpdated as EventListener);
    };
  }, [fetchHistory]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  };

  const handleNewChat = (chatType: 'ask-buddy' | 'market-transaction') => {
    const target = `/${chatType}` as Route;
    if (pathname?.startsWith(target)) {
      try { window.dispatchEvent(new CustomEvent('chat:new', { detail: { mode: chatType } })); } catch { }
    }
    // Clear persisted last-opened chat for this mode on +
    setLastChatId(chatType, null);
    setOpen(false);
    router.push(target);
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button aria-label="Open navigation" className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-[--color-neutral-800] bg-[--color-neutral-900] ${open ? 'hidden' : ''}`}>
          <Menu className="w-5 h-5 text-white" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] pointer-events-auto" suppressHydrationWarning />
        <Dialog.Content className="fixed left-0 top-0 h-full w-64 bg-[--color-neutral-950] border-r border-[--color-neutral-800] p-4 z-[61] text-white" suppressHydrationWarning>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="h-font text-lg text-white">
              <div className="flex items-center gap-2">
                <div className="shrink-0">
                  <Image src="/favicon.ico" alt="Proplens" width={32} height={32} className="object-contain" />
                </div>
                <span className="text-white font-semibold">Trial</span>
              </div>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close navigation" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[--color-neutral-800] bg-[--color-neutral-900]">
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-6 space-y-2">
            {sections.map(section => (
              <div key={section.id}>
                {singleSection ? (
                  <nav className="mt-1 space-y-1">
                    {section.items.map(it => {
                      const active = pathname?.startsWith(it.href);
                      const Icon = it.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                      // Check if this is a chat item that needs a + button
                      const isChatItem = it.label === 'Ask Buddy' || it.label === 'Transaction Data';
                      const chatType = it.label === 'Ask Buddy' ? 'ask-buddy' : 'market-transaction';

                      if (isChatItem) {
                        const lastId = getLastChatId(chatType);
                        const historyHref = lastId
                          ? (`/${chatType}?historyId=${lastId}` as Route)
                          : (it.href as Route);
                        return (
                          <div key={it.href} className="flex items-center gap-1">
                            <Link
                              href={historyHref}
                              onClick={() => setOpen(false)}
                              className={`group flex items-center gap-2 px-2 h-9 rounded-xl text-xs transition-colors border-l-transparent flex-1 ${active
                                ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                                : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                }`}
                              aria-current={active ? 'page' : undefined}
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
                          onClick={() => setOpen(false)}
                          className={`group flex items-center gap-2 px-2 h-9 rounded-xl text-xs transition-colors border-l-transparent w-full ${active
                            ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                            : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                            }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                          <span className="whitespace-nowrap">{it.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                ) : (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-2 h-9 rounded-lg text-xs text-[--color-neutral-300] hover:bg-white/5"
                      onClick={() => setOpenId(prev => prev === section.id ? null : section.id)}
                      aria-expanded={openId === section.id}
                    >
                      <span className="b-font text-white/90">{section.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openId === section.id ? 'rotate-180' : ''} text-white/70`} />
                    </button>
                    <nav className={`${openId === section.id ? 'block' : 'hidden'} mt-1 space-y-1`}>
                      {section.items.map(it => {
                        const active = pathname?.startsWith(it.href);
                        const Icon = it.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                        if (it.label === 'Chat History') {
                          return (
                            <div key={`${it.href}-history`} className="space-y-1">
                              <button
                                type="button"
                                className={`group flex items-center justify-between px-2 h-9 rounded-xl text-xs transition-colors border-l-transparent w-full ${historyOpen
                                  ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                                  : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                  }`}
                                onClick={() => setHistoryOpen(v => !v)}
                                aria-expanded={historyOpen}
                              >
                                <span className="flex items-center gap-2">
                                  <Icon className={`${historyOpen ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                                  <span className="whitespace-nowrap">{it.label}</span>
                                </span>
                                <ChevronDown className={`${historyOpen ? 'rotate-180' : ''} w-3 h-3 transition-transform text-[--color-neutral-400]`} />
                              </button>

                              {historyOpen && (
                                <div className="pt-1 space-y-1 max-h-72 overflow-auto sidebar-scroll">
                                  {isHistoryLoading && !historyConversations.length && (
                                    <div className="px-2 py-1.5 text-[11px] text-[--color-neutral-500]">
                                      Loading chats...
                                    </div>
                                  )}
                                  {!isHistoryLoading && !historyConversations.length && (
                                    <div className="px-2 py-1.5 text-[11px] text-[--color-neutral-500]">
                                      No chats yet
                                    </div>
                                  )}
                                  {historyConversations.map(c => {
                                    const hActive = historySelectedId === c.id;
                                    return (
                                      <button
                                        key={c.id}
                                        type="button"
                                        className={`group w-full text-left rounded-xl px-2 py-1.5 text-xs transition-colors ${hActive
                                          ? 'bg-white/10 text-white'
                                          : 'bg-transparent text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                          }`}
                                        onClick={() => {
                                          setHistorySelectedId(c.id);
                                          const basePath: Route = (isMarketRoute ? '/market-transaction' : '/ask-buddy') as Route;
                                          router.push(`${basePath}?historyId=${c.id}` as Route);
                                        }}
                                      >
                                        <div className="flex items-start gap-2">
                                          <MessageSquare
                                            className={`w-4 h-4 mt-0.5 ${hActive ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'}`}
                                            aria-hidden="true"
                                          />
                                          <div className="min-w-0 flex-1 text-left">
                                            <div className="flex items-center gap-1.5">
                                              <div className={`b-font font-semibold text-[12px] truncate flex-1 ${hActive ? 'text-white' : 'text-[--color-neutral-100]'}`}>
                                                {c.title}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                                              <Calendar
                                                className={`w-3.5 h-3.5 ${hActive ? 'text-[--color-neutral-200]' : 'text-[--color-neutral-500]'}`}
                                                aria-hidden="true"
                                              />
                                              <span className={`${hActive ? 'text-[--color-neutral-200]' : 'text-[--color-neutral-500]'} truncate`}>
                                                {c.createdAt ? formatDate(c.createdAt) : ''}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Check if this is a chat item that needs a + button
                        const isChatItem = it.label === 'Ask Buddy' || it.label === 'Transaction Data';
                        const chatType = it.label === 'Ask Buddy' ? 'ask-buddy' : 'market-transaction';

                        if (isChatItem) {
                          const lastId = getLastChatId(chatType);
                          const historyHref = lastId
                            ? (`/${chatType}?historyId=${lastId}` as Route)
                            : (it.href as Route);
                          return (
                            <div key={it.href} className="flex items-center gap-1">
                              <Link
                                href={historyHref}
                                onClick={() => setOpen(false)}
                                className={`group flex items-center gap-2 px-2 h-9 rounded-xl text-xs transition-colors border-l-transparent flex-1 ${active
                                  ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                                  : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                  }`}
                                aria-current={active ? 'page' : undefined}
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
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-2 px-2 h-9 rounded-xl text-xs transition-colors border-l-transparent w-full ${active
                              ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                              : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                              }`}
                            aria-current={active ? 'page' : undefined}
                          >
                            <Icon className={`${active ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                            <span className="whitespace-nowrap">{it.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-[--color-neutral-800] pt-3">
            <button
              className="w-full text-left px-2 py-2 rounded-lg text-xs text-[--color-neutral-300] hover:bg-white/5"
              onClick={() => { setOpen(false); router.push('/'); }}
              aria-label="Log out"
            >
              Log out
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
