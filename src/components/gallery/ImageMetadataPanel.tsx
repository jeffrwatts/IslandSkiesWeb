import type { ImageMetadata } from "@/data/image-metadata";

function formatRA(ra: number): string {
  const h = Math.floor(ra);
  const mFloat = (ra - h) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

function formatDec(dec: number): string {
  const sign = dec >= 0 ? "+" : "\u2212";
  const abs = Math.abs(dec);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${sign}${d.toString().padStart(2, "0")}\u00B0 ${m.toString().padStart(2, "0")}\u2032 ${s.toString().padStart(2, "0")}\u2033`;
}

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
        {metadata.ra != null && (
          <div>
            <span className="text-muted">RA</span>
            <p className="text-foreground">{formatRA(metadata.ra)}</p>
          </div>
        )}
        {metadata.dec != null && (
          <div>
            <span className="text-muted">Dec</span>
            <p className="text-foreground">{formatDec(metadata.dec)}</p>
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
