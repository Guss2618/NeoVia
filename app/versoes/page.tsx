"use client";

import { ArrowLeft, BusFront, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Versao = {
  versao: string;
  data: string;
  alteracoes: string[];
};

export default function VersoesPage() {
  const [versoes, setVersoes] = useState<Versao[]>([]);

  useEffect(() => {
    fetch("/api/versoes")
      .then((response) => response.json())
      .then((data: Versao[]) => setVersoes(data));
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#0a2b52,#0f3f74)] px-5 pb-28 pt-6 text-white sm:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand-primary shadow-card">
            <BusFront size={28} strokeWidth={2.5} />
          </div>
        </header>

        <div className="mt-10 rounded-brand border border-white/15 bg-white/10 p-6 shadow-card backdrop-blur sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/15">
              <History size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/55">
                NeoVIa
              </p>
              <h1 className="text-3xl font-black tracking-[-0.06em] sm:text-5xl">
                Historico de versoes
              </h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {versoes.map((item) => (
              <article
                key={item.versao}
                className="rounded-[24px] border border-white/15 bg-white/10 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-black tracking-[-0.04em]">
                    {item.versao}
                  </h2>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                    {item.data}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/75">
                  {item.alteracoes.map((alteracao) => (
                    <li key={alteracao}>{alteracao}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
