"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

// Native scale steps: 1x, 2x, 4x, 8x, then back to fit
const ZOOM_STEPS = [1, 2, 4, 8];

export default function ImageZoomView({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [displayScale, setDisplayScale] = useState<number | null>(null);
  const [baseRatio, setBaseRatio] = useState<number | null>(null);
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
    const fitScale = Math.min(scaleX, scaleY);

    setBaseRatio(fitScale);
    setDisplayScale(fitScale);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("resize", computeBaseRatio);
    return () => window.removeEventListener("resize", computeBaseRatio);
  }, [computeBaseRatio]);

  const maxLibraryScale = baseRatio ? 8 / baseRatio : 20;

  function handlePillClick() {
    if (!baseRatio || !transformRef.current) return;

    const currentNativeScale = displayScale ?? baseRatio;

    // Find the next step above the current native scale
    const nextStep = ZOOM_STEPS.find((s) => s > currentNativeScale + 0.01);

    if (nextStep) {
      const libraryScale = nextStep / baseRatio;
      // Center the image at the new scale
      const wrapper = wrapperRef.current;
      const content = transformRef.current.instance.contentComponent;
      if (wrapper && content) {
        const wRect = wrapper.getBoundingClientRect();
        const cRect = content.getBoundingClientRect();
        const currentScale = transformRef.current.state.scale;
        // Get the unscaled content size
        const contentW = cRect.width / currentScale;
        const contentH = cRect.height / currentScale;
        const x = (wRect.width - contentW * libraryScale) / 2;
        const y = (wRect.height - contentH * libraryScale) / 2;
        transformRef.current.setTransform(x, y, libraryScale, 300);
      } else {
        transformRef.current.setTransform(0, 0, libraryScale, 300);
      }
    } else {
      // Past 8x or at 8x — reset to fit
      transformRef.current.resetTransform(300);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col cursor-grab active:cursor-grabbing">
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
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          onTransform={(_ref, state) => {
            if (baseRatio !== null) {
              setDisplayScale(baseRatio * state.scale);
            }
          }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onLoad={computeBaseRatio}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
