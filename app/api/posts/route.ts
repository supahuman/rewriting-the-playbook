import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { Post } from "@/types/post";

// GET handler for fetching posts
export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, summary, content, published, created_at") // Keep this as a string
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Use the Post interface to type the data
  return NextResponse.json(data as Post[], { status: 200 });
}
