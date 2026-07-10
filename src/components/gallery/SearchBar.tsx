"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue) {
        params.set("q", newValue);
      } else {
        params.delete("q");
      }
      router.replace(`?${params.toString()}`);
    }, 300);
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search images..."
      className="w-full rounded-lg bg-white/10 px-3 py-1.5 text-sm text-foreground placeholder:text-muted border border-transparent focus:border-accent focus:outline-none"
    />
  );
}
