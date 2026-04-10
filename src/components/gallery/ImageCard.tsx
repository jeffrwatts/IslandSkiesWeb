import Image from "next/image";
import type { GalleryImage } from "@/data/gallery-images";

export default function ImageCard({ image }: { image: GalleryImage }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-card">
      <Image
        src={image.imageUrl}
        alt={image.altText}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}
