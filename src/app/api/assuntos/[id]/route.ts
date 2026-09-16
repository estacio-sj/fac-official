import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // A FK respostas.assunto_id tem "on delete cascade" no schema.sql,
  // então remover o assunto já remove as respostas ligadas a ele.
  const { error } = await supabaseAdmin
    .from("assuntos")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
