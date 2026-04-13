import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 mt-auto">
      <div className="flex items-center justify-center gap-5">
        <Image
          src="/images/logo.png"
          alt="Island Skies logo"
          width={64}
          height={64}
          unoptimized
        />
        <div className="text-base text-muted">
          <p className="text-lg text-foreground font-semibold">Island Skies Astro</p>
          <p>Astrophotography by Jeff Watts</p>
          <p><a href="mailto:islandskiesastro@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">islandskiesastro@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
}
