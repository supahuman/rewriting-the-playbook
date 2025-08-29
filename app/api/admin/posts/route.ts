import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServerClient';

export async function POST(request: Request) {
  // Expect Authorization: Bearer <access_token>
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  // Verify token with Supabase
  const { data: userData, error: userError } =
    await supabaseServer.auth.getUser(token);
  if (userError || !userData?.user) {
    console.error('Auth token invalid', userError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { title, summary, content, published } = body;
  if (!title || !content)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // simple slug generation
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 200);

  try {
    const { data, error } = await supabaseServer
      .from('posts')
      .insert([
        {
          slug,
          title,
          summary,
          content,
          published: !!published,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ post: data?.[0] }, { status: 201 });
  } catch (err) {
    console.error('Insert post error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
