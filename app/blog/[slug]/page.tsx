import { supabase } from "@/lib/supabaseClient";
import { Post } from "@/types/post";
import PostContent from "@/components/blog/PostContent";

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, content, created_at")
    .eq("slug", slug)
    .single();

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  // Ensure the fetched data matches the Post type
  const postData: Pick<Post, "title" | "content" | "created_at"> = {
    title: post.title,
    content: post.content,
    created_at: post.created_at,
  };

  return <PostContent {...postData} />;
}
