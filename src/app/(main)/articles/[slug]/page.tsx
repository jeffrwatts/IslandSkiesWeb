import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticleSlugs } from "@/data/articles";
import ArticleBody from "@/components/articles/ArticleBody";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.meta.title} | Island Skies Astro`,
    description: article.meta.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main className="py-12">
      <ArticleBody
        source={article.content}
        title={article.meta.title}
      />
    </main>
  );
}
