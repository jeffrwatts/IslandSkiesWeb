import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMeta {
  title: string;
  slug: string;
  order: number;
  excerpt: string;
  heroImage?: string;
  tags: string[];
  relatedGalleryImages?: string[];
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

const articlesDirectory = path.join(process.cwd(), "src/content/articles");

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      slug: data.slug,
      order: data.order ?? 999,
      excerpt: data.excerpt,
      heroImage: data.heroImage,
      tags: data.tags ?? [],
      relatedGalleryImages: data.relatedGalleryImages,
    } as ArticleMeta;
  });

  return articles.sort((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug: string): Article | null {
  const files = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    if (data.slug === slug) {
      return {
        meta: {
          title: data.title,
          slug: data.slug,
          order: data.order ?? 999,
          excerpt: data.excerpt,
          heroImage: data.heroImage,
          tags: data.tags ?? [],
          relatedGalleryImages: data.relatedGalleryImages,
        },
        content,
      };
    }
  }

  return null;
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
