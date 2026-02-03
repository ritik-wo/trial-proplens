"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';
import { Avatar } from '../ui/Avatar';
import { LogOut, ChevronDown, Search, MessageSquare, Calendar, Edit3, Plus, BarChart3 } from 'lucide-react';
import { getSectionsForRole } from '@/lib/roleMenu';
import { useAuthRole } from '@/components/providers/AuthRoleProvider';
import type { Route } from 'next';
import { ConfirmDeleteDialog } from '@/components/feedback/ConfirmDeleteDialog';
import { tokenService } from '@/lib/api/tokenService';
import { Input } from '@/components/ui/Input';
import { buddyApi } from '@/lib/api';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuthRole();
  const sections = getSectionsForRole(role);
  const singleSection = sections.length === 1;
  const [openIds, setOpenIds] = React.useState<string[]>(sections[0]?.id ? [sections[0].id] : []);
  React.useEffect(() => { setOpenIds(sections[0]?.id ? [sections[0].id] : []); }, [role]);
  type HistoryConversation = { id: string; title: string; subtitle: string; createdAt: string | null };

  const [historyQ, setHistoryQ] = React.useState('');
  const [historySelectedId, setHistorySelectedId] = React.useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const authUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '67fe0defb1bb16718f027aab' : '67fe0defb1bb16718f027aab';
  const isMarketRoute = pathname?.startsWith('/market-transaction');
  const [historyMode, setHistoryMode] = React.useState<'ask-buddy' | 'market-transaction'>(isMarketRoute ? 'market-transaction' : 'ask-buddy');
  const [clientReady, setClientReady] = React.useState(false);
  const [lastIdMap, setLastIdMap] = React.useState<{ 'ask-buddy': string | null; 'market-transaction': string | null }>({ 'ask-buddy': null, 'market-transaction': null });

  const [historyConversations, setHistoryConversations] = React.useState<HistoryConversation[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);
  const preferredHistoryId = React.useMemo(() => {
    if (!historyConversations.length) return null;
    const validIds = new Set(historyConversations.map(c => c.id));
    if (historySelectedId && validIds.has(historySelectedId)) return historySelectedId;
    return historyConversations[0]?.id || null;
  }, [historySelectedId, historyConversations]);

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
    // Read persisted last chat IDs on mount only (client-side) to avoid hydration mismatch
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

  const fetchHistory = React.useCallback(async (overrideMode?: 'ask-buddy' | 'market-transaction') => {
    if (!authUserId) return;
    let cancelled = false;
    setIsHistoryLoading(true);
    try {
      const modeToUse = overrideMode || historyMode;
      const { data, error } = modeToUse === 'market-transaction'
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
  }, [authUserId, historyMode]);

  React.useEffect(() => {
    // sync mode with route on route change
    setHistoryMode(pathname?.startsWith('/market-transaction') ? 'market-transaction' : 'ask-buddy');
  }, [pathname]);

  React.useEffect(() => {
    // initial and mode-change based fetch with visible loading
    setIsHistoryLoading(true);
    setHistoryConversations([]);
    void fetchHistory();
  }, [fetchHistory, historyMode]);

  React.useEffect(() => {
    // re-fetch when a new chat is initiated via plus button on the same route
    const onNewChat = () => { void fetchHistory(); };
    const onChatUpdated = () => { void fetchHistory(); };
    window.addEventListener('chat:new', onNewChat as EventListener);
    window.addEventListener('chat:updated', onChatUpdated as EventListener);
    return () => {
      window.removeEventListener('chat:new', onNewChat as EventListener);
      window.removeEventListener('chat:updated', onChatUpdated as EventListener);
    };
  }, [fetchHistory]);

  const filteredHistory = React.useMemo(() => {
    const s = historyQ.trim().toLowerCase();
    if (!s) return historyConversations;
    return historyConversations.filter(c =>
      c.title.toLowerCase().includes(s) || c.subtitle.toLowerCase().includes(s)
    );
  }, [historyQ, historyConversations]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  };

  const handleNewChat = (chatType: 'ask-buddy' | 'market-transaction') => {
    const target = `/${chatType}` as Route;
    // If already on the target route (no query change), signal ChatPage to reset
    if (pathname?.startsWith(target)) {
      try { window.dispatchEvent(new CustomEvent('chat:new', { detail: { mode: chatType } })); } catch { }
    }
    // Clear persisted last-opened chat for this mode
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
              // Render items directly without section title/chevron when only one section exists
              <div className="mt-1 space-y-1">
                {section.items.map(it => {
                  const active = pathname === it.href || pathname?.startsWith(it.href + '/') || pathname?.startsWith(it.href + '?');
                  const Icon = it.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                  // Check if this is a chat item that needs a + button
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
                        <div key={`${it.href}-history`} className="space-y-1">
                          <div
                            className={`group flex items-center justify-between px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent w-full ${historyOpen
                              ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                              : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                              }`}
                            onClick={() => setHistoryOpen(v => !v)}
                            role="button"
                            tabIndex={0}
                            aria-expanded={historyOpen}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHistoryOpen(v => !v); } }}
                          >
                            <span className="flex items-center gap-2">
                              <Icon className={`${historyOpen ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                              <span className="whitespace-nowrap">{it.label}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsHistoryLoading(true); setHistoryConversations([]); setHistoryMode('ask-buddy'); void fetchHistory('ask-buddy'); }}
                                title="Show Ask Buddy history"
                                aria-label="Show Ask Buddy history"
                                className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${historyMode === 'ask-buddy' ? 'bg-white/15 text-white' : 'text-[--color-neutral-400] hover:text-[--color-neutral-200] hover:bg-white/5'}`}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsHistoryLoading(true); setHistoryConversations([]); setHistoryMode('market-transaction'); void fetchHistory('market-transaction'); }}
                                title="Show Transaction Data history"
                                aria-label="Show Transaction Data history"
                                className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${historyMode === 'market-transaction' ? 'bg-white/15 text-white' : 'text-[--color-neutral-400] hover:text-[--color-neutral-200] hover:bg-white/5'}`}
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                              </button>
                              <ChevronDown className={`${historyOpen ? 'rotate-180' : ''} w-3 h-3 transition-transform text-[--color-neutral-400]`} />
                            </span>
                          </div>

                          {historyOpen && (
                            <div className="pt-1 space-y-1">
                              {/* <div className="h-8 rounded-full bg-white border border-[--color-neutral-300] shadow-sm px-3 flex items-center gap-2 mb-1">
                                <Search className="w-4 h-4 text-[--color-neutral-500]" aria-hidden="true" />
                                <Input
                                  placeholder="Search conversations..."
                                  value={historyQ}
                                  onChange={(e)=>setHistoryQ(e.target.value)}
                                  className="h-7 bg-transparent border-0 px-0 !outline-none !focus:outline-none !focus-visible:outline-none !ring-0 !focus:ring-0 !focus-visible:ring-0 focus:border-transparent shadow-none text-[13px] text-[--color-neutral-900]"
                                />
                              </div> */}
                              <nav className="max-h-[300px] overflow-auto space-y-1 pr-1 sidebar-scroll custom-scrollbar">
                                {isHistoryLoading && !historyConversations.length && (
                                  <div className="px-2 py-1.5 text-[11px] text-[--color-neutral-500]">
                                    Loading conversations...
                                  </div>
                                )}
                                {!isHistoryLoading && !filteredHistory.length && (
                                  <div className="px-2 py-1.5 text-[11px] text-[--color-neutral-500]">
                                    No chats yet
                                  </div>
                                )}
                                {filteredHistory.map(c => {
                                  const hActive = historySelectedId === c.id;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      title={c.title}
                                      className={`group w-full text-left rounded-xl px-2 py-1.5 text-xs transition-colors ${hActive
                                        ? 'bg-white/10 text-white'
                                        : 'bg-transparent text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                        }`}
                                      onClick={() => {
                                        setHistorySelectedId(c.id);
                                        const basePath: Route = (historyMode === 'market-transaction' ? '/market-transaction' : '/ask-buddy') as Route;
                                        try { setLastChatId(isMarketRoute ? 'market-transaction' : 'ask-buddy', c.id); } catch { }
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
                                            <span className={`truncate ${hActive ? 'text-[--color-neutral-200]' : 'text-[--color-neutral-500]'}`}>
                                              {c.createdAt ? formatDate(c.createdAt) : ''}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </nav>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Check if this is a chat item that needs a + button
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
