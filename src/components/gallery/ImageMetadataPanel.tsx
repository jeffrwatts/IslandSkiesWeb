import type { ImageMetadata } from "@/data/image-metadata";
import { getChartThumbnailUrl } from "@/lib/cloudinary";

export default function ImageMetadataPanel({
  metadata,
  onChartClick,
}: {
  metadata: ImageMetadata;
  onChartClick?: () => void;
}) {
  const subtitle = [metadata.catalogId, metadata.objectSubType]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{metadata.objectName}</h2>
        {subtitle && (
          <p className="text-sm text-muted mt-1">{subtitle}</p>
        )}
      </div>

      {metadata.description && (
        <div className="border-t border-white/20 pt-4">
          <p className="text-sm text-foreground leading-relaxed">{metadata.description}</p>
        </div>
      )}

      {metadata.contextChart && (
        <div className="border-t border-white/20 pt-4">
          <span className="text-sm font-medium text-foreground">Where to find it</span>
          {metadata.constellation && (
            <p className="text-sm mt-1">
              <span className="text-muted">Constellation: </span>
              <span className="text-foreground">{metadata.constellation}</span>
            </p>
          )}
          <button
            onClick={onChartClick}
            className="mt-2 block w-full rounded-lg overflow-hidden cursor-zoom-in hover:ring-1 hover:ring-white/30 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getChartThumbnailUrl(metadata.contextChart, 400)}
              alt={`Sky location of ${metadata.objectName}`}
              className="w-full h-auto"
            />
          </button>
        </div>
      )}
    </div>
  );
}
