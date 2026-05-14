"use client";

import { PostListMobile } from "@/components/post-list-mobile";
import type { Post } from "@/lib/post-types";

type Props = {
  posts: Post[];
  locale: string;
};

export function BlogFeedMobile({ posts, locale }: Props) {
  return <PostListMobile posts={posts} locale={locale} />;
}
