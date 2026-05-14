"use client";

import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { BlogFeedDesktop } from "@/components/blog-feed-desktop";
import { BlogFeedMobile } from "@/components/blog-feed-mobile";
import { PostListMobile } from "@/components/post-list-mobile";
import type { Post } from "@/lib/post-types";

type Props = {
  posts: Post[];
  locale: string;
  postSlug?: string | null;
};

function DesktopFeed(props: Props) {
  return (
    <Suspense
      fallback={
        <PostListMobile posts={props.posts} locale={props.locale} />
      }
    >
      <BlogFeedDesktop posts={props.posts} locale={props.locale} />
    </Suspense>
  );
}

export function BlogFeed({ posts, locale, postSlug = null }: Props) {
  const isMobile = useIsMobile();

  // null = SSR / primo paint: feed mobile visibile (niente opacity 0 da Framer)
  if (isMobile !== false) {
    return (
      <BlogFeedMobile posts={posts} locale={locale} />
    );
  }

  return <DesktopFeed posts={posts} locale={locale} postSlug={postSlug} />;
}
