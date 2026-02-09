"use client";
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Calendar, ChevronDown, BarChart3 } from 'lucide-react';
import { buddyApi } from '@/lib/api';
import { ALLOWED_USERS } from '@/lib/mocks';
import type { Route } from 'next';

type HistoryConversation = {
    id: string;
    title: string;
    subtitle: string;
    createdAt: string | null;
};

interface ChatHistorySidebarProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
}

export function ChatHistorySidebar({ Icon, label }: ChatHistorySidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const authUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || ALLOWED_USERS[2].id : ALLOWED_USERS[2].id;
    const isMarketRoute = pathname?.startsWith('/market-transaction');

    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [historyMode, setHistoryMode] = React.useState<'ask-buddy' | 'market-transaction'>(isMarketRoute ? 'market-transaction' : 'ask-buddy');
    const [historyConversations, setHistoryConversations] = React.useState<HistoryConversation[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);
    const [historySelectedId, setHistorySelectedId] = React.useState<string | null>(null);
    const lastFetchedModeRef = React.useRef<'ask-buddy' | 'market-transaction' | null>(null);

    const getLastChatKey = (mode: 'ask-buddy' | 'market-transaction') => `lastChatId:${mode}`;
    const setLastChatId = (mode: 'ask-buddy' | 'market-transaction', id: string | null) => {
        try {
            if (typeof window === 'undefined') return;
            const k = getLastChatKey(mode);
            if (id) localStorage.setItem(k, id); else localStorage.removeItem(k);
        } catch { }
    };

    const fetchHistory = React.useCallback(async (modeToUse: 'ask-buddy' | 'market-transaction', force = false) => {
        if (!authUserId) return;
        if (!force && lastFetchedModeRef.current === modeToUse) return;
        lastFetchedModeRef.current = modeToUse;

        setIsHistoryLoading(true);
        setHistoryConversations([]);
        try {
            const { data, error } = modeToUse === 'market-transaction'
                ? await buddyApi.getMarketChats(authUserId)
                : await buddyApi.getChats(authUserId);
            if (!data || error) return;
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
    }, [authUserId]);

    React.useEffect(() => {
        const newMode = pathname?.startsWith('/market-transaction') ? 'market-transaction' : 'ask-buddy';
        setHistoryMode(newMode);
        if (lastFetchedModeRef.current !== newMode) {
            void fetchHistory(newMode);
        }
    }, [pathname, fetchHistory]);

    React.useEffect(() => {
        const onNewChat = () => {
            void fetchHistory(historyMode, true);
        };
        const onChatUpdated = () => {
            void fetchHistory(historyMode, true);
        };
        window.addEventListener('chat:new', onNewChat as EventListener);
        window.addEventListener('chat:updated', onChatUpdated as EventListener);
        return () => {
            window.removeEventListener('chat:new', onNewChat as EventListener);
            window.removeEventListener('chat:updated', onChatUpdated as EventListener);
        };
    }, [fetchHistory, historyMode]);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2);
        return `${dd}-${mm}-${yy}`;
    };

    return (
        <div className="space-y-1">
            <div
                className={`group flex items-center justify-between px-2 h-8 rounded-xl text-xs transition-colors border-l-transparent w-full ${historyOpen
                    ? 'bg-white/10 border-l-2 border-white text-white font-medium'
                    : 'text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                    }`}
            >
                <button
                    type="button"
                    className="flex items-center gap-2 flex-1 h-full cursor-pointer"
                    onClick={() => setHistoryOpen(v => !v)}
                    aria-expanded={historyOpen}
                    aria-label={historyOpen ? 'Collapse chat history' : 'Expand chat history'}
                >
                    <Icon className={`${historyOpen ? 'text-white' : 'text-[--color-neutral-500] group-hover:text-[--color-neutral-300]'} w-4 h-4`} aria-hidden="true" />
                    <span className="whitespace-nowrap">{label}</span>
                </button>

                <span className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setHistoryMode('ask-buddy'); void fetchHistory('ask-buddy', true); }}
                        title="Show Ask Buddy history"
                        aria-label="Show Ask Buddy history"
                        className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${historyMode === 'ask-buddy' ? 'bg-white/15 text-white' : 'text-[--color-neutral-400] hover:text-[--color-neutral-200] hover:bg-white/5'}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setHistoryMode('market-transaction'); void fetchHistory('market-transaction', true); }}
                        title="Show Transaction Data history"
                        aria-label="Show Transaction Data history"
                        className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${historyMode === 'market-transaction' ? 'bg-white/15 text-white' : 'text-[--color-neutral-400] hover:text-[--color-neutral-200] hover:bg-white/5'}`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setHistoryOpen(v => !v)}
                        className="flex items-center justify-center w-4 h-4 cursor-pointer"
                        aria-label={historyOpen ? 'Collapse' : 'Expand'}
                    >
                        <ChevronDown className={`${historyOpen ? 'rotate-180' : ''} w-3 h-3 transition-transform text-[--color-neutral-400]`} />
                    </button>
                </span>
            </div>

            {historyOpen && (
                <div className="pt-1 space-y-1">
                    <nav className="max-h-[300px] overflow-auto space-y-1 pr-1 sidebar-scroll custom-scrollbar">
                        {isHistoryLoading && !historyConversations.length && (
                            <div className="px-2 py-1.5 text-[11px] text-[--color-neutral-500]">
                                Loading conversations...
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
                                    title={c.title}
                                    className={`group w-full text-left rounded-xl px-2 py-1.5 text-xs transition-colors ${hActive
                                        ? 'bg-white/10 text-white'
                                        : 'bg-transparent text-[--color-neutral-400] hover:bg-white/5 hover:text-[--color-neutral-200]'
                                        }`}
                                    onClick={() => {
                                        setHistorySelectedId(c.id);
                                        const basePath: Route = (historyMode === 'market-transaction' ? '/market-transaction' : '/ask-buddy') as Route;
                                        try { setLastChatId(historyMode, c.id); } catch { }
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
