"use client";
import * as React from "react";
import clsx from "clsx";

export function TypedPitch({
  text,
  speed = 18,
  className,
  restartKey,
  onTypingChange,
  containerRef
}: {
  text: string;
  speed?: number;
  className?: string;
  restartKey?: React.DependencyList | string | number | boolean | null;
  onTypingChange?: (typing: boolean) => void;
  containerRef?: React.RefObject<HTMLElement>;
}) {
  const [shown, setShown] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  React.useEffect(() => {
    setShown("");
    let i = 0;
    const len = text.length;
    if (!len) return;
    onTypingChange?.(true);
    setTyping(true);
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (containerRef?.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
      if (i >= len) {
        window.clearInterval(id);
        onTypingChange?.(false);
        setTyping(false);
      }
    }, Math.max(1, speed));
    return () => window.clearInterval(id);
  }, [restartKey]);

  React.useEffect(() => {
    if (!typing) {
      setShown(text);
      if (containerRef?.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, typing]);

  return (
    <pre className={clsx("whitespace-pre-wrap b-font text-[15px] text-[--color-neutral-900] leading-7", className)}>
      {shown}
    </pre>
  );
}
