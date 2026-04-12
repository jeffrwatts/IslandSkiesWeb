"use client";

import { useState, useRef, useCallback } from "react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function ImageCompare({
  leftSrc,
  rightSrc,
  leftLabel,
  rightLabel,
  caption,
  alt,
}: {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  caption?: string;
  alt: string;
}) {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSplit = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateSplit(e.clientX);
    },
    [updateSplit]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updateSplit(e.clientX);
    },
    [updateSplit]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const leftUrl = getCloudinaryUrl(leftSrc);
  const rightUrl = getCloudinaryUrl(rightSrc);

  return (
    <figure className="my-10">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg select-none cursor-col-resize"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Right image (base layer) */}
        <img src={rightUrl} alt={alt} className="block w-full h-auto" draggable={false} />

        {/* Left image (clipped overlay) */}
        <img
          src={leftUrl}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          draggable={false}
        />

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white"
          style={{ left: `${split}%`, transform: "translateX(-50%)" }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 w-10 h-10 -translate-y-1/2 rounded-full bg-white/90 border-2 border-white flex items-center justify-center shadow-lg"
          style={{ left: `${split}%`, transform: `translateX(-50%) translateY(-50%)` }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-800">
            <path d="M5 3L1 8L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L15 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Labels */}
        {leftLabel && (
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {leftLabel}
          </span>
        )}
        {rightLabel && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {rightLabel}
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-lg text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
