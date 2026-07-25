import { getExplorerDataset } from "@/data/explorer-datasets";
import ExplorerWithExpand from "@/components/explorer/ExplorerWithExpand";

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
      <ExplorerWithExpand dataset={dataset} />
    </figure>
  );
}
