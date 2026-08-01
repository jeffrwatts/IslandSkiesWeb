import Link from "next/link";
import LogoLink from "./LogoLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <LogoLink />
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Gallery
          </Link>
          <Link href="/articles" className="text-foreground hover:text-accent transition-colors">
            Articles
          </Link>
          <Link href="/about" className="text-foreground hover:text-accent transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
