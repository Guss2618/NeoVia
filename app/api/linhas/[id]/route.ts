import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import {
  gerarHorariosPartida,
  proximaSaidaTexto,
  resumirNomeLinha,
} from "../../../../lib/horarios";
import type { Linha } from "../../../../lib/rotas";

type Tarifas = {
  tarifa: number;
  integracao: boolean;
  janelaIntegracaoMin: number;
  moeda: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const baseDir = path.join(process.cwd(), "data");
  const [linhasFile, tarifasFile] = await Promise.all([
    readFile(path.join(baseDir, "linhas.json"), "utf-8"),
    readFile(path.join(baseDir, "tarifas.json"), "utf-8"),
  ]);

  const linhas: Linha[] = JSON.parse(linhasFile);
  const tarifas: Tarifas = JSON.parse(tarifasFile);
  const linha = linhas.find((item) => item.id === id);

  if (!linha) {
    return NextResponse.json({ error: "Linha não encontrada." }, { status: 404 });
  }

  const agora = new Date();

  return NextResponse.json({
    linha: {
      id: linha.id,
      ref: linha.ref,
      nome: linha.nome,
      nomeResumido: resumirNomeLinha(linha.nome),
      operadora: linha.operadora,
      inicioOperacao: linha.inicioOperacao,
      fimOperacao: linha.fimOperacao,
      intervaloMin: linha.intervaloMin,
      proximaSaida: proximaSaidaTexto(linha, agora),
      paradas: linha.paradas,
    },
    tarifas,
    horariosPartida: gerarHorariosPartida(linha),
  });
}
