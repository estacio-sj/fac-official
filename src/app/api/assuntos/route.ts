import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("assuntos")
    .select("*")
    .order("nome");

    // console.log("DATA:", data);
    // console.log("ERROR:", error) para o caso da aplicação parar de funcionar

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const nome = typeof body?.nome === "string" ? body.nome.trim().toUpperCase() : "";

  if (!nome) {
    return NextResponse.json({ detail: "Nome é obrigatório" }, { status: 400 });
  }

  const { data: existente } = await supabaseAdmin
    .from("assuntos")
    .select("id")
    .eq("nome", nome)
    .maybeSingle();

  if (existente) {
    return NextResponse.json({ detail: "Assunto já cadastrado" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("assuntos")
    .insert({ nome })
    .select()
    .single();

  if (error) return NextResponse.json({ detail: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
