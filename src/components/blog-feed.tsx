"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostList } from "@/components/post-list";
import { PostModal } from "@/components/post-modal";
import type { Post } from "@/lib/post-types";

type Props = {
  posts: Post[];
  locale: string;
};

export function BlogFeed({ posts, locale }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get("post");

  const [openSlug, setOpenSlug] = useState<string | null>(() => {
    if (paramSlug && posts.some((p) => p.slug === paramSlug)) return paramSlug;
    return null;
  });

  useEffect(() => {
    if (paramSlug && posts.some((p) => p.slug === paramSlug)) {
      setOpenSlug(paramSlug);
    } else if (!paramSlug) {
      setOpenSlug(null);
    }
  }, [paramSlug, posts]);

  const openPost = useCallback(
    (slug: string) => {
      setOpenSlug(slug);
      router.push(`/?post=${encodeURIComponent(slug)}`, { scroll: false });
    },
    [router],
  );

  const closePost = useCallback(() => {
    setOpenSlug(null);
    router.push("/", { scroll: false });
  }, [router]);

  const activePost = openSlug
    ? (posts.find((p) => p.slug === openSlug) ?? null)
    : null;

  return (
    <>
      <PostList posts={posts} locale={locale} onOpenPost={openPost} />
      <PostModal post={activePost} locale={locale} onClose={closePost} />
    </>
  );
}
