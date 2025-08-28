import { supabaseServer } from '@/lib/supabaseServerClient';
import { Post } from '@/types/post';
import PostContent from '@/components/blog/PostContent';

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const { data: post, error } = await supabaseServer
    .from('posts')
    .select('title, content, created_at')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        Error loading post: {error?.message ?? 'Not found'}
      </div>
    );
  }

  const postData: Pick<Post, 'title' | 'content' | 'created_at'> = {
    title: post.title,
    content: post.content,
    created_at: post.created_at,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PostContent {...postData} />
    </div>
  );
}
