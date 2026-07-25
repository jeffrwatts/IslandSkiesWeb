"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { ExplorerAnnotation, ExplorerImage, ExplorerDataset } from "@/data/explorer-datasets";

// ── Small-dot annotation (no radius) ─────────────────────────────────────────
// Positioned as a centred div at (x%, y%) of the image.

function DotAnnotation({
  ann,
  imageWidth,
  imageHeight,
  onNavigate,
}: {
  ann: ExplorerAnnotation;
  imageWidth?: number;
  imageHeight?: number;
  onNavigate: (id: string) => void;
}) {
  const isNavigable = ann.targetId !== null;
  const xPct = imageWidth ? (ann.x / imageWidth) * 100 : ann.x;
  const yPct = imageHeight ? (ann.y / imageHeight) * 100 : ann.y;
  const labelLeft = xPct > 60;

  const handleClick = isNavigable ? () => onNavigate(ann.targetId!) : undefined;

  const circle = (
    <div
      onClick={handleClick}
      className={[
        "w-4 h-4 rounded-full border-2 flex-shrink-0",
        isNavigable
          ? "border-white cursor-pointer hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.55)] transition-shadow"
          : "border-white/45 cursor-default",
      ].join(" ")}
    />
  );

  const label = (
    <span
      onClick={handleClick}
      className={[
        "text-xs whitespace-nowrap [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]",
        isNavigable ? "text-white cursor-pointer" : "text-white/60",
      ].join(" ")}
      style={{ pointerEvents: isNavigable ? "auto" : "none" }}
    >
      {ann.label}
    </span>
  );

  const tick = <div className="w-5 h-px bg-white/55 flex-shrink-0" />;

  return (
    <div
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: isNavigable ? "auto" : "none" }}>{circle}</div>

      {labelLeft ? (
        <div
          className="absolute right-full top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-1.5"
          style={{ marginRight: 4, pointerEvents: "none" }}
        >
          {tick}
          <div style={{ pointerEvents: isNavigable ? "auto" : "none" }}>{label}</div>
        </div>
      ) : (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-1.5"
          style={{ marginLeft: 4, pointerEvents: "none" }}
        >
          {tick}
          <div style={{ pointerEvents: isNavigable ? "auto" : "none" }}>{label}</div>
        </div>
      )}
    </div>
  );
}

// ── Large-circle annotation label (circle drawn in SVG, label in HTML) ────────
// The label is anchored to the edge of the circle rather than the centre.

function CircleLabel({
  ann,
  imageWidth,
  imageHeight,
  onNavigate,
}: {
  ann: ExplorerAnnotation & { radius: number };
  imageWidth: number;
  imageHeight: number;
  onNavigate: (id: string) => void;
}) {
  const isNavigable = ann.targetId !== null;
  const xPct = (ann.x / imageWidth) * 100;
  const yPct = (ann.y / imageHeight) * 100;
  const rPct = (ann.radius / imageWidth) * 100; // radius as % of image width
  const labelLeft = xPct > 60;

  // Anchor the label at the circle's left or right edge
  const edgeXPct = labelLeft ? xPct - rPct : xPct + rPct;

  const handleClick = isNavigable ? () => onNavigate(ann.targetId!) : undefined;

  const label = (
    <span
      onClick={handleClick}
      className={[
        "text-xs whitespace-nowrap [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]",
        isNavigable ? "text-white cursor-pointer" : "text-white/60",
      ].join(" ")}
      style={{ pointerEvents: isNavigable ? "auto" : "none" }}
    >
      {ann.label}
    </span>
  );

  const tick = <div className="w-5 h-px bg-white/55 flex-shrink-0" />;

  // For a left label, anchor from the RIGHT edge of the container so the text
  // grows leftward. For a right label, anchor from the LEFT edge so it grows right.
  const containerStyle: React.CSSProperties = labelLeft
    ? { position: "absolute", right: `${100 - edgeXPct}%`, top: `${yPct}%`, transform: "translateY(-50%)", pointerEvents: "none" }
    : { position: "absolute", left: `${edgeXPct}%`, top: `${yPct}%`, transform: "translateY(-50%)", pointerEvents: "none" };

  return (
    <div style={containerStyle}>
      {labelLeft ? (
        <div className="flex flex-row-reverse items-center gap-1.5" style={{ pointerEvents: "none" }}>
          {tick}
          <div style={{ pointerEvents: isNavigable ? "auto" : "none" }}>{label}</div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5" style={{ pointerEvents: "none" }}>
          {tick}
          <div style={{ pointerEvents: isNavigable ? "auto" : "none" }}>{label}</div>
        </div>
      )}
    </div>
  );
}

// ── Annotation overlay ────────────────────────────────────────────────────────

function AnnotationOverlay({
  image,
  onNavigate,
  onBack,
  showBack,
}: {
  image: ExplorerImage;
  onNavigate: (id: string) => void;
  onBack: () => void;
  showBack: boolean;
}) {
  const { annotations, width, height } = image;
  const largeCircles = annotations.filter(
    (a): a is ExplorerAnnotation & { radius: number } =>
      typeof a.radius === "number" && !!width && !!height
  );
  const dots = annotations.filter((a) => typeof a.radius !== "number");

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG layer: large circle rings, drawn in native image pixels */}
      {largeCircles.length > 0 && width && height && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {largeCircles.map((ann, i) => (
            <circle
              key={i}
              cx={ann.x}
              cy={ann.y}
              r={ann.radius}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={8}
            />
          ))}
        </svg>
      )}

      {/* HTML layer: labels for large circles */}
      {largeCircles.map((ann, i) =>
        width && height ? (
          <CircleLabel
            key={i}
            ann={ann}
            imageWidth={width}
            imageHeight={height}
            onNavigate={onNavigate}
          />
        ) : null
      )}

      {/* HTML layer: small dot annotations */}
      {dots.map((ann, i) => (
        <DotAnnotation
          key={i}
          ann={ann}
          imageWidth={width}
          imageHeight={height}
          onNavigate={onNavigate}
        />
      ))}

      {/* Back button */}
      {showBack && (
        <button
          onClick={onBack}
          className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full transition-colors pointer-events-auto"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8 1L3 6L8 11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}

// ── Viewer ───────────────────────────────────────────────────────────────────

export default function ExplorerViewer({
  dataset,
  isFullscreen = false,
}: {
  dataset: ExplorerDataset;
  isFullscreen?: boolean;
}) {
  const imageMap = new Map(dataset.images.map((img) => [img.id, img]));

  const [stack, setStack] = useState<string[]>([dataset.rootId]);
  const [phase, setPhase] = useState<"visible" | "exiting" | "entering">("visible");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const pendingTarget = useRef<string | null>(null);

  const currentImage = imageMap.get(stack[stack.length - 1])!;

  const startNav = useCallback(
    (targetId: string, isBack: boolean) => {
      if (phase !== "visible") return;
      pendingTarget.current = targetId;
      setDirection(isBack ? "back" : "forward");
      setPhase("exiting");
    },
    [phase]
  );

  const navigate = useCallback(
    (targetId: string) => startNav(targetId, false),
    [startNav]
  );

  const goBack = useCallback(() => {
    if (stack.length <= 1) return;
    startNav(stack[stack.length - 2], true);
  }, [stack, startNav]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = setTimeout(() => {
      const target = pendingTarget.current;
      if (target) {
        setStack((prev) =>
          direction === "back" ? prev.slice(0, -1) : [...prev, target]
        );
        pendingTarget.current = null;
        setNaturalSize(null);
      }
      setPhase("entering");
    }, 280);
    return () => clearTimeout(timer);
  }, [phase, direction]);

  useEffect(() => {
    if (phase !== "entering") return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("visible"))
    );
    return () => cancelAnimationFrame(id);
  }, [phase]);

  const imgStyle: React.CSSProperties =
    phase === "exiting"
      ? { opacity: 0, transform: direction === "back" ? "scale(0.93)" : "scale(1.07)", transition: "opacity 280ms ease, transform 280ms ease" }
      : phase === "entering"
      ? { opacity: 0, transform: direction === "back" ? "scale(1.05)" : "scale(0.96)", transition: "none" }
      : { opacity: 1, transform: "scale(1)", transition: "opacity 280ms ease, transform 280ms ease" };

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getCloudinaryUrl(currentImage.cloudinaryId)}
      alt={currentImage.id}
      className="block w-full h-auto"
      style={imgStyle}
      draggable={false}
      onLoad={(e) => {
        const el = e.currentTarget;
        setNaturalSize({ w: el.naturalWidth, h: el.naturalHeight });
      }}
    />
  );

  const overlay = phase === "visible" && (
    <AnnotationOverlay
      image={currentImage}
      onNavigate={navigate}
      onBack={goBack}
      showBack={stack.length > 1}
    />
  );

  if (isFullscreen) {
    const ratio = naturalSize ? naturalSize.w / naturalSize.h : null;
    const innerStyle: React.CSSProperties = ratio
      ? { width: `min(100%, calc(100vh * ${ratio}))`, aspectRatio: `${naturalSize!.w} / ${naturalSize!.h}` }
      : { width: "100%" };

    return (
      <div className="w-full h-full flex items-center justify-center bg-black select-none">
        <div className="relative overflow-hidden" style={innerStyle}>
          <div className="overflow-hidden w-full">{img}</div>
          {overlay}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black select-none">
      <div className="overflow-hidden w-full">{img}</div>
      {overlay}
    </div>
  );
}
