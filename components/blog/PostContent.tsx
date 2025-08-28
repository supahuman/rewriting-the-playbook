"use client";

import { Post } from "@/types/post";

type PostContentProps = Pick<Post, "title" | "content" | "created_at">;

export default function PostContent({
  title,
  content,
  created_at,
}: PostContentProps) {
  return (
    <article>
      <h1>{title}</h1>
      <p>{new Date(created_at).toLocaleDateString()}</p>
      <div>{content}</div>
    </article>
  );
}
