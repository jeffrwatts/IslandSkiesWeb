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
  objectType?: string;
  sortOrder?: number;
}

export const galleryImages: GalleryImage[] = imagesData.map((img) => ({
  id: img.id,
  title: img.title,
  category: img.category as GalleryCategory,
  cloudinaryId: img.cloudinaryId,
  altText: img.altText,
  catalogId: img.catalogId ?? undefined,
  constellation: img.constellation ?? undefined,
  objectType: img.objectType ?? undefined,
  sortOrder: img.sortOrder ?? undefined,
}));

function sortedDso(images: GalleryImage[]): GalleryImage[] {
  return images.sort((a, b) => {
    const aOrder = a.sortOrder ?? Infinity;
    const bOrder = b.sortOrder ?? Infinity;
    return aOrder - bOrder;
  });
}

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  const filtered = galleryImages.filter((img) => img.category === category);
  return sortedDso(filtered);
}

export function getNebulaeImages(): GalleryImage[] {
  return sortedDso(galleryImages.filter((img) => img.objectType === "nebula"));
}

export function getGalaxiesAndClustersImages(): GalleryImage[] {
  return sortedDso(
    galleryImages.filter(
      (img) => img.objectType === "galaxy" || img.objectType === "cluster"
    )
  );
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
