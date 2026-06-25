import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type Ponto = {
  id: string;
  nome: string;
  lat: number;
  lng: number;
  abrigo: boolean;
};

const CENTRO_PADRAO = { lat: -27.6386, lng: -48.6703 };

function distanciaKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const raio = Number(searchParams.get("raio")) || 3;
  const limite = Number(searchParams.get("limite")) || 150;

  const centro =
    Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0
      ? { lat, lng }
      : CENTRO_PADRAO;

  const filePath = path.join(process.cwd(), "data", "pontos.json");
  const file = await readFile(filePath, "utf-8");
  const pontos: Ponto[] = JSON.parse(file);

  const proximos = pontos
    .map((ponto) => ({
      ...ponto,
      distanciaKm: distanciaKm(centro.lat, centro.lng, ponto.lat, ponto.lng),
    }))
    .filter((ponto) => ponto.distanciaKm <= raio)
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, limite);

  return NextResponse.json({ centro, raio, total: proximos.length, pontos: proximos });
}
