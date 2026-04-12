const CLOUD_NAME = "jeffrwatts";

export default function ArticleSvg({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  // Serve SVG directly from Cloudinary without format conversion
  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/${src}.svg`;

  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} className="w-full h-auto" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-lg text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
