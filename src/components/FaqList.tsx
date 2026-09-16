import type { Resposta } from "@/types";

interface Props {
  respostas: Resposta[];
  assuntoNome?: string;
  onEdit: (r: Resposta) => void;
  onDelete: (id: number) => void;
}

export function FaqList({ respostas, assuntoNome, onEdit, onDelete }: Props) {
  if (respostas.length === 0) {
    return (
      <div className="empty-state">
        Nenhuma resposta cadastrada{assuntoNome ? ` em ${assuntoNome}` : ""}{" "}
        ainda.
      </div>
    );
  }

  return (
    <ul className="faq-list">
      {respostas.map((r) => (
        <li key={r.id} className="faq-item">
          <div className="faq-item-top">
            <p className="faq-question">{r.pergunta}</p>
            <span className="faq-date">{r.data}</span>
          </div>
          <p className="faq-answer">{r.resposta}</p>
          <div className="faq-item-actions">
            <button className="link-btn" onClick={() => onEdit(r)}>
              Editar
            </button>
            <button className="link-btn danger" onClick={() => onDelete(r.id)}>
              Remover
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
