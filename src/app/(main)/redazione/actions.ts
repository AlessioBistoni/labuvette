"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import {
  deletePostFile,
  postExists,
  sanitizeSlug,
  writePostMarkdown,
} from "@/lib/post-file";

async function requireEditor() {
  const s = await getSession();
  if (!s) redirect("/login?from=/redazione");
  return s;
}

function parseIsoDate(raw: string, errRedirect: string) {
  const d = raw.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const sep = errRedirect.includes("?") ? "&" : "?";
    redirect(`${errRedirect}${sep}err=date`);
  }
  return d;
}

export async function createPostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("slug") ?? ""));
  if (!slug) {
    redirect("/redazione/nuovo?err=slug");
  }
  if (postExists(slug)) {
    redirect("/redazione/nuovo?err=exists");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 1) redirect("/redazione/nuovo?err=title");

  const date = parseIsoDate(String(formData.get("date") ?? ""), "/redazione/nuovo");
  const author = String(formData.get("author") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  if (body.trim().length < 3) {
    redirect("/redazione/nuovo?err=body");
  }

  writePostMarkdown(slug, body, {
    title,
    date,
    author: author || undefined,
    excerpt: excerpt || undefined,
    cover: cover || undefined,
  });

  revalidatePath("/");
  revalidatePath(`/post/${slug}`);
  redirect(`/redazione/${slug}?saved=1`);
}

export async function updatePostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("originalSlug") ?? ""));
  if (!slug || !postExists(slug)) {
    redirect("/redazione?err=missing");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 1) {
    redirect(`/redazione/${slug}?err=title`);
  }

  const date = parseIsoDate(
    String(formData.get("date") ?? ""),
    `/redazione/${slug}`,
  );
  const author = String(formData.get("author") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  if (body.trim().length < 3) {
    redirect(`/redazione/${slug}?err=body`);
  }

  writePostMarkdown(slug, body, {
    title,
    date,
    author: author || undefined,
    excerpt: excerpt || undefined,
    cover: cover || undefined,
  });

  revalidatePath("/");
  revalidatePath(`/post/${slug}`);
  redirect(`/redazione/${slug}?saved=1`);
}

export async function deletePostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("slug") ?? ""));
  if (!slug || !postExists(slug)) {
    redirect("/redazione?err=missing");
  }

  deletePostFile(slug);
  revalidatePath("/");
  revalidatePath(`/post/${slug}`);
  redirect("/redazione?deleted=1");
}
