import type { RawImage } from "@/lib/cloudinary";

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

export function buildGalleryImages(rawData: RawImage[]): GalleryImage[] {
  return rawData.map((img) => ({
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
}

function sortedDso(images: GalleryImage[]): GalleryImage[] {
  return images.sort((a, b) => {
    const aOrder = a.sortOrder ?? Infinity;
    const bOrder = b.sortOrder ?? Infinity;
    return aOrder - bOrder;
  });
}

export function getImagesByCategory(images: GalleryImage[], category: GalleryCategory): GalleryImage[] {
  return sortedDso(images.filter((img) => img.category === category));
}

export function getNebulaeImages(images: GalleryImage[]): GalleryImage[] {
  return sortedDso(images.filter((img) => img.objectType === "nebula"));
}

export function getGalaxiesAndClustersImages(images: GalleryImage[]): GalleryImage[] {
  return sortedDso(
    images.filter(
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
