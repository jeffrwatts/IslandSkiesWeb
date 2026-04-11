"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/gallery-images";
import { getMetadataById } from "@/data/image-metadata";
import ImageMetadataPanel from "./ImageMetadataPanel";
import ImageZoomView from "./ImageZoomView";

export default function ImageDetailOverlay({
  image,
  images,
  onClose,
  onNavigate,
}: {
  image: GalleryImage;
  images: GalleryImage[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const metadata = getMetadataById(image.id);

  const currentIndex = images.findIndex((img) => img.id === image.id);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(images[prevIndex].id);
  }, [currentIndex, images, onNavigate]);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(images[nextIndex].id);
  }, [currentIndex, images, onNavigate]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (zoomOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [zoomOpen, onClose, goToPrev, goToNext]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (zoomOpen) {
    return (
      <ImageZoomView
        src={image.imageUrl}
        alt={image.altText}
        onClose={() => setZoomOpen(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Top bar: close + counter (arrows on mobile only) */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2">
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-3xl leading-none p-1"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex items-center gap-4">
          {/* Arrows in top bar for portrait/mobile only */}
          <button
            onClick={goToPrev}
            className="landscape:hidden text-white/50 hover:text-white text-2xl p-1"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <span className="text-sm text-muted tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={goToNext}
            className="landscape:hidden text-white/50 hover:text-white text-2xl p-1"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      </div>

      {/* Content: side-by-side in landscape/desktop, stacked in portrait */}
      <div className="flex-1 flex flex-col landscape:flex-row overflow-hidden min-h-0">
        {/* Image section */}
        <div
          className="relative min-h-0 portrait:w-full portrait:aspect-[4/3] landscape:h-full landscape:max-w-[calc(100%-20rem)] landscape:flex landscape:items-center landscape:justify-center cursor-zoom-in"
          onClick={() => setZoomOpen(true)}
        >
          {/* Portrait: fill image with crop */}
          <Image
            src={image.imageUrl}
            alt={image.altText}
            fill
            className="object-cover landscape:hidden"
            sizes="100vw"
            priority
          />
          {/* Landscape: in-flow img — container wraps it, eliminating gap */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.altText}
            className="hidden landscape:block max-h-full max-w-full object-contain"
            fetchPriority="high"
          />

          {/* Arrows overlaid on image for landscape/desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="hidden landscape:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white text-4xl p-2"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="hidden landscape:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white text-4xl p-2"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>

        {/* Metadata panel */}
        <div className="flex-1 bg-card overflow-y-auto p-6 landscape:border-l border-white/10">
          {metadata ? (
            <ImageMetadataPanel metadata={metadata} />
          ) : (
            <p className="text-muted">No metadata available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
