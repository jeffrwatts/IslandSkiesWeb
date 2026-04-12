import Image from "next/image";

export default function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
