import Image from "next/image";

export default function ImageSection({
  src,
  alt,
  caption,
  imagePosition = "right",
  children,
}: {
  src: string;
  alt: string;
  caption?: string;
  imagePosition?: "left" | "right";
  children: React.ReactNode;
}) {
  const textCol = imagePosition === "right" ? "lg:col-start-1" : "lg:col-start-2";
  const imageCol = imagePosition === "right"
    ? "lg:col-start-2 lg:row-start-1"
    : "lg:col-start-1 lg:row-start-1";

  return (
    <section className="my-12 lg:my-16 border-t border-white/10 pt-10 lg:border-0 lg:pt-0 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
      <div className={textCol}>
        {children}
      </div>
      <figure className={`${imageCol} lg:px-8`}>
        <div className="overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 35vw"
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-lg text-muted">{caption}</figcaption>
        )}
      </figure>
    </section>
  );
}
