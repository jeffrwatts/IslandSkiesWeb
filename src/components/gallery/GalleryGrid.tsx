import type { GalleryImage } from "@/data/gallery-images";
import ImageCard from "./ImageCard";

export default function GalleryGrid({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick?: (id: string) => void;
}) {
  if (images.length === 0) {
    return (
      <p className="text-muted text-center py-12">No images found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={onImageClick ? () => onImageClick(image.id) : undefined}
        />
      ))}
    </div>
  );
}
