import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import {
  assuntoExiste,
  brParaIso,
  formatarResposta,
  validarRespostaPayload,
} from "@/lib/respostas";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  const erro = validarRespostaPayload(body);
  if (erro) return NextResponse.json({ detail: erro }, { status: 400 });

  const assuntoId = body.assunto_id as number;
  if (!(await assuntoExiste(assuntoId))) {
    return NextResponse.json({ detail: "Assunto não encontrado" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("respostas")
    .update({
      pergunta: (body.pergunta as string).trim(),
      resposta: (body.resposta as string).trim(),
      assunto_id: assuntoId,
      verificado: typeof body.verificado === "boolean" ? body.verificado : false,
      ...(brParaIso(body.data as string | undefined)
        ? { data: brParaIso(body.data as string) }
        : {}),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ detail: "Resposta não encontrada" }, { status: 404 });

  return NextResponse.json(formatarResposta(data));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  if (typeof body?.verificado !== "boolean") {
    return NextResponse.json(
      { detail: "Campo 'verificado' (boolean) é obrigatório" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("respostas")
    .update({ verificado: body.verificado })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ detail: "Resposta não encontrada" }, { status: 404 });

  return NextResponse.json(formatarResposta(data));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("respostas")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
