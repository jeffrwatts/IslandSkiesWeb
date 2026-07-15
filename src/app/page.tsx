import { Suspense } from "react";
import {
  buildGalleryImages,
  getNebulaeImages,
  getGalaxiesAndClustersImages,
  getImagesByCategory,
  filterByQuery,
} from "@/data/gallery-images";
import { buildImageMetadata } from "@/data/image-metadata";
import { fetchImagesData } from "@/lib/cloudinary";
import SearchBar from "@/components/gallery/SearchBar";
import GalleryContent from "@/components/gallery/GalleryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Island Skies Astro | Astrophotography",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const rawData = await fetchImagesData();
  const allImages = buildGalleryImages(rawData);
  const imageMetadata = buildImageMetadata(rawData);

  let nebulaeImages = getNebulaeImages(allImages);
  let galaxiesImages = getGalaxiesAndClustersImages(allImages);
  let solarImages = getImagesByCategory(allImages, "solar-system");

  if (q) {
    nebulaeImages = filterByQuery(nebulaeImages, q);
    galaxiesImages = filterByQuery(galaxiesImages, q);
    solarImages = filterByQuery(solarImages, q);
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-6">
      <Suspense>
        <SearchBar />
      </Suspense>
      <Suspense>
        <GalleryContent
          nebulaeImages={nebulaeImages}
          galaxiesImages={galaxiesImages}
          solarImages={solarImages}
          imageMetadata={imageMetadata}
        />
      </Suspense>
    </div>
  );
}
