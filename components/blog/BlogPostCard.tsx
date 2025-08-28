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
    <li
      key={id}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <Link href={`/blog/${slug}`} className="p-6 h-full flex flex-col">
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md mb-4 flex items-center justify-center text-gray-400">
          <span className="text-sm">Image</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {summary}
        </p>

        <div className="mt-auto flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {created_at ? new Date(created_at).toLocaleDateString() : ''}
          </span>
          <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs">
            Read
          </span>
        </div>
      </Link>
    </li>
  );
}
