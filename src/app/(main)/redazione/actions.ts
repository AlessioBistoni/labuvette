"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import {
  createCategory,
  deleteCategory,
  normalizeCategoryName,
  updateCategoryName,
} from "@/lib/categories";
import {
  createPost,
  deletePostBySlug,
  getPostBySlug,
  postExists,
  updatePost,
} from "@/lib/posts";
import { parsePostSection } from "@/lib/sections";
import { sanitizeSlug } from "@/lib/slug";
import {
  htmlPlainTextLength,
  sanitizeArticleHtml,
} from "@/lib/sanitize-html";
import {
  deleteUploadFile,
  isManagedUpload,
  saveCoverUpload,
} from "@/lib/uploads";

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

async function resolveCoverFromForm(
  formData: FormData,
  slug: string,
  existingCover?: string | null,
): Promise<string | undefined> {
  const coverFile = formData.get("coverFile");
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();

  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      const nextCover = await saveCoverUpload(coverFile, slug);
      if (isManagedUpload(existingCover)) {
        await deleteUploadFile(existingCover!);
      }
      return nextCover;
    } catch {
      redirect(`/redazione/${slug}?err=cover`);
    }
  }

  if (coverUrl) {
    if (coverUrl.startsWith("/") || coverUrl.startsWith("https://")) {
      return coverUrl;
    }
  }

  return existingCover ?? undefined;
}

function parseSectionFromForm(formData: FormData) {
  return parsePostSection(String(formData.get("section") ?? ""));
}

export async function createPostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("slug") ?? ""));
  if (!slug) {
    redirect("/redazione/nuovo?err=slug");
  }
  if (await postExists(slug)) {
    redirect("/redazione/nuovo?err=exists");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 1) redirect("/redazione/nuovo?err=title");

  const date = parseIsoDate(String(formData.get("date") ?? ""), "/redazione/nuovo");
  const author = String(formData.get("author") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const section = parseSectionFromForm(formData);
  const bodyRaw = String(formData.get("body") ?? "");
  const body = sanitizeArticleHtml(bodyRaw);

  if (htmlPlainTextLength(body) < 3) {
    redirect("/redazione/nuovo?err=body");
  }

  let cover: string | undefined;
  const coverFile = formData.get("coverFile");
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      cover = await saveCoverUpload(coverFile, slug);
    } catch {
      redirect("/redazione/nuovo?err=cover");
    }
  } else if (coverUrl && (coverUrl.startsWith("/") || coverUrl.startsWith("https://"))) {
    cover = coverUrl;
  }

  await createPost({
    slug,
    title,
    date,
    author: author || undefined,
    excerpt: excerpt || undefined,
    cover,
    section,
    content: body,
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect(`/redazione/${slug}?saved=1`);
}

export async function updatePostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("originalSlug") ?? ""));
  if (!slug || !(await postExists(slug))) {
    redirect("/redazione?err=missing");
  }

  const existing = await getPostBySlug(slug);
  const previousCover = existing?.cover ?? null;

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
  const section = parseSectionFromForm(formData);
  const bodyRaw = String(formData.get("body") ?? "");
  const body = sanitizeArticleHtml(bodyRaw);

  if (htmlPlainTextLength(body) < 3) {
    redirect(`/redazione/${slug}?err=body`);
  }

  const cover = await resolveCoverFromForm(formData, slug, previousCover);

  await updatePost(slug, {
    title,
    date,
    author: author || undefined,
    excerpt: excerpt || undefined,
    cover,
    section,
    content: body,
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect(`/redazione/${slug}?saved=1`);
}

export async function deletePostAction(formData: FormData) {
  await requireEditor();

  const slug = sanitizeSlug(String(formData.get("slug") ?? ""));
  if (!slug) {
    redirect("/redazione?err=missing");
  }

  const removed = await deletePostBySlug(slug);
  if (!removed) {
    redirect("/redazione?err=missing");
  }

  if (isManagedUpload(removed.cover)) {
    await deleteUploadFile(removed.cover!);
  }

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/redazione?deleted=1");
}

export async function createCategoryAction(formData: FormData) {
  await requireEditor();

  const name = normalizeCategoryName(String(formData.get("name") ?? ""));
  if (name.length < 1) redirect("/redazione?err=category-name");

  try {
    await createCategory({ name });
  } catch {
    redirect("/redazione?err=category-exists");
  }

  revalidatePath("/");
  revalidatePath("/redazione");
  redirect("/redazione?category=created");
}

export async function updateCategoryAction(formData: FormData) {
  await requireEditor();

  const id = String(formData.get("id") ?? "").trim();
  const name = normalizeCategoryName(String(formData.get("name") ?? ""));
  if (!id) redirect("/redazione?err=category-missing");
  if (name.length < 1) redirect("/redazione?err=category-name");

  try {
    const updated = await updateCategoryName(id, name);
    if (!updated) redirect("/redazione?err=category-missing");
  } catch {
    redirect("/redazione?err=category-exists");
  }

  revalidatePath("/");
  revalidatePath("/redazione");
  redirect("/redazione?category=updated");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireEditor();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/redazione?err=category-missing");

  const removed = await deleteCategory(id);
  if (!removed) redirect("/redazione?err=category-missing");

  revalidatePath("/");
  revalidatePath("/redazione");
  redirect("/redazione?category=deleted");
}
