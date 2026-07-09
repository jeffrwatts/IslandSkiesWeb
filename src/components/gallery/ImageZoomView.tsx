"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

const ZOOM_STEPS = [1, 2, 4, 8];
const SWIPE_THRESHOLD = 60;

export default function ImageZoomView({
  src,
  alt,
  onClose,
  onSwipeLeft,
  onSwipeRight,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const [displayScale, setDisplayScale] = useState<number | null>(null);
  const [baseRatio, setBaseRatio] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  // Keep swipe callbacks in refs so native listeners never go stale
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  useEffect(() => { onSwipeLeftRef.current = onSwipeLeft; }, [onSwipeLeft]);
  useEffect(() => { onSwipeRightRef.current = onSwipeRight; }, [onSwipeRight]);

  const computeBaseRatio = useCallback(() => {
    const img = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper || !img.naturalWidth) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const scaleX = wrapperRect.width / img.naturalWidth;
    const scaleY = wrapperRect.height / img.naturalHeight;
    setBaseRatio(Math.min(scaleX, scaleY));
    setDisplayScale(Math.min(scaleX, scaleY));
  }, []);

  // Reset zoom when navigating to a new image
  useEffect(() => {
    transformRef.current?.resetTransform(0);
  }, [src]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onSwipeRightRef.current?.();
      if (e.key === "ArrowRight") onSwipeLeftRef.current?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    function handleResize() {
      computeBaseRatio();
      transformRef.current?.resetTransform(0);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeBaseRatio]);

  // Native capture-phase listeners so we intercept before react-zoom-pan-pinch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    function onTouchStart(e: TouchEvent) {
      // Let buttons handle their own touches normally
      if ((e.target as Element).closest("button")) return;
      // Only intercept single-finger touches at fit scale
      if (e.touches.length !== 1) return;
      const isAtFitScale = (transformRef.current?.state.scale ?? 1) < 1.05;
      if (!isAtFitScale) return;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      // Block the library from starting a pan so the image doesn't move
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      if (!startX && !startY) return;
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      startX = 0;
      startY = 0;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) onSwipeLeftRef.current?.();
      else onSwipeRightRef.current?.();
    }

    // passive: false so we can call preventDefault() in touchstart
    el.addEventListener("touchstart", onTouchStart, { passive: false, capture: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart, { capture: true });
      el.removeEventListener("touchend", onTouchEnd, { capture: true });
    };
  }, []);

  const maxLibraryScale = baseRatio ? 8 / baseRatio : 20;

  function handlePillClick() {
    if (!baseRatio || !transformRef.current) return;
    const currentNativeScale = displayScale ?? baseRatio;
    const nextStep = ZOOM_STEPS.find((s) => s > currentNativeScale + 0.01);

    if (nextStep) {
      const libraryScale = nextStep / baseRatio;
      const wrapper = wrapperRef.current;
      const content = transformRef.current.instance.contentComponent;
      if (wrapper && content) {
        const wRect = wrapper.getBoundingClientRect();
        const cRect = content.getBoundingClientRect();
        const currentScale = transformRef.current.state.scale;
        const contentW = cRect.width / currentScale;
        const contentH = cRect.height / currentScale;
        const x = (wRect.width - contentW * libraryScale) / 2;
        const y = (wRect.height - contentH * libraryScale) / 2;
        transformRef.current.setTransform(x, y, libraryScale, 300);
      } else {
        transformRef.current.setTransform(0, 0, libraryScale, 300);
      }
    } else {
      transformRef.current.resetTransform(300);
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-black flex flex-col cursor-grab active:cursor-grabbing">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 backdrop-blur text-white text-lg hover:bg-white/25 transition-colors"
          aria-label="Close zoom view"
        >
          &times;
        </button>
        {displayScale !== null && (
          <button
            onClick={handlePillClick}
            className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-sm font-medium tabular-nums hover:bg-white/25 transition-colors cursor-pointer"
          >
            {displayScale.toFixed(2)}&times;
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center" ref={wrapperRef}>
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          maxScale={maxLibraryScale}
          centerOnInit
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          onTransform={(_ref, state) => {
            if (baseRatio !== null) {
              setDisplayScale(baseRatio * state.scale);
            }
          }}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              style={{ maxWidth: "100vw", maxHeight: "calc(100vh - 3.5rem)" }}
              onLoad={computeBaseRatio}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
