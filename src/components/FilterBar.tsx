"use client";

export interface Filtro {
  texto: string;
  dataInicio: string;
  dataFim: string;
}

interface Props {
  filtro: Filtro;
  onChange: (f: Filtro) => void;
  onLimpar: () => void;
}

export function FilterBar({ filtro, onChange, onLimpar }: Props) {
  const temFiltro = filtro.texto || filtro.dataInicio || filtro.dataFim;

  return (
    <div className="filter-bar">
      <input
        className="filter-text"
        type="text"
        placeholder="Buscar por palavra-chave…"
        value={filtro.texto}
        onChange={(e) => onChange({ ...filtro, texto: e.target.value })}
      />

      <div className="filter-date">
        <label htmlFor="filtro-de">De</label>
        <input
          id="filtro-de"
          type="date"
          value={filtro.dataInicio}
          onChange={(e) => onChange({ ...filtro, dataInicio: e.target.value })}
        />
      </div>

      <div className="filter-date">
        <label htmlFor="filtro-ate">Até</label>
        <input
          id="filtro-ate"
          type="date"
          value={filtro.dataFim}
          onChange={(e) => onChange({ ...filtro, dataFim: e.target.value })}
        />
      </div>

      {temFiltro && (
        <button type="button" className="link-btn" onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}
