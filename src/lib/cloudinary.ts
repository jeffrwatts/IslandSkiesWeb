const CLOUD_NAME = "jeffrwatts";

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
