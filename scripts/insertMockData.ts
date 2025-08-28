import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Data shape for posts
interface Post {
  slug: string;
  title: string;
  summary: string;
  content: string;
  published: boolean;
  created_at?: string;
}

// PostgREST error shape (partial)
interface PostgRESTError {
  code?: string;
  message?: string | null;
  details?: string | null;
}

// Resolve Supabase connection details from common env names
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

function assertEnv() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_URL and SUPABASE_KEY) in your environment.'
    );
    process.exit(1);
  }
}

// Create Supabase client (will only be used when not in dry run)
let supabase: SupabaseClient | null = null;

// Simple slugify helper
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 200);
}

// Mock posts tailored to "Rewriting the Playbook"
const basePosts = [
  {
    title: 'Rewriting the Playbook: A New Era of Dating',
    content:
      'In the age of technology, we are redefining the dating dynamic. This is about forging meaningful connections and building a foundation of respect.',
  },
  {
    title: 'From Broken Boys to Knights',
    content:
      'Our mission is to transform men into knights—individuals who uphold honor, integrity, and strength in their relationships.',
  },
  {
    title: 'The Technology Paradox in Modern Relationships',
    content:
      'While technology connects us, it also creates barriers. Let’s explore how to navigate this paradox and build authentic relationships.',
  },
];

const mockPosts: Post[] = basePosts.map((p, i) => ({
  slug: slugify(p.title),
  title: p.title,
  summary: p.content.slice(0, 140),
  content: p.content,
  published: i === 0, // first post published, others drafts
  created_at: new Date().toISOString(),
}));

async function insertMockData(dryRun = false) {
  if (dryRun) {
    console.log('Dry run mode - the following data would be inserted:');
    console.log(JSON.stringify(mockPosts, null, 2));
    return;
  }

  assertEnv();
  supabase = createClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
    auth: { persistSession: false },
  });

  try {
    // Only insert allowed columns to match table schema
    const payload = mockPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      content: p.content,
      published: p.published,
      created_at: p.created_at,
    }));

    const res = await supabase.from('posts').insert(payload).select();
    const data = res.data as Post[] | null;
    const error = res.error;

    if (error) {
      console.error('Error inserting mock data:', error);

      const pgError = error as PostgRESTError;
      if (pgError.code === 'PGRST204') {
        const msg = pgError.message ?? '';
        const m = msg.match(/Could not find the '([^']+)' column/);
        const missing = m ? m[1] : null;
        if (missing) {
          console.warn(
            `Detected missing column '${missing}'. Retrying insert without that field...`
          );
          // Build stripped payload matching allowed columns after removing the missing key
          const strippedPayload = mockPosts.map((p) => {
            const obj: Record<string, unknown> = {
              slug: p.slug,
              title: p.title,
              summary: p.summary,
              content: p.content,
              published: p.published,
              created_at: p.created_at,
            };
            delete obj[missing];
            return obj;
          });

          const retry = await supabase
            .from('posts')
            .insert(strippedPayload)
            .select();
          if (retry.error) {
            console.error('Retry failed:', retry.error);
            console.error(
              `Check your 'posts' table schema in Supabase. You may need to run: ALTER TABLE public.posts ADD COLUMN ${missing} text;`
            );
            process.exit(1);
          }
          const retryData = retry.data as unknown[] | null;
          console.log(
            `Mock data inserted successfully after stripping '${missing}' (${
              retryData?.length ?? 0
            } rows).`
          );
          return;
        }
      }

      process.exit(1);
    }

    console.log(`Mock data inserted successfully (${data?.length ?? 0} rows).`);
  } catch (err) {
    console.error('Unexpected error while inserting mock data:', err);
    process.exit(1);
  }
}

// CLI entry
const args = process.argv.slice(2);
const dry = args.includes('--dry') || process.env.DRY_RUN === '1';

insertMockData(dry).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
