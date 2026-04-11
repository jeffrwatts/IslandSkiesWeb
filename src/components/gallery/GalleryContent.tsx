"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GalleryImage } from "@/data/gallery-images";
import GalleryGrid from "./GalleryGrid";
import ImageDetailOverlay from "./ImageDetailOverlay";

export default function GalleryContent({
  dsoImages,
  solarImages,
}: {
  dsoImages: GalleryImage[];
  solarImages: GalleryImage[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("image")
  );

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    setSelectedId(searchParams.get("image"));
  }, [searchParams]);

  const allImages = [...dsoImages, ...solarImages];
  const selectedImage = selectedId
    ? allImages.find((img) => img.id === selectedId) ?? null
    : null;

  // Determine which category list the selected image belongs to for navigation
  const categoryImages = selectedImage
    ? selectedImage.category === "dso"
      ? dsoImages
      : solarImages
    : [];

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
      {dsoImages.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-medium text-muted mb-4">Deep Sky Objects</h2>
          <GalleryGrid images={dsoImages} onImageClick={openImage} />
        </section>
      )}

      {dsoImages.length > 0 && solarImages.length > 0 && (
        <hr className="my-8 border-white/10" />
      )}

      {solarImages.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-muted mb-4">Solar System</h2>
          <GalleryGrid images={solarImages} onImageClick={openImage} />
        </section>
      )}

      {dsoImages.length === 0 && solarImages.length === 0 && (
        <p className="text-muted text-center py-12">No images found.</p>
      )}

      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          images={categoryImages}
          onClose={closeImage}
          onNavigate={openImage}
        />
      )}
    </>
  );
}
