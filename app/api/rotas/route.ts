import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import type {
  Coord,
  Etapa,
  Itinerario,
  Linha,
  Parada,
} from "../../../lib/rotas";

const VEL_ONIBUS_KMH = 20;
const VEL_PE_KMH = 5;
const MIN_POR_KM_ONIBUS = 60 / VEL_ONIBUS_KMH;
const MIN_POR_KM_PE = 60 / VEL_PE_KMH;
const RAIO_CAMINHADA_KM = 1;
const RAIO_BALDEACAO_KM = 0.35;

function distanciaKm(a: Coord, b: Coord) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function paraMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function paraHora(minutos: number) {
  const total = ((Math.round(minutos) % 1440) + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function tempoEntreParadas(linha: Linha, de: number, ate: number) {
  let km = 0;
  for (let i = de; i < ate; i += 1) {
    km += distanciaKm(linha.paradas[i], linha.paradas[i + 1]);
  }
  return km * MIN_POR_KM_ONIBUS;
}

function proximaPartida(
  linha: Linha,
  indiceParada: number,
  horaChegadaNoPonto: number,
) {
  const inicio = paraMinutos(linha.inicioOperacao);
  const fim = paraMinutos(linha.fimOperacao);
  const intervalo = linha.intervaloMin;
  const tempoAteParada = tempoEntreParadas(linha, 0, indiceParada);

  const k = Math.max(
    0,
    Math.ceil((horaChegadaNoPonto - tempoAteParada - inicio) / intervalo),
  );
  const partidaDaOrigem = inicio + k * intervalo;
  if (partidaDaOrigem > fim) return null;
  return partidaDaOrigem + tempoAteParada;
}

function paradaMaisProxima(
  linha: Linha,
  ponto: Coord,
  indiceMinimo = 0,
): { indice: number; distanciaKm: number } | null {
  let melhor: { indice: number; distanciaKm: number } | null = null;
  for (let i = indiceMinimo; i < linha.paradas.length; i += 1) {
    const d = distanciaKm(linha.paradas[i], ponto);
    if (!melhor || d < melhor.distanciaKm) {
      melhor = { indice: i, distanciaKm: d };
    }
  }
  return melhor;
}

function etapaCaminhada(
  de: string,
  para: string,
  origem: Coord,
  destino: Coord,
): Etapa {
  const km = distanciaKm(origem, destino);
  return {
    tipo: "caminhada",
    de,
    para,
    distanciaM: Math.round(km * 1000),
    duracaoMin: Math.max(1, Math.round(km * MIN_POR_KM_PE)),
    trajeto: [origem, destino],
  };
}

function trechoTrajeto(linha: Linha, de: number, ate: number): Coord[] {
  return linha.paradas
    .slice(de, ate + 1)
    .map((p) => ({ lat: p.lat, lng: p.lng }));
}

function montarEtapaOnibus(
  linha: Linha,
  bi: number,
  ai: number,
  partida: number,
): { etapa: Etapa; chegada: number } {
  const ride = tempoEntreParadas(linha, bi, ai);
  const chegada = partida + ride;
  return {
    chegada,
    etapa: {
      tipo: "onibus",
      linhaRef: linha.ref,
      linhaNome: linha.nome,
      operadora: linha.operadora,
      embarque: linha.paradas[bi],
      desembarque: linha.paradas[ai],
      horarioSaida: paraHora(partida),
      horarioChegada: paraHora(chegada),
      numParadas: ai - bi,
      duracaoMin: Math.max(1, Math.round(ride)),
      intervaloMin: linha.intervaloMin,
      trajeto: trechoTrajeto(linha, bi, ai),
    },
  };
}

type Tarifas = { tarifa: number; integracao: boolean; janelaIntegracaoMin: number };

function rotasDiretas(
  linhas: Linha[],
  origem: Coord,
  destino: Coord,
  agora: number,
  tarifas: Tarifas,
): Itinerario[] {
  const resultados: Itinerario[] = [];

  for (const linha of linhas) {
    const perto = paradaMaisProxima(linha, origem);
    if (!perto || perto.distanciaKm > RAIO_CAMINHADA_KM) continue;
    const bi = perto.indice;

    const destinoPerto = paradaMaisProxima(linha, destino, bi + 1);
    if (!destinoPerto || destinoPerto.distanciaKm > RAIO_CAMINHADA_KM) continue;
    const ai = destinoPerto.indice;
    if (ai <= bi) continue;

    const walk1 = distanciaKm(origem, linha.paradas[bi]) * MIN_POR_KM_PE;
    const partida = proximaPartida(linha, bi, agora + walk1);
    if (partida === null) continue;

    const { etapa: etapaBus, chegada } = montarEtapaOnibus(linha, bi, ai, partida);
    const walk2Km = distanciaKm(linha.paradas[ai], destino);
    const chegadaDestino = chegada + walk2Km * MIN_POR_KM_PE;

    const etapas: Etapa[] = [
      etapaCaminhada("Sua localizacao", linha.paradas[bi].nome, origem, linha.paradas[bi]),
      etapaBus,
      etapaCaminhada(linha.paradas[ai].nome, "Destino", linha.paradas[ai], destino),
    ];

    resultados.push({
      tipo: "direta",
      precoTotal: tarifas.tarifa,
      duracaoMin: Math.max(1, Math.round(chegadaDestino - agora)),
      horarioPartida: paraHora(partida),
      horarioChegada: paraHora(chegadaDestino),
      distanciaAPeM:
        Math.round(distanciaKm(origem, linha.paradas[bi]) * 1000) +
        Math.round(walk2Km * 1000),
      etapas,
    });
  }

  return resultados;
}

function rotasComBaldeacao(
  linhas: Linha[],
  origem: Coord,
  destino: Coord,
  agora: number,
  tarifas: Tarifas,
): Itinerario[] {
  const resultados: Itinerario[] = [];
  const distOrigemDestino = distanciaKm(origem, destino);

  const linhasOrigem = linhas
    .map((linha) => ({ linha, perto: paradaMaisProxima(linha, origem) }))
    .filter((x) => x.perto && x.perto.distanciaKm <= RAIO_CAMINHADA_KM);

  for (const { linha: linhaA, perto } of linhasOrigem) {
    const bi = perto!.indice;
    const walk1 = distanciaKm(origem, linhaA.paradas[bi]) * MIN_POR_KM_PE;
    const partidaA = proximaPartida(linhaA, bi, agora + walk1);
    if (partidaA === null) continue;

    for (let ta = bi + 1; ta < linhaA.paradas.length; ta += 1) {
      const transfer = linhaA.paradas[ta];
      if (distanciaKm(transfer, destino) >= distOrigemDestino) continue;

      for (const linhaB of linhas) {
        if (linhaB.id === linhaA.id) continue;

        const embarqueB = paradaMaisProxima(linhaB, transfer);
        if (!embarqueB || embarqueB.distanciaKm > RAIO_BALDEACAO_KM) continue;
        const bsB = embarqueB.indice;

        const desembarqueB = paradaMaisProxima(linhaB, destino, bsB + 1);
        if (!desembarqueB || desembarqueB.distanciaKm > RAIO_CAMINHADA_KM) continue;
        const aiB = desembarqueB.indice;
        if (aiB <= bsB) continue;

        const { etapa: etapaA, chegada: chegadaA } = montarEtapaOnibus(
          linhaA,
          bi,
          ta,
          partidaA,
        );
        const walkTransferKm = distanciaKm(linhaA.paradas[ta], linhaB.paradas[bsB]);
        const chegadaPontoB = chegadaA + walkTransferKm * MIN_POR_KM_PE;
        const partidaB = proximaPartida(linhaB, bsB, chegadaPontoB);
        if (partidaB === null) continue;

        const { etapa: etapaB, chegada: chegadaB } = montarEtapaOnibus(
          linhaB,
          bsB,
          aiB,
          partidaB,
        );
        const walk2Km = distanciaKm(linhaB.paradas[aiB], destino);
        const chegadaDestino = chegadaB + walk2Km * MIN_POR_KM_PE;

        const etapas: Etapa[] = [
          etapaCaminhada(
            "Sua localizacao",
            linhaA.paradas[bi].nome,
            origem,
            linhaA.paradas[bi],
          ),
          etapaA,
        ];
        if (walkTransferKm * 1000 > 60) {
          etapas.push(
            etapaCaminhada(
              linhaA.paradas[ta].nome,
              linhaB.paradas[bsB].nome,
              linhaA.paradas[ta],
              linhaB.paradas[bsB],
            ),
          );
        }
        etapas.push(etapaB);
        etapas.push(
          etapaCaminhada(linhaB.paradas[aiB].nome, "Destino", linhaB.paradas[aiB], destino),
        );

        const tempoEntreEmbarques = partidaB - partidaA;
        const precoTotal =
          tarifas.integracao && tempoEntreEmbarques <= tarifas.janelaIntegracaoMin
            ? tarifas.tarifa
            : tarifas.tarifa * 2;

        resultados.push({
          tipo: "baldeacao",
          precoTotal,
          duracaoMin: Math.max(1, Math.round(chegadaDestino - agora)),
          horarioPartida: paraHora(partidaA),
          horarioChegada: paraHora(chegadaDestino),
          distanciaAPeM:
            Math.round(distanciaKm(origem, linhaA.paradas[bi]) * 1000) +
            Math.round(walkTransferKm * 1000) +
            Math.round(walk2Km * 1000),
          etapas,
        });
      }
    }
  }

  return resultados;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origem: Coord = {
    lat: Number(searchParams.get("origemLat")),
    lng: Number(searchParams.get("origemLng")),
  };
  const destino: Coord = {
    lat: Number(searchParams.get("destinoLat")),
    lng: Number(searchParams.get("destinoLng")),
  };

  if (
    !Number.isFinite(origem.lat) ||
    !Number.isFinite(origem.lng) ||
    !Number.isFinite(destino.lat) ||
    !Number.isFinite(destino.lng)
  ) {
    return NextResponse.json(
      { erro: "Informe origem e destino validos." },
      { status: 400 },
    );
  }

  const horaParam = searchParams.get("hora");
  const agora = horaParam
    ? paraMinutos(horaParam)
    : (() => {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
      })();

  const baseDir = path.join(process.cwd(), "data");
  const [linhasFile, tarifasFile] = await Promise.all([
    readFile(path.join(baseDir, "linhas.json"), "utf-8"),
    readFile(path.join(baseDir, "tarifas.json"), "utf-8"),
  ]);
  const linhas: Linha[] = JSON.parse(linhasFile);
  const tarifas: Tarifas = JSON.parse(tarifasFile);

  const diretas = rotasDiretas(linhas, origem, destino, agora, tarifas)
    .sort((a, b) => a.duracaoMin - b.duracaoMin)
    .slice(0, 3);

  let itinerarios = diretas;
  if (diretas.length === 0) {
    itinerarios = rotasComBaldeacao(linhas, origem, destino, agora, tarifas)
      .sort((a, b) => a.duracaoMin - b.duracaoMin)
      .slice(0, 3);
  }

  return NextResponse.json({
    origem,
    destino,
    horaConsulta: paraHora(agora),
    horarioEstimado: true,
    total: itinerarios.length,
    itinerarios,
  });
}
