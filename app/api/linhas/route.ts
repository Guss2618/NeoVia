import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { filtrarLinhas, resumirLinha } from "../../../lib/horarios";
import type { Linha } from "../../../lib/rotas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const filePath = path.join(process.cwd(), "data", "linhas.json");
  const file = await readFile(filePath, "utf-8");
  const linhas: Linha[] = JSON.parse(file);
  const filtradas = filtrarLinhas(linhas, query);
  const agora = new Date();

  return NextResponse.json({
    total: filtradas.length,
    linhas: filtradas.map((linha) => resumirLinha(linha, agora)),
  });
}
