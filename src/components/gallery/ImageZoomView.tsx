"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

const ZOOM_STEPS = [1, 2, 4, 8];

export default function ImageZoomView({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [displayScale, setDisplayScale] = useState<number | null>(null);
  const [baseRatio, setBaseRatio] = useState<number | null>(null);
  const [atFitScale, setAtFitScale] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

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
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    function handleResize() {
      computeBaseRatio();
      transformRef.current?.resetTransform(0);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeBaseRatio]);

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
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Top bar */}
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

      {/* Prev arrow */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white text-5xl p-2"
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}

      {/* Next arrow */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white text-5xl p-2"
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}

      <div className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing" ref={wrapperRef}>
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          maxScale={maxLibraryScale}
          centerOnInit
          panning={{ disabled: atFitScale }}
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          onTransform={(_ref, state) => {
            if (baseRatio !== null) {
              setDisplayScale(baseRatio * state.scale);
              setAtFitScale(state.scale < 1.05);
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
