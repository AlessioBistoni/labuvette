export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  cover?: string;
};

export type Post = PostMeta & {
  content: string;
};
