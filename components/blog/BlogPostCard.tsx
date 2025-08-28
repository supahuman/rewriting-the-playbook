'use client';

import Link from 'next/link';
import { Post } from '@/types/post';

export default function BlogPostCard({
  id,
  slug,
  title,
  summary,
  created_at,
}: Post) {
  return (
    <li key={id}>
      <Link href={`/blog/${slug}`} className="block">
        <h2>{title}</h2>
        <p>{summary}</p>
        <small>
          {created_at ? new Date(created_at).toLocaleDateString() : ''}
        </small>
      </Link>
    </li>
  );
}
