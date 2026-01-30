"use client";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastOffsetRef = React.useRef({ x: 0, y: 0 });
  const pinchRef = React.useRef<{ dist: number; scale: number } | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const applyZoom = (next: number) => {
    const clamped = clamp(next, 1, 4);
    setScale(clamped);
    if (clamped === 1) {
      setOffset({ x: 0, y: 0 });
      lastOffsetRef.current = { x: 0, y: 0 };
    }
  };
  const zoomIn = () => applyZoom(scale + 0.25);
  const zoomOut = () => applyZoom(scale - 0.25);
  const resetZoom = () => applyZoom(1);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (scale === 1) return;
    setDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const next = { x: lastOffsetRef.current.x + dx, y: lastOffsetRef.current.y + dy };
    setOffset(next);
  };
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!dragging) return;
    lastOffsetRef.current = offset;
    setDragging(false);
    dragStartRef.current = null;
  };

  const distance = (t1: { clientX: number; clientY: number }, t2: { clientX: number; clientY: number }) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 2) {
      const dist = distance(e.touches[0], e.touches[1]);
      pinchRef.current = { dist, scale };
    } else if (e.touches.length === 1 && scale > 1) {
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const newDist = distance(e.touches[0], e.touches[1]);
      const factor = newDist / pinchRef.current.dist;
      applyZoom(pinchRef.current.scale * factor);
    } else if (e.touches.length === 1 && dragStartRef.current && scale > 1) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      const next = { x: lastOffsetRef.current.x + dx, y: lastOffsetRef.current.y + dy };
      setOffset(next);
    }
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (pinchRef.current) pinchRef.current = null;
    if (dragStartRef.current) {
      lastOffsetRef.current = offset;
      dragStartRef.current = null;
    }
  };

  React.useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
    dragStartRef.current = null;
    pinchRef.current = null;
  }, [currentIndex]);

  return createPortal(
    <div 
      className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[71] w-[min(90vw,1000px)] px-2">
        <div className="flex items-center justify-end gap-3">
          {images.length > 1 && (
            <div className="text-white text-sm bg-black/60 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button type="button" size="icon" variant="outline" className="h-9 w-9 bg-white/90" onClick={(e) => { e.stopPropagation(); zoomOut(); }} aria-label="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button type="button" size="icon" variant="outline" className="h-9 w-9 bg-white/90" onClick={(e) => { e.stopPropagation(); zoomIn(); }} aria-label="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button type="button" size="icon" variant="outline" className="h-9 w-9 bg-white/90" onClick={(e) => { e.stopPropagation(); resetZoom(); }} aria-label="Reset zoom">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 z-[71] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 z-[71] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div 
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="presentation"
        aria-label="Image viewer"
      >
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className={"max-w-full max-h-[90vh] object-contain rounded-lg select-none " + (dragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-auto")}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transition: dragging ? 'none' : 'transform 120ms ease' }}
          draggable={false}
        />
      </div>
    </div>,
    typeof document !== 'undefined' ? document.body : ({} as any)
  );
}
