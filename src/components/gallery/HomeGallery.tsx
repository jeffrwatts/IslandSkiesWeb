"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/gallery-images";
import type { ImageMetadata } from "@/data/image-metadata";
import ImageDetailOverlay from "./ImageDetailOverlay";

type CategoryKey = "nebulae" | "galaxies" | "solar";

const DURATION = 420;
const PICKS_PER_CAT = 4;

const LABELS: Record<CategoryKey, string> = {
  nebulae: "Nebulae",
  galaxies: "Galaxies & Clusters",
  solar: "Solar System",
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
  solarImages,
  imageMetadata,
}: {
  nebulaeImages: GalleryImage[];
  galaxiesImages: GalleryImage[];
  solarImages: GalleryImage[];
  imageMetadata: ImageMetadata[];
}) {
  const [view, setView] = useState<"main" | "category">("main");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("nebulae");
  const [scattered, setScattered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const busy = useRef(false);

  // Interleave 4 picks from each category across the 6×2 wall
  const mainImages: GalleryImage[] = [];
  for (let i = 0; i < PICKS_PER_CAT; i++) {
    if (nebulaeImages[i]) mainImages.push(nebulaeImages[i]);
    if (galaxiesImages[i]) mainImages.push(galaxiesImages[i]);
    if (solarImages[i]) mainImages.push(solarImages[i]);
  }

  const catImages: Record<CategoryKey, GalleryImage[]> = {
    nebulae: nebulaeImages,
    galaxies: galaxiesImages,
    solar: solarImages,
  };

  const activeCatImages = catImages[activeCategory];

  const itemStyle = (i: number, total: number): React.CSSProperties => {
    const transition: React.CSSProperties = {
      transition: `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity ${DURATION}ms ease`,
    };
    if (scattered) return { ...transition, ...scatterStyle(i, total) };
    return { ...transition, transform: "none", opacity: 1 };
  };

  const switchToCategory = useCallback((cat: CategoryKey) => {
    if (busy.current) return;
    busy.current = true;
    setActiveCategory(cat);
    setScattered(true); // scatter out whatever is visible
    setTimeout(() => {
      setView("category"); // new content renders while scattered=true (starts at offset)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setScattered(false); // category images animate into place
          busy.current = false;
        })
      );
    }, DURATION);
  }, []);

  const goBack = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setScattered(true); // scatter out category
    setTimeout(() => {
      setView("main"); // main renders scattered
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setScattered(false); // main animates in
          busy.current = false;
        })
      );
    }, DURATION);
  }, []);

  const clickMainImage = useCallback(
    (image: GalleryImage) => {
      if (busy.current) return;
      let cat: CategoryKey = "nebulae";
      if (galaxiesImages.some((g) => g.id === image.id)) cat = "galaxies";
      else if (solarImages.some((s) => s.id === image.id)) cat = "solar";
      switchToCategory(cat);
    },
    [galaxiesImages, solarImages, switchToCategory]
  );

  const selectedImage = selectedId
    ? activeCatImages.find((img) => img.id === selectedId) ?? null
    : null;

  return (
    <div className="w-full">
      {view === "main" ? (
        <div className="grid grid-cols-3 md:grid-cols-6">
          {mainImages.map((img, i) => (
            <div
              key={img.id}
              style={itemStyle(i, mainImages.length)}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
              onClick={() => clickMainImage(img)}
            >
              <Image
                src={img.cloudinaryId}
                alt={img.altText}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 17vw"
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
            {(["nebulae", "galaxies", "solar"] as CategoryKey[]).map((cat) => (
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
