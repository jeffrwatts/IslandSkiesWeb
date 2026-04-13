import Link from "next/link";
import { getAllArticles } from "@/data/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Island Skies Astro",
  description: "Articles about the science behind astronomical objects",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Articles</h1>
      <p className="text-muted mb-10">
        Exploring the science behind the objects in the night sky.
      </p>

      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="block bg-card rounded-lg p-6 border border-white/5 hover:border-accent/30 transition-colors"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {article.title}
            </h2>
            <p className="text-muted text-sm">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
