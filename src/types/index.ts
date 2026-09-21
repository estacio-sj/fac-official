export interface Assunto {
  id: number;
  nome: string;
}

export interface Resposta {
  id: number;
  pergunta: string;
  resposta: string;
  data: string;
  assunto_id: number;
  verificado: boolean;
}

export interface RespostaPayload {
  pergunta: string;
  resposta: string;
  assunto_id: number;
  data: string;
  verificado: boolean;
}
