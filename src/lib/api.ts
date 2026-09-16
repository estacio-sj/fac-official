import type { Assunto, Resposta, RespostaPayload } from "@/types";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // resposta sem corpo JSON (ex.: 204)
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const api = {
  // Assuntos
  listarAssuntos: () => request<Assunto[]>("/api/assuntos"),
  criarAssunto: (nome: string) =>
    request<Assunto>("/api/assuntos", {
      method: "POST",
      body: JSON.stringify({ nome }),
    }),
  removerAssunto: (id: number) =>
    request<null>(`/api/assuntos/${id}`, { method: "DELETE" }),

  // Respostas
  listarRespostas: (assuntoId?: number | null) =>
    request<Resposta[]>(
      assuntoId ? `/api/respostas?assunto_id=${assuntoId}` : "/api/respostas"
    ),
  criarResposta: (payload: RespostaPayload) =>
    request<Resposta>("/api/respostas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  atualizarResposta: (id: number, payload: RespostaPayload) =>
    request<Resposta>(`/api/respostas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  removerResposta: (id: number) =>
    request<null>(`/api/respostas/${id}`, { method: "DELETE" }),
};
