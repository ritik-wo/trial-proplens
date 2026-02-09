"use client";
import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChatThread, type ChatMessage } from '@/components/blocks/ChatThread';
import { buddyApi } from '@/lib/api';
import { useToast } from '@/components/providers/UiProviders';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { ChatInput } from '@/components/blocks/ChatInput';
import { ALLOWED_USERS } from '@/lib/mocks';

export interface ChatPageProps {
  title: string;
  description: string;
  welcomePlaceholder: string;
  bottomPlaceholder: string;
  thinkingIntro: string;
  thinkingMid: string;
  suggestedQuestions?: string[];
  initialHistoryConversationId?: string;
  mode?: 'ask-buddy' | 'market-transaction';
  marketName?: string;
  transactionType?: string;
}

export function ChatPage({
  title,
  description,
  welcomePlaceholder,
  bottomPlaceholder,
  thinkingIntro,
  thinkingMid,
  suggestedQuestions,
  initialHistoryConversationId,
  mode = 'ask-buddy',
  marketName,
  transactionType,
}: ChatPageProps) {
  const show = useToast();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const authUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || ALLOWED_USERS[2].id : ALLOWED_USERS[2].id;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const helpfulMapRef = useRef<Record<string, 'up' | 'down' | null>>({});
  const langMapRef = useRef<Record<string, string>>({});
  const [helpfulVersion, setHelpfulVersion] = useState(0);

  const welcomeInputRef = useRef<HTMLInputElement | null>(null);
  const bottomInputRef = useRef<HTMLInputElement | null>(null);
  const thinkingTimersRef = useRef<Record<string, number[]>>({});
  const thinkingActiveRef = useRef<Record<string, boolean>>({});
  const typingTimerRef = useRef<Record<string, number | null>>({});
  const controllerRef = useRef<AbortController | null>(null);
  const pendingIdRef = useRef<string | null>(null);
  const cancelledRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);
  const lastTextRef = useRef<string | null>(null);
  const suppressNextHistoryLoadRef = useRef<boolean>(false);
  const { isListening, toggle: toggleMic, stop: stopMic } = useSpeechRecognition({
    lang: 'en-US',
    interim: true,
    onInterim: (text) => setInputValue(text),
    onFinal: () => { },
    onError: (msg) => { setToastMsg(msg); setShowToast(true); },
  });



  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 1800);
    return () => clearTimeout(t);
  }, [showToast]);

  const lastHistoryIdRef = useRef<string | null>(null);
  const getLastChatKey = (mode: 'ask-buddy' | 'market-transaction') => `lastChatId:${mode}`;
  const setLastChatId = (id: string | null) => {
    try {
      if (typeof window === 'undefined') return;
      const k = getLastChatKey(mode);
      if (id) localStorage.setItem(k, id); else localStorage.removeItem(k);
    } catch { }
  };
  useEffect(() => {
    if (!authUserId) return;

    if (!initialHistoryConversationId) {
      if (lastHistoryIdRef.current !== null) {
        // We were previously on a chat with history, now switching to new chat
        lastHistoryIdRef.current = null;
        setConversationId(null);
        setMessages([]);
        setIsLoadingHistory(false);
      }
      return;
    }

    if (lastHistoryIdRef.current === initialHistoryConversationId) return;

    if (
      suppressNextHistoryLoadRef.current &&
      conversationId &&
      initialHistoryConversationId === conversationId
    ) {
      suppressNextHistoryLoadRef.current = false;
      return;
    }

    let cancelled = false;
    setIsLoadingHistory(true);
    setMessages([]);
    (async () => {
      const { data: chat, error } =
        mode === 'market-transaction'
          ? await buddyApi.getMarketChat(initialHistoryConversationId)
          : await buddyApi.getChat(initialHistoryConversationId);
      if (cancelled) return;
      if (error) {
        if ((error as any).status === 404) {
          show('This chat no longer exists.');
          lastHistoryIdRef.current = null;
          setConversationId(null);
          setMessages([]);
          try {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('historyId');
            const qs = params.toString();
            const url = qs ? `${pathname}?${qs}` : pathname;
            router.replace(url as any);
          } catch { }
        } else {
          console.error('Failed to load chat history:', error);
        }
        setIsLoadingHistory(false);
        return;
      }
      if (!chat || !Array.isArray(chat.messages)) {
        setIsLoadingHistory(false);
        return;
      }
      lastHistoryIdRef.current = initialHistoryConversationId;
      setConversationId(chat._id || chat.id || null);
      setSessionId(crypto.randomUUID?.() ?? String(Date.now()));
      setLastChatId(initialHistoryConversationId);

      const serverMessages: any[] = Array.isArray(chat.messages) ? [...chat.messages] : [];
      if (serverMessages.length === 1) {
        const first = serverMessages[0] || {};
        serverMessages.push({
          role: 'assistant',
          text: "For this chat, only the first message was saved. It looks like the previous request may have been canceled or interrupted. You can continue now",
          timestamp: first.timestamp || chat.created_at || new Date().toISOString(),
        });
      }

      const mapped: ChatMessage[] = serverMessages.map((m: any, idx: number) => {
        const rawRole = (m.role || '').toLowerCase();
        const role: 'user' | 'assistant' =
          rawRole === 'assistant' || rawRole === 'bot' ? 'assistant' : 'user';

        const parsed = parseImageUrls(m.text || m.content || '');

        return {
          id: m.id || String(idx),
          role,
          content: parsed.text,
          images: parsed.images,
          time: new Date(m.timestamp || chat.created_at || Date.now()).toLocaleTimeString(
            [],
            { hour: 'numeric', minute: '2-digit' },
          ),
        };
      });
      setMessages(mapped);
      setIsLoadingHistory(false);
    })();
    return () => { cancelled = true; setIsLoadingHistory(false); };
  }, [initialHistoryConversationId, authUserId, mode]);

  useEffect(() => {
    const onNewChat = (e: Event) => {
      const detail = (e as CustomEvent).detail as { mode?: 'ask-buddy' | 'market-transaction' } | undefined;
      lastHistoryIdRef.current = null;
      setConversationId(null);
      setMessages([]);
      setIsLoadingHistory(false);
      setLastChatId(null);
    };
    window.addEventListener('chat:new', onNewChat as EventListener);
    return () => window.removeEventListener('chat:new', onNewChat as EventListener);
  }, []);

  useEffect(() => {
    const el = messages.length === 0 ? welcomeInputRef.current : bottomInputRef.current;
    el?.focus();
  }, [messages.length]);

  function clearThinkingTimers(id: string) {
    const arr = thinkingTimersRef.current[id];
    if (arr) {
      arr.forEach(tid => clearTimeout(tid));
      delete thinkingTimersRef.current[id];
    }
  }

  async function handleSend() {
    await sendMessage(inputValue);
  }

  const handleSuggestedClick = useCallback(
    (q: string) => {
      if (isLoading || !authUserId) return;
      void sendMessage(q);
    },
    [isLoading, authUserId]
  );


  function clearTypingTimer(id: string) {
    const t = typingTimerRef.current[id];
    if (t) {
      window.clearInterval(t);
      delete typingTimerRef.current[id];
    }
  }

  function parseImageUrls(raw: string | undefined): { text: string; images: string[] } {
    const text = String(raw ?? '');
    const imgUrls: string[] = [];
    const re = /^\s*IMAGE_URL:\s*(\S+)\s*$/gim;
    let cleaned = text;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const url = m[1];
      if (url) imgUrls.push(url);
    }
    if (imgUrls.length > 0) {
      cleaned = text
        .split(/\r?\n/)
        .filter(line => !/^\s*IMAGE_URL:\s*\S+\s*$/i.test(line))
        .join('\n')
        .trim();
    }
    return { text: cleaned, images: imgUrls };
  }

  const cancelCurrentRequest = useCallback(() => {
    try { controllerRef.current?.abort(); } catch { }
    controllerRef.current = null;
    setIsLoading(false);
    cancelledRef.current = true;
    const pid = pendingIdRef.current;
    const uid = lastUserIdRef.current;
    if (pid) {
      clearThinkingTimers(pid);
      clearTypingTimer(pid);
      thinkingActiveRef.current[pid] = false;
      setMessages(prev => prev.filter(m => m.id !== pid && m.id !== uid));
    }
    if (lastTextRef.current != null) {
      setInputValue(lastTextRef.current);
    }
    pendingIdRef.current = null;
    lastUserIdRef.current = null;
    lastTextRef.current = null;
  }, []);

  function scheduleThinking(id: string) {
    const tids: number[] = [];
    const setContent = (updater: (prev: string) => string) => {
      if (!thinkingActiveRef.current[id]) return;
      setMessages(prev => prev.map(m => (m.id === id && m.pending) ? { ...m, content: updater(m.content) } : m));
    };
    setContent(() => thinkingIntro);
    tids.push(window.setTimeout(() => setContent(() => thinkingMid), 5000));
    tids.push(window.setTimeout(() => setContent(() => 'Thinking'), 10000));
    tids.push(window.setTimeout(() => setContent(() => 'Almost there'), 15000));
    tids.push(window.setTimeout(() => setContent(() => 'This is taking a while, thanks for your patience.'), 18000));
    thinkingActiveRef.current[id] = true;
    thinkingTimersRef.current[id] = tids;
  }

  async function sendMessage(text: string) {
    if (isListening) {
      try { stopMic(); } catch { }
    }
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const userId = crypto.randomUUID();
    const userMsg: ChatMessage = { id: userId, role: 'user', content: trimmed, time };
    const thinkingId = crypto.randomUUID();
    const thinkingMsg: ChatMessage = {
      id: thinkingId,
      role: 'assistant',
      content: thinkingIntro,
      time,
      pending: true,
    };

    setMessages(prev => [...prev, userMsg, thinkingMsg]);
    setInputValue("");
    setIsLoading(true);
    scheduleThinking(thinkingId);
    pendingIdRef.current = thinkingId;
    lastUserIdRef.current = userId;
    lastTextRef.current = text;

    let activeSessionId = sessionId ?? (crypto.randomUUID?.() ?? String(Date.now()));
    if (!sessionId) {
      setSessionId(activeSessionId);
    }
    let activeUserId = authUserId;
    let chatId = conversationId;
    if (!chatId) {
      const { data, error } =
        mode === 'market-transaction'
          ? await buddyApi.createMarketChat({
            userId: authUserId!,
            project_id: 'ea365bd5-afbb-48d3-a345-e9255655c841',
            channel: 'web',
            mode,
            messages: [
              {
                role: 'user',
                text: trimmed,
                timestamp: new Date().toISOString(),
              },
            ],
          })
          : await buddyApi.createChat({
            userId: authUserId!,
            project_id: 'ea365bd5-afbb-48d3-a345-e9255655c841',
            channel: 'web',
            mode,
            messages: [
              {
                role: 'user',
                text: trimmed,
                timestamp: new Date().toISOString(),
              },
            ],
          });
      if (data && data.chat_id) {
        chatId = data.chat_id;
        if (data.raw) {
          if (data.raw.user_id) {
            activeUserId = data.raw.user_id;
          }
        }
        setConversationId(data.chat_id);

        try {
          suppressNextHistoryLoadRef.current = true;
          const params = new URLSearchParams(searchParams.toString());
          params.set('historyId', data.chat_id);
          const qs = params.toString();
          const url = qs ? `${pathname}?${qs}` : pathname;
          router.replace(url as any);
          setLastChatId(data.chat_id);
          try { window.dispatchEvent(new CustomEvent('chat:updated')); } catch { }
        } catch { }
      } else if (error) {
        show(error.message || 'Failed to initialize chat');
        const errorMsg: ChatMessage = {
          id: thinkingId,
          role: 'assistant',
          content: 'It looks like your session has ended, so I couldn’t start the conversation. Please log in again to continue.',
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages(prev => prev.map(m => m.id === thinkingId ? errorMsg : m));
        setIsLoading(false);
        clearThinkingTimers(thinkingId);
        return;
      }
    }

    const ac = new AbortController();
    controllerRef.current = ac;

    const queryId = (crypto.randomUUID?.() ?? String(Date.now()));

    const { data, error } =
      mode === 'market-transaction'
        ? await buddyApi.runMarketTransaction({
          chat_id: chatId!,
          user_id: activeUserId!,
          query_id: queryId,
          sessionId: activeSessionId!,
          query: trimmed,
          market_name: marketName || 'singapore',
          transaction_type: transactionType || 'default-transaction',
        })
        : await buddyApi.runUserQuery({
          chat_id: chatId!,
          user_id: activeUserId!,
          query: trimmed,
          query_id: queryId,
          sessionId: activeSessionId!,
        });

    thinkingActiveRef.current[thinkingId] = false;
    clearThinkingTimers(thinkingId);
    controllerRef.current = null;

    if (cancelledRef.current || (error && ((error as any).code === 'ERR_CANCELED' || /cancel/i.test((error as any).message || '')))) {
      cancelledRef.current = false;
      return;
    }

    if (error) {
      console.log("Failed to get response", error)
      show(error.message || 'Failed to get response');
      const errorMsg: ChatMessage = {
        id: thinkingId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => prev.map(m => m.id === thinkingId ? errorMsg : m));
      clearThinkingTimers(thinkingId);
      setIsLoading(false);
      clearThinkingTimers(thinkingId);
      return;
    }

    if (data) {
      const backendText = (data as any).result || (data as any).response || (data as any).message || '';
      const backendImages = (data as any).images as string[] | undefined;
      const parsed = parseImageUrls(backendText);
      const fullText = parsed.text;
      const images = (backendImages && backendImages.length > 0) ? backendImages : parsed.images;
      setMessages(prev => prev.map(m => m.id === thinkingId ? {
        ...m,
        pending: false,
        typing: true,
        content: '',
        imagePlaceholderCount: images?.length || 0,
        images: undefined,
      } : m));

      const words = fullText.split(/(\s+)/);
      let idx = 0;
      const step = () => {
        idx++;
        const next = words.slice(0, idx).join('');
        setMessages(prev => prev.map(m => m.id === thinkingId ? { ...m, content: next } : m));
        if (idx >= words.length) {
          clearInterval(intervalId);
          delete typingTimerRef.current[thinkingId];
          setMessages(prev => prev.map(m => m.id === thinkingId ? {
            ...m,
            typing: false,
            images,
            imagePlaceholderCount: 0,
            time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          } : m));
          setIsLoading(false);
          pendingIdRef.current = null;
          try { window.dispatchEvent(new CustomEvent('chat:updated')); } catch { }
        }
      };
      const intervalId = window.setInterval(step, 20);
      typingTimerRef.current[thinkingId] = intervalId;
      clearThinkingTimers(thinkingId);
    }
  }

  const handleMicClick = useCallback((e: React.MouseEvent) => {
    toggleMic();
    setToastMsg(!isListening ? 'Voice input started' : 'Voice input stopped');
    setShowToast(true);
  }, [toggleMic, isListening]);

  return (
    <div className="relative min-h-0">
      <div className="fixed bottom-[120px] left-0 right-0 md:left-56 overflow-y-auto" style={{ top: 'var(--app-header-offset, 0px)' }}>
        {messages.length === 0 ? (
          <div className="container-max h-full flex items-center justify-center px-4">
            {isLoadingHistory ? (
              <div className="w-full max-w-[920px] text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[--color-neutral-900]"></div>
                  <span className="text-[16px] text-[--color-neutral-700]">Loading conversations...</span>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[920px] text-center">
                <h1 className="h-font text-[22px] md:text-[24px] font-normal tracking-[-0.01em] text-[--color-neutral-900] mb-3">{title}</h1>
                <p className="b-font text-[15px] leading-6 text-[--color-neutral-700] mb-5">{description}</p>

                {suggestedQuestions && suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSuggestedClick(q)}
                        className="px-3 py-1.5 rounded-full border border-[--color-neutral-200] bg-white text-[13px] text-[--color-neutral-800] shadow-sm hover:bg-[--color-neutral-50] focus:outline-none"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mx-auto w-full max-w-[1080px]">
                  <ChatInput
                    variant="welcome"
                    inputRef={welcomeInputRef as any}
                    placeholder={welcomePlaceholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onSend={handleSend}
                    onCancel={cancelCurrentRequest}
                    isLoading={isLoading}
                    isListening={isListening}
                    onMicClick={handleMicClick}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-10 md:pt-6 max-w-[920px] md:max-w-[960px] mx-auto">
            <ChatThread
              messages={messages as ChatMessage[]}
              containerClassName="px-4 md:px-6"
              helpfulState={{
                get: (id) => helpfulMapRef.current[id],
                set: (id, v) => {
                  helpfulMapRef.current[id] = v;
                  setHelpfulVersion((x) => x + 1);
                },
              }}
              langState={{
                get: (id) => langMapRef.current[id],
                set: (id, code) => { langMapRef.current[id] = code; },
              }}
              onCopyMessage={(m) => navigator.clipboard?.writeText(m.content)}
              isHistory={!!initialHistoryConversationId}
              key={helpfulVersion}
            />
          </div>
        )}
      </div>

      {messages.length > 0 && conversationId && (
        <div
          className={
            `fixed bottom-0 left-0 right-0 md:left-56 px-4 md:px-6 pt-4 pb-6 bg-white border-t border-[--color-neutral-200]`
          }
        >
          <div className="mx-auto w-full max-w-[920px] md:max-w-[960px] min-w-0">
            <div className="h-11">
              <ChatInput
                inputRef={bottomInputRef as any}
                placeholder={bottomPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSend={handleSend}
                onCancel={cancelCurrentRequest}
                isLoading={isLoading}
                isListening={isListening}
                onMicClick={handleMicClick}
              />
            </div>
            <p className="mt-2 text-[11px] leading-4 text-center text-[--color-neutral-600]">
              {mode == "ask-buddy" ? "AI Assistant can make mistakes. Please verify critical information." : `AI Assistant can make mistakes. Please verify critical information. Transaction data is provided on an as-is basis from publicly available Reidin data.`}
            </p>
          </div>
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 select-none">
          <div className="flex items-center gap-2 rounded-xl bg-white border border-[--color-neutral-200] shadow px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[--color-neutral-900]"><path d="M20 6 9 17l-5-5" /></svg>
            <span className="text-[13px] text-[--color-neutral-900]">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
