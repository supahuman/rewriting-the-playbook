"use client";

import { Post } from "@/types/post";
import BlogPostCard from "./BlogPostCard";

interface BlogPostListProps {
  posts: Post[];
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <ul>
      {posts.map((post) => (
        <BlogPostCard key={post.id} {...post} />
      ))}
    </ul>
  );
}
