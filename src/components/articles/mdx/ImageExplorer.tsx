import Link from "next/link";
import { getExplorerDataset } from "@/data/explorer-datasets";
import ExplorerViewer from "@/components/explorer/ExplorerViewer";

export default function ImageExplorer({ datasetId }: { datasetId: string }) {
  const dataset = getExplorerDataset(datasetId);
  if (!dataset) {
    return (
      <div className="text-muted text-sm py-4">
        Explorer dataset &ldquo;{datasetId}&rdquo; not found.
      </div>
    );
  }

  return (
    <figure className="my-10">
      <div className="relative rounded-lg overflow-hidden">
        <ExplorerViewer dataset={dataset} />

        {/* Expand to dedicated page */}
        <Link
          href={`/explorer/${datasetId}`}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
          title="View full explorer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 4.5V1H4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 7.5V11H7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1L5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M11 11L7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Expand
        </Link>
      </div>
    </figure>
  );
}
