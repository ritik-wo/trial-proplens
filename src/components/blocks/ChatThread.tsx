"use client";
import * as React from 'react';
import clsx from 'clsx';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });
import { FeedbackFooter } from '@/components/blocks/FeedbackFooter';
import { ImageLightbox } from '@/components/blocks/ImageLightbox';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time?: string;
  images?: string[];
  pending?: boolean;
  danger?: boolean;
  typing?: boolean;
  imagePlaceholderCount?: number;
};

export type HelpfulState = {
  get: (id: string) => 'up' | 'down' | null | undefined;
  set: (id: string, v: 'up' | 'down' | null) => void;
};

export type LangState = {
  get: (id: string) => string | undefined;
  set: (id: string, code: string) => void;
};

export function ChatThread({
  messages,
  className,
  containerClassName,
  autoScroll = true,
  helpfulState,
  langState,
  onCopyMessage,
  isHistory = false,
}: {
  messages: ChatMessage[];
  className?: string;
  containerClassName?: string;
  autoScroll?: boolean;
  helpfulState?: HelpfulState;
  langState?: LangState;
  onCopyMessage?: (m: ChatMessage) => void;
  isHistory?: boolean;
}) {
  const endRef = React.useRef<HTMLDivElement | null>(null);
  const [lightboxImages, setLightboxImages] = React.useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const normalizeBullets = React.useCallback((text: string) => {
    const rawLines = text.split(/\r?\n/);
    const out: string[] = [];
    let lastWasHeaderBullet = false;

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];

      if (/^\s*\d+\.[\t ]+.+$/.test(line)) {
        out.push(`**${line.trim()}**`);
        lastWasHeaderBullet = false;
        continue;
      }

      const bul = line.match(/^(\s*)([•◦○])\s+(.*)$/);
      if (bul) {
        const indent = bul[1] || '';
        const rest = bul[3] || '';
        const isHeaderish = /:\s*$/.test(rest) || /^\d+\./.test(rest);
        out.push(`${indent}- ${isHeaderish ? `**${rest}**` : rest}`);
        lastWasHeaderBullet = true;
        continue;
      }

      const hy = line.match(/^\s*[-\u2013\u2014]\s+(.*)$/);
      if (hy) {
        const content = hy[1];
        if (lastWasHeaderBullet) {
          out.push(`  - ${content}`);
        } else {
          out.push(`- ${content}`);
        }
        lastWasHeaderBullet = false;
        continue;
      }

      out.push(line);
      if (line.trim() !== '') lastWasHeaderBullet = false;
    }
    const joined = out
      .join('\n')
      .replace(/(-\s+\*\*.*?:\*\*)\n(\s*[-\u2013\u2014]\s)/g, '$1\n\n$2');
    return joined;
  }, []);

  React.useEffect(() => {
    if (!autoScroll) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, autoScroll]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImages(null);
  };

  return (
    <div className={clsx('px-4 md:px-6', containerClassName)}>
      <div className={clsx('space-y-4', className)}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              m.role === 'user'
                ? 'flex justify-end first:mt-8 md:first:mt-0'
                : 'flex justify-start first:mt-4 md:first:mt-0'
            )}
          >
            {m.role === 'user' ? (
              <div className="max-w-[80%] rounded-2xl bg-[--color-neutral-900] text-white px-4 py-2 shadow">
                <p className="text-[14px] leading-6 break-words whitespace-pre-wrap">{m.content}</p>
                {m.time && (
                  <div className="text-[11px] opacity-75 mt-1 text-right">{m.time}</div>
                )}
              </div>
            ) : (
              <div className="assistant-message max-w-[92%] md:max-w-[80%] px-0 py-0 whitespace-normal break-words">
                {m.pending ? (
                  <div className={"text-[14px] flex items-center " + (m.danger ? "text-[--color-danger]" : "text-[--color-neutral-700]")}>
                    <span>{m.content}</span>
                    {!m.danger && (<span className="thinking-dots" aria-hidden></span>)}
                  </div>
                ) : (
                  <div 
                    className="chat-markdown text-[14px]"
                    dangerouslySetInnerHTML={{ __html: marked.parse(normalizeBullets(m.content)) as string }}
                  />
                )}
                {m.typing && (m.imagePlaceholderCount ?? 0) > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: m.imagePlaceholderCount ?? 0 }).map((_, idx) => (
                      <div key={idx} className="aspect-square rounded-lg bg-[--color-neutral-200] animate-pulse" />
                    ))}
                  </div>
                )}
                
                {!m.typing && m.images && m.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {m.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => openLightbox(m.images!, idx)}
                        className="relative aspect-square rounded-lg overflow-hidden border border-[--color-neutral-200] hover:border-[--color-primary] transition-colors group"
                      >
                        <img
                          src={img}
                          alt={`Attachment ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
                
                {!m.pending && !m.typing && (
                  <div className="mt-3 pt-3 border-t border-[--color-neutral-200]">
                    <FeedbackFooter
                      key={m.id + ':' + (helpfulState?.get(m.id) ?? '')}
                      wasHelpful={helpfulState?.get(m.id) ?? null}
                      onHelpfulChange={(v) => helpfulState?.set(m.id, v)}
                      valueLanguage={langState?.get(m.id)}
                      onChangeLanguage={(code) => langState?.set(m.id, code)}
                      onCopy={() => onCopyMessage?.(m)}
                      isHistory={isHistory}
                    />
                    {m.time && (
                      <div className="text-[11px] text-[--color-neutral-600] mt-2">{m.time}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      
      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
