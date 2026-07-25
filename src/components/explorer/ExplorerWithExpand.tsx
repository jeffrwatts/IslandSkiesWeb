"use client";

import { useEffect, useRef, useState } from "react";
import ExplorerViewer from "./ExplorerViewer";
import type { ExplorerDataset } from "@/data/explorer-datasets";

type WebkitDoc = Document & { webkitFullscreenElement?: Element };
type WebkitEl = HTMLElement & { webkitRequestFullscreen?: () => void };

export default function ExplorerWithExpand({ dataset }: { dataset: ExplorerDataset }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleChange() {
      const doc = document as WebkitDoc;
      const el = containerRef.current;
      setIsFullscreen(document.fullscreenElement === el || doc.webkitFullscreenElement === el);
    }
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  function expand() {
    const el = containerRef.current as WebkitEl | null;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <ExplorerViewer dataset={dataset} isFullscreen={isFullscreen} />

      {/* Expand button — hidden once fullscreen (browser Esc exits) */}
      {!isFullscreen && (
        <button
          onClick={expand}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
          title="View fullscreen"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 4.5V1H4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 7.5V11H7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1L5 5"       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M11 11L7 7"     stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Expand
        </button>
      )}
    </div>
  );
}
