import { NextResponse } from "next/server";

const USER_AGENT = "NeoVIa-MVP/0.0.9 (transporte publico Grande Florianopolis)";
const VIEWBOX = "-48.85,-27.40,-48.38,-27.95";

type NominatimResultado = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  try {
    if (lat && lng) {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lng);
      url.searchParams.set("accept-language", "pt-BR");

      const resposta = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      const dado = (await resposta.json()) as NominatimResultado;

      return NextResponse.json({
        endereco: dado.display_name ?? null,
        lat: Number(lat),
        lng: Number(lng),
      });
    }

    if (q && q.trim().length >= 3) {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "5");
      url.searchParams.set("countrycodes", "br");
      url.searchParams.set("viewbox", VIEWBOX);
      url.searchParams.set("bounded", "1");
      url.searchParams.set("accept-language", "pt-BR");

      const resposta = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      const dados = (await resposta.json()) as NominatimResultado[];

      const resultados = dados.map((item) => ({
        endereco: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));

      return NextResponse.json({ resultados });
    }

    return NextResponse.json({ resultados: [] });
  } catch {
    return NextResponse.json(
      { erro: "Falha ao consultar o servico de geocodificacao." },
      { status: 502 },
    );
  }
}
