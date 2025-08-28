import { supabaseServer } from '@/lib/supabaseServerClient';
import BlogPostList from '@/components/blog/BlogPostList';

export default async function BlogIndexPage() {
  const { data: posts, error } = await supabaseServer
    .from('posts')
    .select('id, slug, title, summary, content, published, created_at') // Include all fields
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        Error loading posts: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          The Playbook — Blog
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Rewriting the playbook for relationships in the age of technology —
          practical advice, cultural observations, and actionable guides.
        </p>
      </header>

      <main>
        <BlogPostList posts={posts || []} />
      </main>
    </div>
  );
}
