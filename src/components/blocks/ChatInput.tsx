"use client";
import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { Mic, Send, CircleStop } from 'lucide-react';
import clsx from 'clsx';

export type ChatInputVariant = 'welcome' | 'footer';

export interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isListening?: boolean;
  onMicClick?: (e: React.MouseEvent) => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
  variant?: ChatInputVariant;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onCancel,
  isLoading = false,
  isListening = false,
  onMicClick,
  placeholder = 'Ask anything',
  inputRef,
  className,
  variant = 'footer',
}: ChatInputProps){
  const containerBase = variant === 'welcome'
    ? 'relative h-10 rounded-xl bg-white border border-[--color-neutral-200] flex items-center'
    : 'relative h-full rounded-xl bg-white border border-[--color-neutral-200] flex items-center';

  const inputClasses = 'h-full !py-0 flex-1 bg-white !border-0 border-transparent pl-5 pr-24 text-[14px] text-[--color-neutral-900] placeholder:text-[--color-neutral-600] outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none rounded-xl';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLoading) onCancel(); else onSend();
    }
  };

  return (
    <div className={clsx(containerBase, className)}>
      <Input
        ref={inputRef as any}
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className={inputClasses}
      />
      <button
        type="button"
        title="Speak"
        aria-label="Voice input"
        aria-pressed={isListening}
        onClick={onMicClick}
        className={clsx(
          'absolute right-14 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors border-0',
          isListening ? 'bg-[--color-primary]/10' : 'hover:bg-[--color-neutral-100]'
        )}
      >
        <Mic
          size={17}
          color={isListening ? 'var(--color-primary)' : 'var(--color-neutral-700)'}
          stroke={isListening ? 'var(--color-primary)' : 'var(--color-neutral-700)'}
          strokeWidth={2.2}
        />
      </button>
      <div className="absolute right-[52px] top-1/2 -translate-y-1/2 h-6 w-px bg-[--color-neutral-300]"></div>
      <button
        type="button"
        onClick={isLoading ? onCancel : onSend}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[--color-neutral-900] hover:opacity-90 text-white flex items-center justify-center border-0"
        aria-label={isLoading ? 'Cancel request' : 'Send message'}
      >
        {isLoading ? (
          <CircleStop size={16} color="white" strokeWidth={2.4} />
        ) : (
          <Send size={16} color="white" strokeWidth={2.4} />
        )}
      </button>
    </div>
  );
}
