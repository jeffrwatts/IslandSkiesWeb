export interface ExplorerAnnotation {
  label: string;
  x: number; // percent of image width
  y: number; // percent of image height
  targetId: string | null; // null = informational only
}

export interface ExplorerImage {
  id: string;
  cloudinaryId: string;
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
        annotations: [
          {
            label: "NGC 6888 – Crescent Nebula",
            x: 83.4,
            y: 89.3,
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
