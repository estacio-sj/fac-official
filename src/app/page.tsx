"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { brParaIso } from "@/lib/dateUtils";
import { Sidebar } from "@/components/Sidebar";
import { FaqList } from "@/components/FaqList";
import { FaqForm } from "@/components/FaqForm";
import { FilterBar, type Filtro } from "@/components/FilterBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Assunto, Resposta, RespostaPayload } from "@/types";

const filtroVazio: Filtro = { texto: "", dataInicio: "", dataFim: "" };

export default function Page() {
  const { theme, toggleTheme } = useTheme();

  const [assuntos, setAssuntos] = useState<Assunto[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Resposta | null>(null);

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>(filtroVazio);

  async function carregarTudo() {
    setCarregando(true);
    setErroCarregar(null);
    try {
      const [listaAssuntos, listaRespostas] = await Promise.all([
        api.listarAssuntos(),
        api.listarRespostas(),
      ]);
      setAssuntos(listaAssuntos);
      setRespostas(listaRespostas);
    } catch {
      setErroCarregar(
        "Não foi possível carregar os dados. Confira as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  const contagens = useMemo(() => {
    const mapa: Record<number, number> = {};
    for (const r of respostas) mapa[r.assunto_id] = (mapa[r.assunto_id] || 0) + 1;
    return mapa;
  }, [respostas]);

  const respostasVisiveis = useMemo(() => {
    if (selectedId === null) return respostas;
    return respostas.filter((r) => r.assunto_id === selectedId);
  }, [respostas, selectedId]);

  const assuntoSelecionado = assuntos.find((a) => a.id === selectedId);
  const filtroAtivo = Boolean(
    filtro.texto || filtro.dataInicio || filtro.dataFim
  );

  const respostasFiltradas = useMemo(() => {
    return respostasVisiveis.filter((r) => {
      if (filtro.texto) {
        const alvo = `${r.pergunta} ${r.resposta}`.toLowerCase();
        if (!alvo.includes(filtro.texto.toLowerCase())) return false;
      }
      if (filtro.dataInicio || filtro.dataFim) {
        const dataIso = brParaIso(r.data);
        if (filtro.dataInicio && dataIso < filtro.dataInicio) return false;
        if (filtro.dataFim && dataIso > filtro.dataFim) return false;
      }
      return true;
    });
  }, [respostasVisiveis, filtro]);

  async function handleCriarAssunto(nome: string) {
    const novo = await api.criarAssunto(nome);
    setAssuntos((prev) =>
      [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome))
    );
  }

  async function handleRemoverAssunto(id: number) {
    if (
      !confirm(
        "Remover este assunto? As respostas ligadas a ele também serão removidas."
      )
    )
      return;
    await api.removerAssunto(id);
    setAssuntos((prev) => prev.filter((a) => a.id !== id));
    setRespostas((prev) => prev.filter((r) => r.assunto_id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function abrirNovoForm() {
    setEditando(null);
    setFormAberto(true);
  }

  function abrirEdicao(resposta: Resposta) {
    setEditando(resposta);
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setEditando(null);
  }

  async function handleSalvar(payload: RespostaPayload) {
    if (editando) {
      const atualizada = await api.atualizarResposta(editando.id, payload);
      setRespostas((prev) =>
        prev.map((r) => (r.id === atualizada.id ? atualizada : r))
      );
    } else {
      const criada = await api.criarResposta(payload);
      setRespostas((prev) => [criada, ...prev]);
    }
    fecharForm();
  }

    async function handleToggleVerificado(id: number, verificado: boolean) {
    const atualizada = await api.marcarVerificado(id, verificado);
    setRespostas((prev) =>
      prev.map((r) => (r.id === atualizada.id ? atualizada : r))
    );
  }

  async function handleRemoverResposta(id: number) {
    if (!confirm("Remover esta resposta?")) return;
    await api.removerResposta(id);
    setRespostas((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>
          <span className="status-dot" />
          FAQ · Painel de respostas
        </h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="layout">
        <Sidebar
          assuntos={assuntos}
          contagens={contagens}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={handleCriarAssunto}
          onRemove={handleRemoverAssunto}
        />

        <main className="main">
          <div className="main-header">
            <div>
              <h2>
                {assuntoSelecionado ? assuntoSelecionado.nome : "Todas as respostas"}
              </h2>
              <p>{respostasFiltradas.length} resposta(s)</p>
            </div>
            <div className="header-actions">
              {assuntos.length > 0 && (
                <button
                  className={`btn-secondary ${filtroAtivo ? "active" : ""}`}
                  onClick={() => setFiltrosAbertos((v) => !v)}
                >
                  Filtros{filtroAtivo ? " •" : ""}
                </button>
              )}
              {!formAberto && assuntos.length > 0 && (
                <button className="btn-primary" onClick={abrirNovoForm}>
                  Nova resposta
                </button>
              )}
            </div>
          </div>

          {filtrosAbertos && assuntos.length > 0 && (
            <FilterBar
              filtro={filtro}
              onChange={setFiltro}
              onLimpar={() => setFiltro(filtroVazio)}
            />
          )}

          {erroCarregar && <div className="form-error">{erroCarregar}</div>}

          {formAberto && assuntos.length > 0 && (
            <FaqForm
              assuntos={assuntos}
              initial={editando}
              onSave={handleSalvar}
              onCancel={fecharForm}
            />
          )}

          {carregando ? (
            <div className="empty-state">Carregando…</div>
          ) : assuntos.length === 0 ? (
            <div className="empty-state">
              Cadastre um assunto na barra lateral para começar a adicionar
              respostas.
            </div>
          ) : (
            <FaqList
              respostas={respostasFiltradas}
              assuntoNome={assuntoSelecionado?.nome}
              onEdit={abrirEdicao}
              onDelete={handleRemoverResposta}
              onToggleVerificado={handleToggleVerificado}
            />
          )}
        </main>
      </div>
    </div>
  );
}
