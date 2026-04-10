import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <Image src="/images/logo.png" alt="Island Skies logo" width={48} height={48} />
          <div>
            <div className="text-xl font-semibold leading-tight">Island Skies Astro</div>
            <div className="text-xs text-muted">Astrophotography by Jeff Watts</div>
          </div>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Gallery
          </Link>
          <span className="text-muted cursor-default">Articles</span>
          <span className="text-muted cursor-default">About</span>
        </nav>
      </div>
    </header>
  );
}
