"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Post } from "@/types/post";

type PostContentProps = Pick<Post, "title" | "content" | "created_at">;

export default function PostContent({ title, content, created_at }: PostContentProps) {
  const readingTime = useMemo(() => {
    const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [content]);

  const formattedDate = created_at ? new Date(created_at).toLocaleDateString() : "";

  // simple share handlers (client-only)
  function shareTwitter() {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener");
  }

  function copyLink() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(window.location.href);
    // minimal feedback could be added, but keep simple
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="mb-6">
        <Link href="/blog" className="text-sm text-indigo-600 hover:underline">← Back to blog</Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">{title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{formattedDate}</time>
          <span aria-hidden>•</span>
          <span>{readingTime} min read</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={shareTwitter} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Share
          </button>
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-800">
            Copy link
          </button>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <footer className="mt-12 border-t pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Enjoyed this? Subscribe for more practical guides.</p>
          </div>
          <div>
            <Link href="/newsletter" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">Subscribe</Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
