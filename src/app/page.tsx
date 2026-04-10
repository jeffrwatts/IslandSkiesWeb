import { Suspense } from "react";
import { getImagesByCategory, filterByQuery } from "@/data/gallery-images";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import SearchBar from "@/components/gallery/SearchBar";
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

  let dsoImages = getImagesByCategory("dso");
  let solarImages = getImagesByCategory("solar-system");

  if (q) {
    dsoImages = filterByQuery(dsoImages, q);
    solarImages = filterByQuery(solarImages, q);
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-6">
      <Suspense>
        <SearchBar />
      </Suspense>

      {dsoImages.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-medium text-muted mb-4">Deep Sky Objects</h2>
          <GalleryGrid images={dsoImages} />
        </section>
      )}

      {dsoImages.length > 0 && solarImages.length > 0 && (
        <hr className="my-8 border-white/10" />
      )}

      {solarImages.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-muted mb-4">Solar System</h2>
          <GalleryGrid images={solarImages} />
        </section>
      )}

      {dsoImages.length === 0 && solarImages.length === 0 && (
        <p className="text-muted text-center py-12">No images found.</p>
      )}
    </div>
  );
}
