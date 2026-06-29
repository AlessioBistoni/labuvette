import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { defaultPostSections } from "@/lib/sections";

export type CategoryInput = {
  name: string;
};

export type CategorySummary = Pick<Category, "id" | "name">;

export function normalizeCategoryName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export async function ensureDefaultCategories(): Promise<void> {
  const count = await prisma.category.count();
  if (count > 0) return;

  await prisma.category.createMany({
    data: defaultPostSections().map((name) => ({ name })),
  });
}

export async function getCategories(): Promise<CategorySummary[]> {
  await ensureDefaultCategories();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function createCategory({ name }: CategoryInput): Promise<CategorySummary> {
  return prisma.category.create({
    data: { name },
    select: { id: true, name: true },
  });
}

export async function updateCategoryName(
  id: string,
  nextName: string,
): Promise<CategorySummary | null> {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { name: true },
  });
  if (!existing) return null;

  const updated = await prisma.category.update({
    where: { id },
    data: { name: nextName },
    select: { id: true, name: true },
  });

  await prisma.post.updateMany({
    where: { section: existing.name },
    data: { section: nextName },
  });

  return updated;
}

export async function deleteCategory(id: string): Promise<CategorySummary | null> {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!existing) return null;

  await prisma.post.updateMany({
    where: { section: existing.name },
    data: { section: null },
  });
  await prisma.category.delete({ where: { id } });

  return existing;
}
