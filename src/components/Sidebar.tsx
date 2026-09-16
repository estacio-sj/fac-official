"use client";

import { useState, type FormEvent } from "react";
import type { Assunto } from "@/types";

interface Props {
  assuntos: Assunto[];
  contagens: Record<number, number>;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onCreate: (nome: string) => void;
  onRemove: (id: number) => void;
}

export function Sidebar({
  assuntos,
  contagens,
  selectedId,
  onSelect,
  onCreate,
  onRemove,
}: Props) {
  const [novoNome, setNovoNome] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nome = novoNome.trim();
    if (!nome) return;
    onCreate(nome);
    setNovoNome("");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-label">Assuntos</div>
      <ul className="subject-list">
        <li className={`subject-item ${selectedId === null ? "active" : ""}`}>
          <button className="subject-select" onClick={() => onSelect(null)}>
            Todos
          </button>
        </li>
        {assuntos.map((a) => (
          <li
            key={a.id}
            className={`subject-item ${selectedId === a.id ? "active" : ""}`}
          >
            <button className="subject-select" onClick={() => onSelect(a.id)}>
              {a.nome}
            </button>
            <span className="count">{contagens[a.id] ?? 0}</span>
            <button
              className="remove-subject"
              title="Remover assunto"
              onClick={() => onRemove(a.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="new-subject">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Novo assunto"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </aside>
  );
}
