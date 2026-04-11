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
      {/* Top bar: close, arrows, counter */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2">
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-3xl leading-none p-1"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrev}
            className="text-white/50 hover:text-white text-2xl p-1"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <span className="text-sm text-muted tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={goToNext}
            className="text-white/50 hover:text-white text-2xl p-1"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      </div>

      {/* Content: side-by-side in landscape/desktop, stacked in portrait */}
      <div className="flex-1 flex flex-col landscape:flex-row overflow-hidden min-h-0">
        {/* Image section — flush against panel */}
        <div
          className="relative flex-1 min-h-0 cursor-zoom-in"
          onClick={() => setZoomOpen(true)}
        >
          <Image
            src={image.imageUrl}
            alt={image.altText}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        {/* Metadata panel — flush against image */}
        <div className="flex-shrink-0 landscape:w-72 xl:w-80 landscape:h-full bg-card overflow-y-auto p-6 landscape:border-l border-white/10">
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
