"use client";

import {
  ArrowLeft,
  BusFront,
  Clock3,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppTopBar } from "../../../components/AppTopBar";

type Parada = {
  nome: string;
  lat: number;
  lng: number;
};

type LinhaDetalhe = {
  id: string;
  ref: string;
  nome: string;
  nomeResumido: string;
  operadora: string;
  inicioOperacao: string;
  fimOperacao: string;
  intervaloMin: number;
  proximaSaida: string;
  paradas: Parada[];
};

type Tarifas = {
  tarifa: number;
  integracao: boolean;
  janelaIntegracaoMin: number;
  moeda: string;
};

type LinhaResponse = {
  linha: LinhaDetalhe;
  tarifas: Tarifas;
  horariosPartida: string[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function LinhaDetalhePage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<LinhaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLinha() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/linhas/${params.id}`);

        if (!response.ok) {
          throw new Error("Linha não encontrada.");
        }

        const payload = (await response.json()) as LinhaResponse;

        if (isMounted) {
          setData(payload);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Não foi possível carregar a linha.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (params.id) {
      loadLinha();
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-24 text-slate-950 md:px-8 md:pb-10 lg:px-10">
      <section className="mx-auto w-full max-w-md md:max-w-4xl">
        <AppTopBar
          className="-mx-5 md:mx-0 md:rounded-b-[28px] md:px-6"
          version="MVP v0.0.25"
        />

        <Link
          href="/horarios"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        {loading ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="animate-spin text-brand-primary" size={18} />
            Carregando linha...
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {data ? (
          <div className="mt-6 space-y-4 md:space-y-5">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <BusFront size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-brand-primary">
                    Linha {data.linha.ref}
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-[-0.06em] text-slate-950 md:text-3xl">
                    {data.linha.nomeResumido}
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {data.linha.operadora}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {data.linha.proximaSaida}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Operação
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {data.linha.inicioOperacao} - {data.linha.fimOperacao}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Intervalo
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    A cada {data.linha.intervaloMin} min
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Pontos
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {data.linha.paradas.length} paradas
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Ticket size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Tarifas
                  </p>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">
                    Valores da viagem
                  </h2>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-500">Passagem</p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.06em] text-brand-primary">
                    {currencyFormatter.format(data.tarifas.tarifa)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-500">Integração</p>
                  <p className="mt-1 text-lg font-black text-slate-900">
                    {data.tarifas.integracao ? "Disponível" : "Indisponível"}
                  </p>
                  {data.tarifas.integracao ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Janela de {data.tarifas.janelaIntegracaoMin} min
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Horários
                  </p>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">
                    Partidas na origem
                  </h2>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {data.horariosPartida.map((horario) => (
                  <span
                    key={horario}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-800"
                  >
                    {horario}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Pontos
                  </p>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">
                    Paradas da linha
                  </h2>
                </div>
              </div>

              <ol className="mt-4 space-y-2">
                {data.linha.paradas.map((parada, index) => (
                  <li
                    key={`${parada.nome}-${parada.lat}-${parada.lng}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand-primary text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{parada.nome}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {parada.lat.toFixed(5)}, {parada.lng.toFixed(5)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
