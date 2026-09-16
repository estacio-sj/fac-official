"use client";

import { useState, type FormEvent } from "react";
import { brParaIso, isoParaBr, hojeIso } from "@/lib/dateUtils";
import type { Assunto, Resposta, RespostaPayload } from "@/types";

interface Props {
  assuntos: Assunto[];
  initial: Resposta | null;
  onSave: (payload: RespostaPayload) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  pergunta: string;
  resposta: string;
  assunto_id: string;
  data: string;
}

export function FaqForm({ assuntos, initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          pergunta: initial.pergunta,
          resposta: initial.resposta,
          assunto_id: String(initial.assunto_id),
          data: brParaIso(initial.data),
        }
      : {
          pergunta: "",
          resposta: "",
          assunto_id: assuntos[0] ? String(assuntos[0].id) : "",
          data: hojeIso(),
        }
  );
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function update(campo: keyof FormState, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.pergunta.trim() || !form.resposta.trim() || !form.assunto_id) {
      setErro("Preencha a pergunta, a resposta e o assunto.");
      return;
    }
    setErro(null);
    setSalvando(true);
    try {
      await onSave({
        pergunta: form.pergunta.trim(),
        resposta: form.resposta.trim(),
        assunto_id: Number(form.assunto_id),
        data: isoParaBr(form.data),
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="faq-form" onSubmit={handleSubmit}>
      {erro && <div className="form-error">{erro}</div>}

      <div className="field">
        <label htmlFor="pergunta">Pergunta</label>
        <input
          id="pergunta"
          value={form.pergunta}
          onChange={(e) => update("pergunta", e.target.value)}
          placeholder="Ex.: Como faço para iniciar meu estágio?"
        />
      </div>

      <div className="field">
        <label htmlFor="resposta">Resposta</label>
        <textarea
          id="resposta"
          rows={4}
          value={form.resposta}
          onChange={(e) => update("resposta", e.target.value)}
          placeholder="Escreva a resposta que os mediadores vão usar"
        />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="assunto">Assunto</label>
          <select
            id="assunto"
            value={form.assunto_id}
            onChange={(e) => update("assunto_id", e.target.value)}
          >
            {assuntos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="data">Data</label>
          <input
            id="data"
            type="date"
            value={form.data}
            onChange={(e) => update("data", e.target.value)}
          />
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
