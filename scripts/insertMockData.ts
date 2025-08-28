import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data
const mockPosts = [
  {
    title: 'Rewriting the Playbook: A New Era of Dating',
    content:
      'In the age of technology, we are redefining the dating dynamic. This is about forging meaningful connections and building a foundation of respect.',
    author: 'Meroka',
    created_at: new Date().toISOString(),
  },
  {
    title: 'From Broken Boys to Knights',
    content:
      'Our mission is to transform men into knights—individuals who uphold honor, integrity, and strength in their relationships.',
    author: 'Meroka',
    created_at: new Date().toISOString(),
  },
  {
    title: 'The Technology Paradox in Modern Relationships',
    content:
      'While technology connects us, it also creates barriers. Let’s explore how to navigate this paradox and build authentic relationships.',
    author: 'Meroka',
    created_at: new Date().toISOString(),
  },
];

async function insertMockData() {
  try {
    const { data, error } = await supabase.from('posts').insert(mockPosts);

    if (error) {
      console.error('Error inserting mock data:', error);
    } else {
      console.log('Mock data inserted successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

insertMockData();
