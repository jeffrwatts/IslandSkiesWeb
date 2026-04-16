"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GalleryImage } from "@/data/gallery-images";
import GalleryGrid from "./GalleryGrid";
import ImageDetailOverlay from "./ImageDetailOverlay";

type CategoryTab = "dso" | "solar-system";

export default function GalleryContent({
  dsoImages,
  solarImages,
}: {
  dsoImages: GalleryImage[];
  solarImages: GalleryImage[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<CategoryTab>(
    (searchParams.get("tab") as CategoryTab) || "dso"
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("image")
  );

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    setSelectedId(searchParams.get("image"));
    const tab = searchParams.get("tab") as CategoryTab;
    if (tab === "dso" || tab === "solar-system") setActiveTab(tab);
  }, [searchParams]);

  const allImages = [...dsoImages, ...solarImages];
  const selectedImage = selectedId
    ? allImages.find((img) => img.id === selectedId) ?? null
    : null;

  const activeImages = activeTab === "dso" ? dsoImages : solarImages;

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

  return (
    <>
      <div className="flex gap-3 mt-4 mb-6">
        <button
          onClick={() => switchTab("dso")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "dso"
              ? "bg-white text-black"
              : "bg-white/10 text-muted hover:bg-white/20"
          }`}
        >
          Deep Sky
        </button>
        <button
          onClick={() => switchTab("solar-system")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "solar-system"
              ? "bg-white text-black"
              : "bg-white/10 text-muted hover:bg-white/20"
          }`}
        >
          Solar System
        </button>
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
          onClose={closeImage}
          onNavigate={openImage}
        />
      )}
    </>
  );
}
