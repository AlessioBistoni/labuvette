"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { PostList } from "@/components/post-list";
import { PostListMobile } from "@/components/post-list-mobile";
import type { Post } from "@/lib/post-types";

type Props = {
  posts: Post[];
  locale: string;
};

export function BlogFeed({ posts, locale }: Props) {
  const isMobile = useIsMobile();

  if (isMobile !== false) {
    return <PostListMobile posts={posts} locale={locale} />;
  }

  return <PostList posts={posts} locale={locale} />;
}
