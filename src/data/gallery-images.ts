import imagesData from "./images.json";

export type GalleryCategory = "dso" | "solar-system";

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  cloudinaryId: string;
  altText: string;
  catalogId?: string;
  constellation?: string;
}

export const galleryImages: GalleryImage[] = imagesData.map((img) => ({
  id: img.id,
  title: img.title,
  category: img.category as GalleryCategory,
  cloudinaryId: img.cloudinaryId,
  altText: img.altText,
  catalogId: img.catalogId ?? undefined,
  constellation: img.constellation ?? undefined,
}));

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return galleryImages.filter((img) => img.category === category);
}

export function filterByQuery(images: GalleryImage[], query: string): GalleryImage[] {
  const q = query.toLowerCase();
  return images.filter(
    (img) =>
      img.title.toLowerCase().includes(q) ||
      (img.catalogId && img.catalogId.toLowerCase().includes(q)) ||
      (img.constellation && img.constellation.toLowerCase().includes(q))
  );
}
