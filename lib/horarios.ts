import type { Linha } from "./rotas";

export function paraMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

export function paraHora(minutos: number) {
  const total = ((Math.round(minutos) % 1440) + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function resumirNomeLinha(nome: string) {
  const parts = nome.split(" - ");
  if (parts.length > 1) {
    return parts.slice(1).join(" - ").trim();
  }
  return nome.replace(/^Ônibus\s+/i, "").trim();
}

export function gerarHorariosPartida(linha: Linha) {
  const inicio = paraMinutos(linha.inicioOperacao);
  const fim = paraMinutos(linha.fimOperacao);
  const horarios: string[] = [];

  for (let t = inicio; t <= fim; t += linha.intervaloMin) {
    horarios.push(paraHora(t));
  }

  return horarios;
}

export function proximaSaidaTexto(linha: Linha, agora = new Date()) {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const horarios = gerarHorariosPartida(linha);
  const proximo = horarios.find((hora) => paraMinutos(hora) >= minutosAgora);

  if (!proximo) {
    return "Sem saídas hoje";
  }

  const diff = paraMinutos(proximo) - minutosAgora;

  if (diff <= 0) {
    return "Sai agora";
  }

  return `Sai em ${diff} min`;
}

export function filtrarLinhas(linhas: Linha[], query: string) {
  const termo = query.trim().toLowerCase();
  if (!termo) {
    return linhas;
  }

  return linhas.filter(
    (linha) =>
      linha.nome.toLowerCase().includes(termo) ||
      linha.ref.toLowerCase().includes(termo) ||
      linha.operadora.toLowerCase().includes(termo),
  );
}

export type LinhaResumo = {
  id: string;
  ref: string;
  nome: string;
  nomeResumido: string;
  operadora: string;
  inicioOperacao: string;
  fimOperacao: string;
  intervaloMin: number;
  totalParadas: number;
  proximaSaida: string;
};

export function resumirLinha(linha: Linha, agora = new Date()): LinhaResumo {
  return {
    id: linha.id,
    ref: linha.ref,
    nome: linha.nome,
    nomeResumido: resumirNomeLinha(linha.nome),
    operadora: linha.operadora,
    inicioOperacao: linha.inicioOperacao,
    fimOperacao: linha.fimOperacao,
    intervaloMin: linha.intervaloMin,
    totalParadas: linha.paradas.length,
    proximaSaida: proximaSaidaTexto(linha, agora),
  };
}
