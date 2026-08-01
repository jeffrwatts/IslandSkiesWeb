import {
  buildGalleryImages,
  getNebulaeImages,
  getGalaxiesAndClustersImages,
  getImagesByCategory,
} from "@/data/gallery-images";
import { buildImageMetadata } from "@/data/image-metadata";
import { fetchImagesData } from "@/lib/cloudinary";
import HomeGallery from "@/components/gallery/HomeGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Island Skies Astro | Astrophotography",
};

export default async function Home() {
  const rawData = await fetchImagesData();
  const allImages = buildGalleryImages(rawData);
  const imageMetadata = buildImageMetadata(rawData);

  const nebulaeImages = getNebulaeImages(allImages);
  const galaxiesImages = getGalaxiesAndClustersImages(allImages);
  const solarImages = getImagesByCategory(allImages, "solar-system");

  return (
    <HomeGallery
      nebulaeImages={nebulaeImages}
      galaxiesImages={galaxiesImages}
      solarImages={solarImages}
      imageMetadata={imageMetadata}
    />
  );
}
