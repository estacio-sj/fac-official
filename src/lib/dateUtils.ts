// Converte "dd/mm/aaaa" (formato da API) <-> "aaaa-mm-dd" (formato do <input type="date">)

export function brParaIso(dataBr: string): string {
  if (!dataBr) return "";
  const [dia, mes, ano] = dataBr.split("/");
  if (!dia || !mes || !ano) return "";
  return `${ano}-${mes}-${dia}`;
}

export function isoParaBr(dataIso: string): string {
  if (!dataIso) return "";
  const [ano, mes, dia] = dataIso.split("-");
  if (!dia || !mes || !ano) return "";
  return `${dia}/${mes}/${ano}`;
}

export function hojeIso(): string {
  return new Date().toISOString().slice(0, 10);
}
