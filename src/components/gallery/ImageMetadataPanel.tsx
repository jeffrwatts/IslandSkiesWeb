import type { ImageMetadata } from "@/data/image-metadata";

export default function ImageMetadataPanel({ metadata }: { metadata: ImageMetadata }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{metadata.objectName}</h2>
        {metadata.catalogId && (
          <p className="text-sm text-muted mt-1">{metadata.catalogId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {metadata.ra && (
          <div>
            <span className="text-muted">RA</span>
            <p className="text-foreground">{metadata.ra}</p>
          </div>
        )}
        {metadata.dec && (
          <div>
            <span className="text-muted">Dec</span>
            <p className="text-foreground">{metadata.dec}</p>
          </div>
        )}
        {metadata.constellation && (
          <div>
            <span className="text-muted">Constellation</span>
            <p className="text-foreground">{metadata.constellation}</p>
          </div>
        )}
        {metadata.objectType && (
          <div>
            <span className="text-muted">Type</span>
            <p className="text-foreground">{metadata.objectType}</p>
          </div>
        )}
        {metadata.objectSubType && (
          <div>
            <span className="text-muted">Sub-type</span>
            <p className="text-foreground">{metadata.objectSubType}</p>
          </div>
        )}
      </div>

      {metadata.description && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-foreground leading-relaxed">{metadata.description}</p>
        </div>
      )}
    </div>
  );
}
