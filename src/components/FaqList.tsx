import type { Resposta } from "@/types";

interface Props {
  respostas: Resposta[];
  assuntoNome?: string;
  onEdit: (r: Resposta) => void;
  onDelete: (id: number) => void;
  onToggleVerificado: (id: number, verificado: boolean) => void;
}

export function FaqList({
  respostas,
  assuntoNome,
  onEdit,
  onDelete,
  onToggleVerificado,
}: Props) {
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
            <button
              type="button"
              className={`faq-badge ${r.verificado ? "verified" : ""}`}
              onClick={() => onToggleVerificado(r.id, !r.verificado)}
              title={
                r.verificado
                  ? "Verificado — pode ser enviada ao aluno. Clique para desmarcar."
                  : "Marcar como verificada (pode ser enviada ao aluno)"
              }
            >
              {r.verificado ? "✓ Verificado" : "Marcar como verificado"}
            </button>
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