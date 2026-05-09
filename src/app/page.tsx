import { Suspense } from "react";
import {
  getNebulaeImages,
  getGalaxiesAndClustersImages,
  getImagesByCategory,
  filterByQuery,
} from "@/data/gallery-images";
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

  let nebulaeImages = getNebulaeImages();
  let galaxiesImages = getGalaxiesAndClustersImages();
  let solarImages = getImagesByCategory("solar-system");

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
        />
      </Suspense>
    </div>
  );
}
