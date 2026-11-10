import { BLOG_ARTICLES, BlogArticle } from './blogArticles';

export type Post = BlogArticle;
export const POSTS_DATA: Post[] = BLOG_ARTICLES;

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS_DATA.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return POSTS_DATA.map((p) => p.slug);
}
