import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleImage from "./mdx/ArticleImage";
import ImageSection from "./mdx/ImageSection";

const components = {
  ArticleImage,
  ImageSection,
};

export default function ArticleBody({
  source,
  title,
  date,
}: {
  source: string;
  title: string;
  date: string;
}) {
  return (
    <article className="article-content max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
        <time className="text-sm text-muted">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>
      <MDXRemote source={source} components={components} />
    </article>
  );
}
