export interface ExplorerAnnotation {
  label: string;
  x: number;        // pixel x in the original image
  y: number;        // pixel y in the original image
  radius?: number;  // pixel radius of the annotation circle (omit for small dot)
  targetId: string | null;
}

export interface ExplorerImage {
  id: string;
  cloudinaryId: string;
  width?: number;   // native pixel width — required when any annotation has a radius
  height?: number;  // native pixel height
  annotations: ExplorerAnnotation[];
}

export interface ExplorerDataset {
  id: string;
  rootId: string;
  images: ExplorerImage[];
}

const datasets: ExplorerDataset[] = [
  {
    id: "sadr-crescent",
    rootId: "ic1318",
    images: [
      {
        id: "ic1318",
        cloudinaryId: "island-skies-astro/articles/sadr-crescent/ic1318",
        width: 6173,
        height: 4145,
        annotations: [
          {
            label: "NGC 6888 – Crescent Nebula",
            x: 5145,
            y: 3700,
            radius: 250,
            targetId: "ngc6888",
          },
        ],
      },
      {
        id: "ngc6888",
        cloudinaryId: "island-skies-astro/articles/sadr-crescent/ngc6888",
        annotations: [],
      },
    ],
  },
];

export function getExplorerDataset(id: string): ExplorerDataset | undefined {
  return datasets.find((d) => d.id === id);
}
