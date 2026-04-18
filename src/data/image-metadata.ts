import imagesData from "./images.json";
import descriptions from "./descriptions.yaml";

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

export const imageMetadata: ImageMetadata[] = imagesData.map((img) => ({
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

export function getMetadataById(id: string): ImageMetadata | undefined {
  return imageMetadata.find((m) => m.id === id);
}
