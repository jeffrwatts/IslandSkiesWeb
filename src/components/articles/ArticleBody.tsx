import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleImage from "./mdx/ArticleImage";
import ImageSection from "./mdx/ImageSection";
import ImageCompare from "./mdx/ImageCompare";
import ArticleSvg from "./mdx/ArticleSvg";

const components = {
  ArticleImage,
  ImageSection,
  ImageCompare,
  ArticleSvg,
};

export default function ArticleBody({
  source,
  title,
}: {
  source: string;
  title: string;
}) {
  return (
    <article className="article-content max-w-6xl mx-auto px-4 pb-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
      </header>
      <MDXRemote source={source} components={components} />
    </article>
  );
}
