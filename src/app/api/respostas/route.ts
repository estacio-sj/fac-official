import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import {
  assuntoExiste,
  brParaIso,
  formatarResposta,
  validarRespostaPayload,
} from "@/lib/respostas";

export async function GET(req: NextRequest) {
  const assuntoId = req.nextUrl.searchParams.get("assunto_id");

  let query = supabaseAdmin
    .from("respostas")
    .select("*")
    .order("data", { ascending: false });

  if (assuntoId) query = query.eq("assunto_id", assuntoId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

  return NextResponse.json((data ?? []).map(formatarResposta));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const erro = validarRespostaPayload(body);
  if (erro) return NextResponse.json({ detail: erro }, { status: 400 });

  const assuntoId = body.assunto_id as number;
  if (!(await assuntoExiste(assuntoId))) {
    return NextResponse.json({ detail: "Assunto não encontrado" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("respostas")
    .insert({
      pergunta: (body.pergunta as string).trim(),
      resposta: (body.resposta as string).trim(),
      assunto_id: assuntoId,
      data: brParaIso(body.data as string | undefined) ?? new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  return NextResponse.json(formatarResposta(data), { status: 201 });
}
