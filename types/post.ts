export interface Post {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content: string;
  published: boolean;
  created_at: string; // ISO date string
}
