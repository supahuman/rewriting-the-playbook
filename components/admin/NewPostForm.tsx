'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [sendingMagicLink, setSendingMagicLink] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data?.session?.user ?? null);
    }
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function sendMagicLink(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    if (!email) {
      setMessage('Enter an email to sign in');
      return;
    }
    setSendingMagicLink(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(`Error sending magic link: ${error.message}`);
    else setMessage('Magic link sent — check your email and follow the link.');
    setSendingMagicLink(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setMessage('Signed out');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!user) {
      setMessage('You must be signed in to create a post.');
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setMessage('No access token available; please sign in again.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, summary, content, published }),
      });

      const body = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${body?.error ?? res.statusText}`);
      } else {
        setMessage('Post created successfully.');
        setTitle('');
        setSummary('');
        setContent('');
        setPublished(false);
      }
    } catch (err) {
      setMessage(`Unexpected error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  // If not signed in, show a small sign-in panel
  if (!user)
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in to publish</h2>
        <form onSubmit={sendMagicLink} className="space-y-3">
          <label className="block text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={sendingMagicLink}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {sendingMagicLink ? 'Sending…' : 'Send magic link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('');
                setMessage(null);
              }}
              className="px-3 py-2 border rounded"
            >
              Reset
            </button>
          </div>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </form>
      </div>
    );

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow"
    >
      <div className="relative flex items-center justify-center mb-4">
        <h2 className="text-xl font-semibold text-center">New Blog Post</h2>
        <div className="absolute right-0 top-0 text-sm">
          Signed in as <strong>{user.email}</strong>
          <button
            type="button"
            onClick={signOut}
            className="ml-3 px-2 py-1 border rounded text-xs"
          >
            Sign out
          </button>
        </div>
      </div>

      <label className="block mb-2 text-sm">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 border rounded px-3 py-2"
        required
      />

      <label className="block mb-2 text-sm">Summary</label>
      <input
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full mb-4 border rounded px-3 py-2"
      />

      <label className="block mb-2 text-sm">Content (HTML or Markdown)</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full mb-4 border rounded px-3 py-2"
        required
      />

      <label className="inline-flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <span className="text-sm">Publish</span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Publishing…' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setSummary('');
            setContent('');
            setPublished(false);
          }}
          className="px-3 py-2 border rounded"
        >
          Reset
        </button>
      </div>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}
