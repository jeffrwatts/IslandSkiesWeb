"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { GalleryImage } from "@/data/gallery-images";
import type { ImageMetadata } from "@/data/image-metadata";
import GalleryGrid from "./GalleryGrid";
import ImageDetailOverlay from "./ImageDetailOverlay";

export default function GalleryContent({
  images,
  imageMetadata,
}: {
  images: GalleryImage[];
  imageMetadata: ImageMetadata[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("image")
  );

  useEffect(() => {
    setSelectedId(searchParams.get("image"));
  }, [searchParams]);

  const openImage = useCallback(
    (id: string) => {
      setSelectedId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("image", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname]
  );

  const closeImage = useCallback(() => {
    setSelectedId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("image");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, searchParams, pathname]);

  const selectedImage = selectedId
    ? images.find((img) => img.id === selectedId) ?? null
    : null;

  return (
    <>
      {images.length > 0 ? (
        <GalleryGrid images={images} onImageClick={openImage} />
      ) : (
        <p className="text-muted text-center py-12">No images found.</p>
      )}

      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          images={images}
          imageMetadata={imageMetadata}
          onClose={closeImage}
          onNavigate={openImage}
        />
      )}
    </>
  );
}
