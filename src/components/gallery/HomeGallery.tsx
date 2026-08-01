"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/gallery-images";
import type { ImageMetadata } from "@/data/image-metadata";
import ImageDetailOverlay from "./ImageDetailOverlay";

type CategoryKey = "nebulae" | "galaxies";

const DURATION = 700;
const PICKS_PER_CAT = 3; // 3 rows × 2 cols = 6 images filling the viewport

const LABELS: Record<CategoryKey, string> = {
  nebulae: "Nebulae",
  galaxies: "Galaxies & Clusters",
};

function scatterStyle(i: number, total: number): React.CSSProperties {
  const angle = (i / Math.max(total, 1)) * 340 + i * 23.7 + 20;
  const dist = 90 + (i % 5) * 55;
  const rad = (angle * Math.PI) / 180;
  return {
    transform: `translate(${(Math.cos(rad) * dist).toFixed(1)}px, ${(Math.sin(rad) * dist).toFixed(1)}px) rotate(${((i * 11) % 36) - 18}deg)`,
    opacity: 0,
    pointerEvents: "none",
  };
}

export default function HomeGallery({
  nebulaeImages,
  galaxiesImages,
  imageMetadata,
}: {
  nebulaeImages: GalleryImage[];
  galaxiesImages: GalleryImage[];
  imageMetadata: ImageMetadata[];
}) {
  const [view, setView] = useState<"main" | "category">("main");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("nebulae");
  const [scattered, setScattered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const busy = useRef(false);

  // Checkerboard interleave: row 0 → N,G; row 1 → G,N; row 2 → N,G …
  // so neither column is always the same type
  const mainImages: GalleryImage[] = [];
  for (let row = 0; row < PICKS_PER_CAT; row++) {
    if (row % 2 === 0) {
      if (nebulaeImages[row]) mainImages.push(nebulaeImages[row]);
      if (galaxiesImages[row]) mainImages.push(galaxiesImages[row]);
    } else {
      if (galaxiesImages[row]) mainImages.push(galaxiesImages[row]);
      if (nebulaeImages[row]) mainImages.push(nebulaeImages[row]);
    }
  }

  const catImages: Record<CategoryKey, GalleryImage[]> = {
    nebulae: nebulaeImages,
    galaxies: galaxiesImages,
  };

  const activeCatImages = catImages[activeCategory];

  const itemStyle = (i: number, total: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity ${DURATION}ms ease`,
    };
    if (scattered) return { ...base, ...scatterStyle(i, total) };
    return { ...base, transform: "none", opacity: 1 };
  };

  const switchToCategory = useCallback((cat: CategoryKey) => {
    if (busy.current) return;
    busy.current = true;
    setActiveCategory(cat);
    setScattered(true);
    setTimeout(() => {
      setView("category");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setScattered(false);
          busy.current = false;
        })
      );
    }, DURATION);
  }, []);

  const goBack = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setScattered(true);
    setTimeout(() => {
      setView("main");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setScattered(false);
          busy.current = false;
        })
      );
    }, DURATION);
  }, []);

  const clickMainImage = useCallback(
    (image: GalleryImage) => {
      if (busy.current) return;
      const cat: CategoryKey = galaxiesImages.some((g) => g.id === image.id)
        ? "galaxies"
        : "nebulae";
      switchToCategory(cat);
    },
    [galaxiesImages, switchToCategory]
  );

  // Logo click on home page dispatches "go-home" — handle it here
  useEffect(() => {
    const handler = () => { if (view === "category") goBack(); };
    window.addEventListener("go-home", handler);
    return () => window.removeEventListener("go-home", handler);
  }, [view, goBack]);

  const selectedImage = selectedId
    ? activeCatImages.find((img) => img.id === selectedId) ?? null
    : null;

  return (
    <div className="w-full">
      {view === "main" ? (
        // 2-col grid that fills viewport height below the header
        <div
          className="grid grid-cols-2"
          style={{
            height: "calc(100vh - 4rem)",
            gridTemplateRows: `repeat(${PICKS_PER_CAT}, 1fr)`,
          }}
        >
          {mainImages.map((img, i) => (
            <div
              key={img.id}
              style={itemStyle(i, mainImages.length)}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => clickMainImage(img)}
            >
              <Image
                src={img.cloudinaryId}
                alt={img.altText}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="50vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Category header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <button
              onClick={goBack}
              className="text-muted hover:text-foreground transition-colors text-sm"
            >
              ← Back
            </button>
            <span className="text-white/20">|</span>
            {(["nebulae", "galaxies"] as CategoryKey[]).map((cat) => (
              <button
                key={cat}
                onClick={() => cat !== activeCategory && switchToCategory(cat)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  cat === activeCategory
                    ? "bg-white text-black font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Category photo wall */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {activeCatImages.map((img, i) => (
              <div
                key={img.id}
                style={itemStyle(i, activeCatImages.length)}
                className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
                onClick={() => !busy.current && setSelectedId(img.id)}
              >
                <Image
                  src={img.cloudinaryId}
                  alt={img.altText}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          images={activeCatImages}
          imageMetadata={imageMetadata}
          onClose={() => setSelectedId(null)}
          onNavigate={setSelectedId}
        />
      )}
    </div>
  );
}
