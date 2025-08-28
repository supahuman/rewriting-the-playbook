'use client';

import { Post } from '@/types/post';
import BlogPostCard from './BlogPostCard';

interface BlogPostListProps {
  posts: Post[];
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogPostCard key={post.id} {...post} />
      ))}
    </ul>
  );
}
