"use client";

import {
  ArrowLeft,
  Bus,
  Crosshair,
  Footprints,
  Loader2,
  MapPin,
  MousePointerClick,
  Navigation,
  RouteIcon,
  Search,
  Wallet,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Itinerario } from "../lib/rotas";
import type { Coordenada, PontoRota, TrajetoMapa } from "./MapaRotas";

const MapaRotas = dynamic(() => import("./MapaRotas"), { ssr: false });

const CENTRO_REGIAO: Coordenada = { lat: -27.6386, lng: -48.6703 };

type Campo = "origem" | "destino";

type Local = {
  coordenada: Coordenada;
  endereco: string;
};

type Sugestao = {
  endereco: string;
  lat: number;
  lng: number;
};

function formatarEndereco(endereco: string) {
  const partes = endereco
    .split(",")
    .map((parte) => parte.trim())
    .filter(Boolean);

  if (partes.length === 0) {
    return { principal: endereco, detalhe: "" };
  }

  const principal = partes.slice(0, 2).join(", ");
  const detalhe = partes.slice(2, 4).join(", ");
  return { principal, detalhe };
}

export function RotasView() {
  const [campoAtivo, setCampoAtivo] = useState<Campo>("origem");
  const [origem, setOrigem] = useState<Local | null>(null);
  const [destino, setDestino] = useState<Local | null>(null);
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [centro, setCentro] = useState<Coordenada>(CENTRO_REGIAO);
  const [modoMapa, setModoMapa] = useState(false);
  const [montado, setMontado] = useState(false);
  const [itinerarios, setItinerarios] = useState<Itinerario[]>([]);
  const [buscandoRota, setBuscandoRota] = useState(false);
  const [rotaBuscada, setRotaBuscada] = useState(false);
  const [selecionado, setSelecionado] = useState(0);
  const [caminhadas, setCaminhadas] = useState<
    Record<string, { coords: Coordenada[]; distanciaM: number | null; duracaoMin: number | null }>
  >({});

  const buscaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (busca.trim().length < 3) {
      setSugestoes([]);
      return;
    }
    if (buscaTimer.current) clearTimeout(buscaTimer.current);
    buscaTimer.current = setTimeout(() => {
      setBuscando(true);
      fetch(`/api/geocode?q=${encodeURIComponent(busca)}`)
        .then((resposta) => resposta.json())
        .then((dado) => setSugestoes(dado.resultados ?? []))
        .catch(() => setSugestoes([]))
        .finally(() => setBuscando(false));
    }, 500);
    return () => {
      if (buscaTimer.current) clearTimeout(buscaTimer.current);
    };
  }, [busca]);

  const definirLocal = useCallback(
    (campo: Campo, local: Local) => {
      if (campo === "origem") setOrigem(local);
      else setDestino(local);
      setCentro(local.coordenada);
      setBusca("");
      setSugestoes([]);
      setItinerarios([]);
      setRotaBuscada(false);
    },
    [],
  );

  const reverseGeocode = useCallback(
    async (coordenada: Coordenada): Promise<string> => {
      try {
        const resposta = await fetch(
          `/api/geocode?lat=${coordenada.lat}&lng=${coordenada.lng}`,
        );
        const dado = await resposta.json();
        return dado.endereco ?? "Local selecionado no mapa";
      } catch {
        return "Local selecionado no mapa";
      }
    },
    [],
  );

  const aoSelecionarNoMapa = useCallback(
    async (coordenada: Coordenada) => {
      if (!modoMapa) return;
      const endereco = await reverseGeocode(coordenada);
      definirLocal(campoAtivo, { coordenada, endereco });
    },
    [modoMapa, campoAtivo, reverseGeocode, definirLocal],
  );

  const usarMinhaLocalizacao = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (posicao) => {
      const coordenada = {
        lat: posicao.coords.latitude,
        lng: posicao.coords.longitude,
      };
      const endereco = await reverseGeocode(coordenada);
      definirLocal("origem", { coordenada, endereco });
      setCampoAtivo("destino");
    });
  }, [reverseGeocode, definirLocal]);

  const buscarRota = useCallback(async () => {
    if (!origem || !destino) return;
    setBuscandoRota(true);
    setRotaBuscada(true);
    setSelecionado(0);
    setCaminhadas({});
    try {
      const url =
        `/api/rotas?origemLat=${origem.coordenada.lat}` +
        `&origemLng=${origem.coordenada.lng}` +
        `&destinoLat=${destino.coordenada.lat}` +
        `&destinoLng=${destino.coordenada.lng}`;
      const resposta = await fetch(url);
      const dado = await resposta.json();
      setItinerarios(dado.itinerarios ?? []);
    } catch {
      setItinerarios([]);
    } finally {
      setBuscandoRota(false);
    }
  }, [origem, destino]);

  const itinerarioAtual = itinerarios[selecionado] ?? null;

  useEffect(() => {
    if (!itinerarioAtual) return;
    let cancelado = false;
    itinerarioAtual.etapas.forEach((etapa, indice) => {
      if (etapa.tipo !== "caminhada") return;
      const chave = `${selecionado}-${indice}`;
      if (caminhadas[chave]) return;
      const a = etapa.trajeto[0];
      const b = etapa.trajeto[etapa.trajeto.length - 1];
      const url = `/api/caminhada?fromLat=${a.lat}&fromLng=${a.lng}&toLat=${b.lat}&toLng=${b.lng}`;
      fetch(url)
        .then((r) => r.json())
        .then((d) => {
          if (cancelado || !d.coords) return;
          setCaminhadas((prev) => ({
            ...prev,
            [chave]: {
              coords: d.coords,
              distanciaM: d.distanciaM,
              duracaoMin: d.duracaoMin,
            },
          }));
        })
        .catch(() => undefined);
    });
    return () => {
      cancelado = true;
    };
  }, [itinerarioAtual, selecionado, caminhadas]);

  const pontosRota = useMemo<PontoRota[]>(() => {
    const itinerario = itinerarios[selecionado];
    if (!itinerario) return [];

    const lista: PontoRota[] = [];
    const vistos = new Set<string>();

    itinerario.etapas.forEach((etapa, indice) => {
      if (etapa.tipo !== "onibus") return;

      const registrar = (
        parada: { nome: string; lat: number; lng: number },
        papel: "embarque" | "desembarque",
        horario: string,
      ) => {
        const chave = `${parada.lat.toFixed(5)},${parada.lng.toFixed(5)}-${papel}`;
        if (vistos.has(chave)) return;
        vistos.add(chave);
        lista.push({
          id: `${indice}-${papel}-${parada.lat}`,
          nome: parada.nome,
          lat: parada.lat,
          lng: parada.lng,
          papel,
          linhaRef: etapa.linhaRef,
          horario,
        });
      };

      registrar(etapa.embarque, "embarque", etapa.horarioSaida);
      registrar(etapa.desembarque, "desembarque", etapa.horarioChegada);
    });

    return lista;
  }, [itinerarios, selecionado]);

  const trajetos = useMemo<TrajetoMapa[]>(() => {
    const itinerario = itinerarios[selecionado];
    if (!itinerario) return [];
    return itinerario.etapas.map((etapa, indice) => {
      if (etapa.tipo === "caminhada") {
        const c = caminhadas[`${selecionado}-${indice}`];
        return { tipo: "caminhada", coords: c?.coords ?? etapa.trajeto };
      }
      return { tipo: "onibus", coords: etapa.trajeto };
    });
  }, [itinerarios, selecionado, caminhadas]);

  const localAtual = campoAtivo === "origem" ? origem : destino;

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f8fc] text-slate-950">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-28 pt-5 sm:px-6">
        <Link
          href="/inicio"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <h1 className="mt-4 text-2xl font-black tracking-tight">
          Para onde voce quer ir?
        </h1>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCampoAtivo("origem")}
              className={`flex w-full min-w-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${
                campoAtivo === "origem"
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                <MapPin size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Origem
                </span>
                {origem ? (
                  <>
                    <span className="block truncate text-sm font-semibold text-slate-700">
                      {formatarEndereco(origem.endereco).principal}
                    </span>
                    {formatarEndereco(origem.endereco).detalhe && (
                      <span className="block truncate text-xs font-medium text-slate-400">
                        {formatarEndereco(origem.endereco).detalhe}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="block truncate text-sm font-semibold text-slate-400">
                    Defina o ponto de partida
                  </span>
                )}
              </span>
            </button>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setCampoAtivo("destino")}
              className={`flex w-full min-w-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${
                campoAtivo === "destino"
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                <Navigation size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Destino
                </span>
                {destino ? (
                  <>
                    <span className="block truncate text-sm font-semibold text-slate-700">
                      {formatarEndereco(destino.endereco).principal}
                    </span>
                    {formatarEndereco(destino.endereco).detalhe && (
                      <span className="block truncate text-xs font-medium text-slate-400">
                        {formatarEndereco(destino.endereco).detalhe}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="block truncate text-sm font-semibold text-slate-400">
                    Defina para onde vai
                  </span>
                )}
              </span>
            </button>
          </div>

          <div className="relative mt-3">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder={`Buscar endereco da ${campoAtivo}`}
              className="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
            {buscando && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-brand-primary"
              />
            )}
          </div>

          {sugestoes.length > 0 && (
            <ul className="mt-2 max-h-52 overflow-auto rounded-2xl border border-slate-200">
              {sugestoes.map((sugestao, indice) => (
                <li key={`${sugestao.lat}-${sugestao.lng}-${indice}`}>
                  <button
                    type="button"
                    onClick={() =>
                      definirLocal(campoAtivo, {
                        coordenada: { lat: sugestao.lat, lng: sugestao.lng },
                        endereco: sugestao.endereco,
                      })
                    }
                    className="flex w-full min-w-0 items-start gap-2 border-b border-slate-100 px-3 py-2.5 text-left transition last:border-b-0 hover:bg-slate-50"
                  >
                    <MapPin size={16} className="mt-0.5 shrink-0 text-brand-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-700">
                        {formatarEndereco(sugestao.endereco).principal}
                      </span>
                      {formatarEndereco(sugestao.endereco).detalhe && (
                        <span className="block truncate text-xs font-medium text-slate-400">
                          {formatarEndereco(sugestao.endereco).detalhe}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModoMapa((valor) => !valor)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-bold transition ${
                modoMapa
                  ? "bg-brand-primary text-white"
                  : "border border-slate-200 bg-white text-brand-primary hover:bg-slate-50"
              }`}
            >
              <MousePointerClick size={15} />
              {modoMapa ? "Tocando no mapa" : "Escolher no mapa"}
            </button>
            <button
              type="button"
              onClick={usarMinhaLocalizacao}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-brand-primary transition hover:bg-slate-50"
            >
              <Crosshair size={15} />
              Minha localizacao
            </button>
          </div>

          {modoMapa && (
            <p className="mt-2 text-xs font-medium text-slate-500">
              Toque no mapa para definir a {campoAtivo}.
              {localAtual ? "" : " Nenhum ponto definido ainda."}
            </p>
          )}
        </section>

        <section className="mapa-rotas-shell relative z-0 isolate mt-4 flex-1 overflow-hidden rounded-[24px] border border-slate-200 shadow-card">
          <div className="relative z-0 h-[52vh] min-h-72 w-full touch-none overscroll-none">
            {montado ? (
              <MapaRotas
                centro={centro}
                pontosRota={pontosRota}
                origem={origem?.coordenada ?? null}
                destino={destino?.coordenada ?? null}
                trajetos={trajetos}
                onSelecionar={aoSelecionarNoMapa}
              />
            ) : (
              <div className="grid size-full place-items-center bg-slate-100 text-brand-primary">
                <Loader2 className="animate-spin" size={28} />
              </div>
            )}
          </div>
        </section>

        {rotaBuscada && !buscandoRota && itinerarios.length === 0 && (
          <section className="mt-4 rounded-[24px] border border-dashed border-amber-300 bg-amber-50 p-4 text-amber-700">
            <p className="text-sm font-bold">Nenhuma rota encontrada.</p>
            <p className="mt-1 text-xs font-medium">
              Ainda nao ha linhas mapeadas ligando esses pontos. A cobertura e
              maior na area de Florianopolis.
            </p>
          </section>
        )}

        {itinerarios.length > 0 && (
          <section className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {itinerarios.map((itinerario, indice) => (
                <button
                  key={indice}
                  type="button"
                  onClick={() => setSelecionado(indice)}
                  className={`flex-1 rounded-2xl border px-3 py-2 text-center transition ${
                    selecionado === indice
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <span className="block text-sm font-black">
                    {itinerario.duracaoMin} min
                  </span>
                  <span className="block text-[11px] font-semibold opacity-80">
                    {itinerario.tipo === "direta" ? "Direto" : "1 baldeacao"}
                  </span>
                </button>
              ))}
            </div>

            <ItinerarioDetalhe
              itinerario={itinerarios[selecionado]}
              caminhadas={caminhadas}
              prefixo={selecionado}
            />

            <p className="text-center text-[11px] font-medium text-slate-400">
              Horarios estimados por frequencia. Pontos e linhas: OpenStreetMap.
            </p>
          </section>
        )}
      </div>

      {montado &&
        origem &&
        destino &&
        itinerarios.length === 0 &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-[5.75rem] z-[100] px-4">
            <div className="mx-auto w-full max-w-2xl">
              <button
                type="button"
                onClick={buscarRota}
                disabled={buscandoRota}
                className="pointer-events-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-3.5 text-sm font-black text-white shadow-[0_12px_32px_rgba(15,63,116,0.45)] transition hover:bg-brand-dark disabled:opacity-70"
              >
                {buscandoRota ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RouteIcon size={18} />
                )}
                {buscandoRota ? "Calculando rota..." : "Buscar rota"}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}

function ItinerarioDetalhe({
  itinerario,
  caminhadas,
  prefixo,
}: {
  itinerario: Itinerario;
  caminhadas: Record<
    string,
    { coords: Coordenada[]; distanciaM: number | null; duracaoMin: number | null }
  >;
  prefixo: number;
}) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <p className="text-lg font-black text-slate-800">
            {itinerario.horarioPartida} - {itinerario.horarioChegada}
          </p>
          <p className="text-xs font-semibold text-slate-400">
            {itinerario.duracaoMin} min - {itinerario.distanciaAPeM} m a pe
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-green-700">
          <Wallet size={16} />
          <span className="text-sm font-black">
            R$ {itinerario.precoTotal.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <ol className="mt-3 space-y-3">
        {itinerario.etapas.map((etapa, indice) => (
          <li key={indice} className="flex gap-3">
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full ${
                etapa.tipo === "onibus"
                  ? "bg-brand-primary text-white"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {etapa.tipo === "onibus" ? (
                <Bus size={18} />
              ) : (
                <Footprints size={18} />
              )}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              {etapa.tipo === "onibus" ? (
                <>
                  <p className="text-sm font-bold text-slate-800">
                    Linha {etapa.linhaRef || etapa.linhaNome}
                  </p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {etapa.linhaNome}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Embarque <span className="font-bold">{etapa.horarioSaida}</span>{" "}
                    em {etapa.embarque.nome}
                  </p>
                  <p className="text-xs text-slate-600">
                    Desembarque{" "}
                    <span className="font-bold">{etapa.horarioChegada}</span> em{" "}
                    {etapa.desembarque.nome}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    {etapa.numParadas} paradas - sai a cada {etapa.intervaloMin} min
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-800">
                    A pe ate {etapa.para}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {caminhadas[`${prefixo}-${indice}`]?.distanciaM ??
                      etapa.distanciaM}{" "}
                    m -{" "}
                    {caminhadas[`${prefixo}-${indice}`]?.duracaoMin ??
                      etapa.duracaoMin}{" "}
                    min
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
