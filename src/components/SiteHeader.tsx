import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 text-xl font-semibold text-foreground">
          <Image src="/images/logo.png" alt="Island Skies logo" width={48} height={48} unoptimized />
          Island Skies Astro
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Gallery
          </Link>
          <Link href="/articles" className="text-foreground hover:text-accent transition-colors">
            Articles
          </Link>
          <span className="text-muted cursor-default">About</span>
        </nav>
      </div>
    </header>
  );
}
