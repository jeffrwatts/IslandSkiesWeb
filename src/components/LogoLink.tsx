"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LogoLink() {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new Event("go-home"));
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="flex items-center gap-3 text-xl font-semibold text-foreground"
    >
      <Image src="/images/logo.png" alt="Island Skies logo" width={48} height={48} unoptimized />
      Island Skies Astro
    </Link>
  );
}
