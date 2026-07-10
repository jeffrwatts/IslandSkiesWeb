import { Suspense } from "react";
import { buildGalleryImages, getNebulaeImages, filterByQuery } from "@/data/gallery-images";
import { buildImageMetadata } from "@/data/image-metadata";
import { fetchImagesData } from "@/lib/cloudinary";
import SearchBar from "@/components/gallery/SearchBar";
import GalleryContent from "@/components/gallery/GalleryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nebulae | Island Skies Astro",
};

export default async function NebulaeGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const rawData = await fetchImagesData();
  const allImages = buildGalleryImages(rawData);
  const imageMetadata = buildImageMetadata(rawData);

  let images = getNebulaeImages(allImages);
  if (q) images = filterByQuery(images, q);

  return (
    <div className="w-full">
      <div className="flex justify-end px-3 py-2">
        <div className="w-48">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>
      <Suspense>
        <GalleryContent images={images} imageMetadata={imageMetadata} />
      </Suspense>
    </div>
  );
}
