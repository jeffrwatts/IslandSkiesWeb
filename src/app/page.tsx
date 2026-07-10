import Image from "next/image";
import Link from "next/link";
import {
  buildGalleryImages,
  getNebulaeImages,
  getGalaxiesAndClustersImages,
  getImagesByCategory,
} from "@/data/gallery-images";
import { fetchImagesData } from "@/lib/cloudinary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Island Skies Astro | Astrophotography",
};

export default async function HomePage() {
  const rawData = await fetchImagesData();
  const allImages = buildGalleryImages(rawData);

  const nebulae = getNebulaeImages(allImages);
  const galaxies = getGalaxiesAndClustersImages(allImages);
  const solar = getImagesByCategory(allImages, "solar-system");

  const categories = [
    { title: "Nebulae", href: "/gallery/nebulae", cover: nebulae.find((img) => img.id === "m16-pillars-of-creation") ?? nebulae[0], count: nebulae.length },
    { title: "Galaxies & Star Clusters", href: "/gallery/galaxies", cover: galaxies[0], count: galaxies.length },
    { title: "Solar System", href: "/gallery/solar-system", cover: solar[0], count: solar.length },
  ];

  return (
    <main className="mx-auto max-w-7xl w-full px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(({ title, href, cover, count }) => (
          <Link
            key={href}
            href={href}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden block"
          >
            {cover && (
              <Image
                src={cover.cloudinaryId}
                alt={cover.altText}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-sm text-white/60 mt-1">{count} images</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
