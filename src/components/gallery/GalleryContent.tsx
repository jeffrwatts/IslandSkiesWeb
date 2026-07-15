"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GalleryImage } from "@/data/gallery-images";
import type { ImageMetadata } from "@/data/image-metadata";
import GalleryGrid from "./GalleryGrid";
import ImageDetailOverlay from "./ImageDetailOverlay";

type CategoryTab = "nebulae" | "galaxies-clusters" | "solar-system";

const VALID_TABS: CategoryTab[] = ["nebulae", "galaxies-clusters", "solar-system"];

export default function GalleryContent({
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<CategoryTab>(
    (VALID_TABS.includes(searchParams.get("tab") as CategoryTab)
      ? searchParams.get("tab")
      : "nebulae") as CategoryTab
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("image")
  );

  useEffect(() => {
    setSelectedId(searchParams.get("image"));
    const tab = searchParams.get("tab") as CategoryTab;
    if (VALID_TABS.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const imagesByTab: Record<CategoryTab, GalleryImage[]> = {
    nebulae: nebulaeImages,
    "galaxies-clusters": galaxiesImages,
    "solar-system": solarImages,
  };

  const allImages = [...nebulaeImages, ...galaxiesImages, ...solarImages];
  const activeImages = imagesByTab[activeTab];
  const selectedImage = selectedId
    ? allImages.find((img) => img.id === selectedId) ?? null
    : null;

  const switchTab = useCallback(
    (tab: CategoryTab) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.delete("image");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const openImage = useCallback(
    (id: string) => {
      setSelectedId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("image", id);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeImage = useCallback(() => {
    setSelectedId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("image");
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }, [router, searchParams]);

  const tabs: { id: CategoryTab; label: string }[] = [
    { id: "nebulae", label: "Nebulae" },
    { id: "galaxies-clusters", label: "Galaxies & Clusters" },
    { id: "solar-system", label: "Solar System" },
  ];

  return (
    <>
      <div className="flex gap-3 mt-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-black"
                : "bg-white/10 text-muted hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeImages.length > 0 ? (
        <GalleryGrid images={activeImages} onImageClick={openImage} />
      ) : (
        <p className="text-muted text-center py-12">No images found.</p>
      )}

      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          images={activeImages}
          imageMetadata={imageMetadata}
          onClose={closeImage}
          onNavigate={openImage}
        />
      )}
    </>
  );
}
