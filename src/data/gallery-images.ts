export type GalleryCategory = "dso" | "solar-system";

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  subject: string;
  catalogId?: string;
  constellation?: string;
  imageUrl: string;
  altText: string;
}

export const galleryImages: GalleryImage[] = [
  // DSO
  {
    id: "ic443",
    title: "Jellyfish Nebula",
    category: "dso",
    subject: "Jellyfish Nebula",
    catalogId: "IC 443",
    constellation: "Gemini",
    imageUrl: "/images/dso/IC443.jpg",
    altText: "IC 443 - Jellyfish Nebula in Gemini",
  },
  {
    id: "ngc1499",
    title: "California Nebula",
    category: "dso",
    subject: "California Nebula",
    catalogId: "NGC 1499",
    constellation: "Perseus",
    imageUrl: "/images/dso/NGC1499.jpg",
    altText: "NGC 1499 - California Nebula in Perseus",
  },
  {
    id: "ngc2264",
    title: "Cone Nebula & Christmas Tree Cluster",
    category: "dso",
    subject: "Cone Nebula",
    catalogId: "NGC 2264",
    constellation: "Monoceros",
    imageUrl: "/images/dso/NGC2264.jpg",
    altText: "NGC 2264 - Cone Nebula and Christmas Tree Cluster in Monoceros",
  },
  {
    id: "ngc2359",
    title: "Thor's Helmet",
    category: "dso",
    subject: "Thor's Helmet",
    catalogId: "NGC 2359",
    constellation: "Canis Major",
    imageUrl: "/images/dso/NGC2359.jpg",
    altText: "NGC 2359 - Thor's Helmet in Canis Major",
  },
  {
    id: "m45",
    title: "Pleiades",
    category: "dso",
    subject: "Pleiades",
    catalogId: "M45",
    constellation: "Taurus",
    imageUrl: "/images/dso/M45.jpg",
    altText: "M45 - Pleiades star cluster in Taurus",
  },
  {
    id: "m31",
    title: "Andromeda Galaxy",
    category: "dso",
    subject: "Andromeda Galaxy",
    catalogId: "M31",
    constellation: "Andromeda",
    imageUrl: "/images/dso/M31.jpg",
    altText: "M31 - Andromeda Galaxy",
  },
  {
    id: "m101",
    title: "Pinwheel Galaxy",
    category: "dso",
    subject: "Pinwheel Galaxy",
    catalogId: "M101",
    constellation: "Ursa Major",
    imageUrl: "/images/dso/M101.jpg",
    altText: "M101 - Pinwheel Galaxy in Ursa Major",
  },
  // Solar System
  {
    id: "jupiter-grs-io",
    title: "Jupiter with Great Red Spot and Io",
    category: "solar-system",
    subject: "Jupiter",
    imageUrl: "/images/solar-system/jupiter_grs_io.jpg",
    altText: "Jupiter showing the Great Red Spot with moon Io",
  },
  {
    id: "jupiter-grs-io-shadow",
    title: "Jupiter with Io Shadow Transit",
    category: "solar-system",
    subject: "Jupiter",
    imageUrl: "/images/solar-system/jupiter_grs_io_shadow.jpg",
    altText: "Jupiter showing the Great Red Spot with Io shadow transit",
  },
  {
    id: "saturn-titan",
    title: "Saturn with Titan",
    category: "solar-system",
    subject: "Saturn",
    imageUrl: "/images/solar-system/saturn_titan.jpg",
    altText: "Saturn with moon Titan",
  },
  {
    id: "mars",
    title: "Mars",
    category: "solar-system",
    subject: "Mars",
    imageUrl: "/images/solar-system/mars.jpg",
    altText: "Mars showing surface features",
  },
  {
    id: "moon-full",
    title: "Full Moon",
    category: "solar-system",
    subject: "Moon",
    imageUrl: "/images/solar-system/moon_full.jpg",
    altText: "Full Moon",
  },
  {
    id: "comet-c2025-a6-lemon",
    title: "Comet C/2025 A6 (Lemon)",
    category: "solar-system",
    subject: "Comet",
    imageUrl: "/images/solar-system/c2025a6lemon.jpg",
    altText: "Comet C/2025 A6 Lemon",
  },
];

export function getImagesByCategory(category: GalleryCategory): GalleryImage[] {
  return galleryImages.filter((img) => img.category === category);
}

export function filterByQuery(images: GalleryImage[], query: string): GalleryImage[] {
  const q = query.toLowerCase();
  return images.filter(
    (img) =>
      img.title.toLowerCase().includes(q) ||
      img.subject.toLowerCase().includes(q) ||
      (img.catalogId && img.catalogId.toLowerCase().includes(q)) ||
      (img.constellation && img.constellation.toLowerCase().includes(q))
  );
}
