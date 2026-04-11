export interface ImageMetadata {
  id: string;
  objectName: string;
  catalogId?: string;
  ra?: string;
  dec?: string;
  constellation?: string;
  objectType?: string;
  objectSubType?: string;
  description?: string;
}

export const imageMetadata: ImageMetadata[] = [
  // DSO
  {
    id: "ic443",
    objectName: "Jellyfish Nebula",
    catalogId: "IC 443",
    ra: "06h 17m 13s",
    dec: "+22° 31′ 05″",
    constellation: "Gemini",
    objectType: "Supernova Remnant",
    objectSubType: "Emission Nebula",
  },
  {
    id: "ngc1499",
    objectName: "California Nebula",
    catalogId: "NGC 1499",
    ra: "04h 03m 18s",
    dec: "+36° 25′ 18″",
    constellation: "Perseus",
    objectType: "Emission Nebula",
    objectSubType: "H II Region",
  },
  {
    id: "ngc2264",
    objectName: "Cone Nebula & Christmas Tree Cluster",
    catalogId: "NGC 2264",
    ra: "06h 41m 06s",
    dec: "+09° 53′ 00″",
    constellation: "Monoceros",
    objectType: "Emission Nebula",
    objectSubType: "Open Cluster + Nebula",
  },
  {
    id: "ngc2359",
    objectName: "Thor's Helmet",
    catalogId: "NGC 2359",
    ra: "07h 18m 30s",
    dec: "−13° 13′ 36″",
    constellation: "Canis Major",
    objectType: "Emission Nebula",
    objectSubType: "Wolf-Rayet Nebula",
  },
  {
    id: "m45",
    objectName: "Pleiades",
    catalogId: "M45",
    ra: "03h 47m 24s",
    dec: "+24° 07′ 00″",
    constellation: "Taurus",
    objectType: "Open Cluster",
    objectSubType: "Reflection Nebula",
  },
  {
    id: "m31",
    objectName: "Andromeda Galaxy",
    catalogId: "M31",
    ra: "00h 42m 44s",
    dec: "+41° 16′ 09″",
    constellation: "Andromeda",
    objectType: "Galaxy",
    objectSubType: "Spiral Galaxy",
  },
  {
    id: "m101",
    objectName: "Pinwheel Galaxy",
    catalogId: "M101",
    ra: "14h 03m 12s",
    dec: "+54° 20′ 57″",
    constellation: "Ursa Major",
    objectType: "Galaxy",
    objectSubType: "Spiral Galaxy",
  },
  // Solar System
  {
    id: "jupiter-grs-io",
    objectName: "Jupiter with Great Red Spot and Io",
    objectType: "Planet",
    objectSubType: "Gas Giant",
  },
  {
    id: "jupiter-grs-io-shadow",
    objectName: "Jupiter with Io Shadow Transit",
    objectType: "Planet",
    objectSubType: "Gas Giant",
  },
  {
    id: "saturn-titan",
    objectName: "Saturn with Titan",
    objectType: "Planet",
    objectSubType: "Gas Giant",
  },
  {
    id: "mars",
    objectName: "Mars",
    objectType: "Planet",
    objectSubType: "Terrestrial",
  },
  {
    id: "moon-full",
    objectName: "Full Moon",
    objectType: "Moon",
    objectSubType: "Natural Satellite",
  },
  {
    id: "comet-c2025-a6-lemon",
    objectName: "Comet C/2025 A6 (Lemon)",
    objectType: "Comet",
    objectSubType: "Long-period Comet",
  },
];

export function getMetadataById(id: string): ImageMetadata | undefined {
  return imageMetadata.find((m) => m.id === id);
}
