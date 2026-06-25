import { NextResponse } from "next/server";

const USER_AGENT = "NeoVIa-MVP/0.0.11 (transporte publico Grande Florianopolis)";
const BASE = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";

type Coord = { lat: number; lng: number };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromLat = Number(searchParams.get("fromLat"));
  const fromLng = Number(searchParams.get("fromLng"));
  const toLat = Number(searchParams.get("toLat"));
  const toLng = Number(searchParams.get("toLng"));

  const origem: Coord = { lat: fromLat, lng: fromLng };
  const destino: Coord = { lat: toLat, lng: toLng };

  if (
    ![fromLat, fromLng, toLat, toLng].every((v) => Number.isFinite(v))
  ) {
    return NextResponse.json({ erro: "Coordenadas invalidas." }, { status: 400 });
  }

  const url =
    `${BASE}/${fromLng},${fromLat};${toLng},${toLat}` +
    "?overview=full&geometries=geojson";

  try {
    const resposta = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const dado = await resposta.json();
    const rota = dado?.routes?.[0];

    if (!rota) {
      return NextResponse.json({
        coords: [origem, destino],
        distanciaM: null,
        duracaoMin: null,
        aproximado: true,
      });
    }

    const coords: Coord[] = rota.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ lat, lng }),
    );

    return NextResponse.json({
      coords,
      distanciaM: Math.round(rota.distance),
      duracaoMin: Math.max(1, Math.round(rota.duration / 60)),
      aproximado: false,
    });
  } catch {
    return NextResponse.json({
      coords: [origem, destino],
      distanciaM: null,
      duracaoMin: null,
      aproximado: true,
    });
  }
}
