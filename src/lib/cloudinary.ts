const CLOUD_NAME = "jeffrwatts";
const IMAGES_JSON_URL = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/island-skies-astro/images.json`;

export async function fetchImagesData(): Promise<RawImage[]> {
  const res = await fetch(IMAGES_JSON_URL, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch images.json: ${res.status}`);
  return res.json();
}

export interface RawImage {
  id: string;
  title: string;
  category: string;
  cloudinaryId: string;
  altText: string;
  catalogId: string | null;
  constellation: string | null;
  objectType: string | null;
  objectSubType: string | null;
  sortOrder: number | null;
  objectName: string;
  ra: number | null;
  dec: number | null;
  contextChart: string | null;
  filename: string;
  width: number;
  height: number;
  region: string | null;
}

// Global loader for next/image — Cloudinary handles resize/format
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/")) return src;
  const q = quality || "auto";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${q},f_auto/${src}`;
}

// Full-resolution URL for plain <img> tags (detail overlay, zoom view)
export function getCloudinaryUrl(cloudinaryId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto/${cloudinaryId}`;
}

export function getChartThumbnailUrl(cloudinaryId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_png/${cloudinaryId}.png`;
}

export function getChartFullUrl(cloudinaryId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_png/${cloudinaryId}.png`;
}
