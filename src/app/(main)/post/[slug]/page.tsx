import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** I post si aprono come overlay sulla home, non come pagina separata. */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/?post=${encodeURIComponent(slug)}`);
}
