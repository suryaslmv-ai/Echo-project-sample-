import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { sb, user } = await requireUser();
  if (!user) return NextResponse.json({ error: { message: "Sign in required." } }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: { message: "Invalid id." } }, { status: 400 });
  // RLS also enforces ownership, so another user's row simply won't match.
  const { error } = await sb.from("scenarios").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: { message: "Could not delete." } }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
