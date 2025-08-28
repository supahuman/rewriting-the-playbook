import { supabase } from "@/lib/supabaseClient";
import BlogPostList from "@/components/blog/BlogPostList";

export default async function BlogIndexPage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, summary, content, published, created_at") // Include all fields
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  return (
    <div>
      <h1>Blog</h1>
      <BlogPostList posts={posts || []} />
    </div>
  );
}
