import { supabaseAdmin } from "./supabaseServer";

/** "dd/mm/aaaa" -> "aaaa-mm-dd" (formato aceito pela coluna DATE do Postgres) */
export function brParaIso(dataBr?: string | null): string | null {
  if (!dataBr) return null;
  const [dia, mes, ano] = dataBr.split("/");
  if (!dia || !mes || !ano) return null;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

/** "aaaa-mm-dd" (o que o Supabase devolve) -> "dd/mm/aaaa" (o que a API expõe) */
export function isoParaBr(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarResposta(row: {
  id: number;
  pergunta: string;
  resposta: string;
  data: string;
  assunto_id: number;
}) {
  return { ...row, data: isoParaBr(row.data) };
}

export async function assuntoExiste(id: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("assuntos")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  return Boolean(data);
}

export function validarRespostaPayload(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return "Corpo da requisição inválido";
  const b = body as Record<string, unknown>;
  if (typeof b.pergunta !== "string" || !b.pergunta.trim())
    return "Pergunta é obrigatória";
  if (typeof b.resposta !== "string" || !b.resposta.trim())
    return "Resposta é obrigatória";
  if (typeof b.assunto_id !== "number") return "Assunto é obrigatório";
  return null;
}
