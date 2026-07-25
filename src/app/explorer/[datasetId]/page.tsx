import { notFound } from "next/navigation";
import Link from "next/link";
import { getExplorerDataset } from "@/data/explorer-datasets";
import ExplorerViewer from "@/components/explorer/ExplorerViewer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ datasetId: string }>;
}): Promise<Metadata> {
  const { datasetId } = await params;
  return { title: `Explorer — ${datasetId} | Island Skies Astro` };
}

export default async function ExplorerPage({
  params,
}: {
  params: Promise<{ datasetId: string }>;
}) {
  const { datasetId } = await params;
  const dataset = getExplorerDataset(datasetId);
  if (!dataset) notFound();

  return (
    <div className="flex flex-col flex-1 bg-black">
      {/* Thin top bar */}
      <div className="flex items-center px-4 py-3 border-b border-white/10">
        <Link
          href="/articles"
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Articles
        </Link>
      </div>

      {/* Explorer fills remaining space, image constrained to viewport height */}
      <div className="flex flex-1 items-center justify-center p-4 min-h-0">
        <div className="w-full max-w-6xl">
          <div className="rounded-lg overflow-hidden">
            <ExplorerViewer dataset={dataset} />
          </div>
        </div>
      </div>
    </div>
  );
}
