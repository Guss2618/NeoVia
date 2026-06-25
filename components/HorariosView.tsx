"use client";

import { Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppTopBar } from "./AppTopBar";
import { LinhaCard } from "./LinhaCard";
import type { LinhaResumo } from "../lib/horarios";

export function HorariosView() {
  const searchParams = useSearchParams();
  const entradaSuave = searchParams.get("entrada") === "1";
  const buscaInputRef = useRef<HTMLInputElement>(null);
  const [linhas, setLinhas] = useState<LinhaResumo[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadLinhas() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set("q", query.trim());
        }

        const response = await fetch(`/api/linhas?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar as linhas.");
        }

        const data = (await response.json()) as { linhas: LinhaResumo[] };

        if (isMounted) {
          setLinhas(data.linhas);
        }
      } catch (fetchError) {
        if (isMounted && fetchError instanceof Error && fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const timeout = window.setTimeout(loadLinhas, query ? 250 : 0);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    if (!entradaSuave) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      buscaInputRef.current?.focus();
    }, 120);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [entradaSuave]);

  const totalLabel = useMemo(() => {
    if (loading) {
      return "Carregando linhas...";
    }

    if (linhas.length === 1) {
      return "1 linha encontrada";
    }

    return `${linhas.length} linhas encontradas`;
  }, [linhas.length, loading]);

  return (
    <main
      className={`min-h-screen bg-[#f4f8fc] px-5 pb-24 text-slate-950 md:px-8 md:pb-10 lg:px-10${
        entradaSuave ? " page-enter" : ""
      }`}
    >
      <section className="mx-auto w-full min-w-0 max-w-md md:max-w-6xl">
        <AppTopBar
          className="-mx-5 md:mx-0 md:rounded-b-[28px] md:px-6"
          version="MVP v0.0.25"
        />

        <label className="mt-6 flex h-12 items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/25 md:mt-8 md:h-14 md:max-w-3xl md:px-5">
          <Search className="text-brand-primary" size={20} />
          <input
            ref={buscaInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Procurar linhas de ônibus"
            className="h-10 w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <section className="mt-4 md:mt-6">
          <div className="flex min-w-0 items-end justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Linhas de ônibus
            </p>
            <p className="shrink-0 text-[11px] font-semibold text-slate-500">
              {totalLabel}
            </p>
          </div>

          {error ? (
            <div className="mt-3 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <Loader2 className="animate-spin text-brand-primary" size={18} />
              Buscando linhas...
            </div>
          ) : (
            <div className="mt-2 grid w-full min-w-0 gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3">
              {linhas.map((linha) => (
                <LinhaCard
                  key={linha.id}
                  id={linha.id}
                  line={`Linha ${linha.ref}`}
                  title={linha.nomeResumido}
                  time={linha.proximaSaida}
                  points={`${linha.totalParadas} pontos`}
                />
              ))}
            </div>
          )}

          {!loading && !error && linhas.length === 0 ? (
            <div className="mt-8 rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
              <p className="text-sm font-bold text-slate-700">
                Nenhuma linha encontrada
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Tente buscar pelo número ou nome da linha.
              </p>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
