"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppTopBar } from "../../components/AppTopBar";

type CardInfo = {
  holder: string;
  numberMasked: string;
  balance: number;
  lastUpdate: string;
  category: string;
  status: string;
  validUntil: string;
};

type Transaction = {
  title: string;
  date: string;
  value: number;
  type: "credit" | "debit";
};

type CardData = {
  card: CardInfo;
  recentTransactions: Transaction[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export default function RecargaPage() {
  const [cardData, setCardData] = useState<CardData | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/cartao")
      .then((response) => response.json())
      .then((data: CardData) => {
        if (isMounted) {
          setCardData(data);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-28 text-[hsl(228.51deg_100%_19.94%)] sm:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <AppTopBar
          className="-mx-5 sm:-mx-8 sm:px-8"
          version="MVP v0.0.20"
        />

        {!cardData ? (
          <section className="mt-6 flex min-h-[420px] items-center justify-center rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2
                className="animate-spin text-brand-primary"
                size={30}
                strokeWidth={2.5}
              />
              <p className="text-sm font-black text-brand-primary">
                Carregando cartão
              </p>
            </div>
          </section>
        ) : (
          <>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <section className="rounded-[28px] bg-brand-primary p-5 text-white shadow-card sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand-primary">
                      <CreditCard size={26} />
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                      Passe
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-semibold text-white/65">
                    Valor atual no cartão
                  </p>
                  <strong className="block text-4xl font-black tracking-[-0.08em] sm:text-5xl">
                    {formatCurrency(cardData.card.balance)}
                  </strong>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                        Titular
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {cardData.card.holder}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                        Cartão
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {cardData.card.numberMasked}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white/80">
                    <CalendarClock size={16} />
                    Atualizado {cardData.card.lastUpdate.toLowerCase()}
                  </div>
                </section>

                <Link
                  href="/recarga/pagamento"
                  className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-[20px] bg-brand-primary px-5 py-4 text-base font-black text-white shadow-[0_14px_32px_rgba(15,63,116,0.28)] transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <Plus size={22} strokeWidth={3} />
                  Realizar recarga
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div className="grid content-start gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Dados do cartão
                  </p>

                  <section className="mt-2 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-brand-primary/45">
                        Categoria
                      </dt>
                      <dd className="mt-1 text-sm font-black">
                        {cardData.card.category}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-brand-primary/45">
                        Validade
                      </dt>
                      <dd className="mt-1 text-sm font-black">
                        {cardData.card.validUntil}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-3">
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        Status
                      </dt>
                      <dd className="mt-1 flex items-center gap-1 text-sm font-black text-emerald-700">
                        <CheckCircle2 size={14} />
                        {cardData.card.status}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-brand-primary/45">
                        Final
                      </dt>
                      <dd className="mt-1 text-sm font-black">
                        {cardData.card.numberMasked.slice(-4)}
                      </dd>
                    </div>
                  </dl>
                  </section>
                </div>

              </div>
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Histórico
            </p>

            <section className="mt-2 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                    Movimentações recentes
                  </h2>
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {cardData.recentTransactions.map((transaction) => {
                  const isCredit = transaction.type === "credit";
                  const TransactionIcon = isCredit
                    ? ArrowDownLeft
                    : ArrowUpRight;

                  return (
                    <article
                      key={`${transaction.title}-${transaction.date}`}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                          isCredit
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-brand-primary/10 text-brand-primary"
                        }`}
                      >
                        <TransactionIcon size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-black">
                          {transaction.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-brand-primary/65">
                          {transaction.date}
                        </p>
                      </div>
                      <strong
                        className={`shrink-0 text-sm font-black ${
                          isCredit ? "text-emerald-700" : "text-[hsl(228.51deg_100%_19.94%)]"
                        }`}
                      >
                        {isCredit ? "+" : "-"}{" "}
                        {formatCurrency(Math.abs(transaction.value))}
                      </strong>
                    </article>
                  );
                })}
              </div>
            </section>

            <button
              type="button"
              className="mt-5 flex min-h-14 w-full items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-brand-primary/30 hover:bg-brand-primary/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <FileText size={22} />
                </span>
                <span>
                  <span className="block text-sm font-black">
                    Gerar extrato
                  </span>
                  <span className="block text-xs font-semibold text-brand-primary/65">
                    Consulte todas as movimentações
                  </span>
                </span>
              </span>
              <ArrowRight className="shrink-0 text-brand-primary" size={20} />
            </button>
          </>
        )}
      </section>
    </main>
  );
}
