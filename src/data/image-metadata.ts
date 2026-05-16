import descriptions from "./descriptions.yaml";
import type { RawImage } from "@/lib/cloudinary";

export interface ImageMetadata {
  id: string;
  objectName: string;
  catalogId?: string;
  ra?: number;
  dec?: number;
  constellation?: string;
  objectType?: string;
  objectSubType?: string;
  description?: string;
  contextChart?: string;
}

export function buildImageMetadata(rawData: RawImage[]): ImageMetadata[] {
  return rawData.map((img) => ({
    id: img.id,
    objectName: img.objectName,
    catalogId: img.catalogId ?? undefined,
    ra: img.ra ?? undefined,
    dec: img.dec ?? undefined,
    constellation: img.constellation ?? undefined,
    objectType: img.objectType ?? undefined,
    objectSubType: img.objectSubType ?? undefined,
    description: descriptions[img.id] ?? undefined,
    contextChart: img.contextChart ?? undefined,
  }));
}

export function getMetadataById(
  metadata: ImageMetadata[],
  id: string
): ImageMetadata | undefined {
  return metadata.find((m) => m.id === id);
}
