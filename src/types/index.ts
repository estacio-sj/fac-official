export interface Assunto {
  id: number;
  nome: string;
}

export interface Resposta {
  id: number;
  pergunta: string;
  resposta: string;
  data: string; // sempre no formato dd/mm/aaaa quando sai da API
  assunto_id: number;
}

export interface RespostaPayload {
  pergunta: string;
  resposta: string;
  assunto_id: number;
  data: string; // dd/mm/aaaa (opcional na prática — API usa hoje se vazio)
}
