"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

type PaymentMethod = {
  id: "pix" | "credit" | "debit";
  title: string;
  description: string;
  feeLabel: string;
  feeValue: number;
  availability: string;
};

type CardData = {
  rechargeOptions: number[];
  paymentMethods: PaymentMethod[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function getPaymentIcon(methodId: PaymentMethod["id"]) {
  if (methodId === "pix") {
    return QrCode;
  }

  if (methodId === "credit") {
    return CreditCard;
  }

  return Landmark;
}

export default function PagamentoRecargaPage() {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod["id"] | "">(
    "",
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/cartao")
      .then((response) => response.json())
      .then((data: CardData) => {
        if (!isMounted) {
          return;
        }

        const initialAmount = data.rechargeOptions[1] ?? data.rechargeOptions[0] ?? 0;

        setCardData(data);
        setSelectedAmount(initialAmount);
        setSelectedMethod(data.paymentMethods[0]?.id ?? "");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleQuickAmount(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    const numericValue = Number(nextValue);

    setCustomAmount(nextValue);
    setSelectedAmount(Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0);
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 pb-28 pt-3 text-[hsl(228.51deg_100%_19.94%)] sm:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <header className="flex items-center gap-3">
          <Link
            href="/recarga"
            aria-label="Voltar para o cartão"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-brand-primary shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            <ArrowLeft size={19} />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Recarga
            </p>
            <h1 className="truncate text-2xl font-black tracking-[-0.06em] text-[hsl(228.51deg_100%_19.94%)]">
              Pagamento
            </h1>
          </div>
        </header>

        {!cardData ? (
          <section className="mt-3 flex min-h-[360px] items-center justify-center rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2
                className="animate-spin text-brand-primary"
                size={30}
                strokeWidth={2.5}
              />
              <p className="text-sm font-black text-brand-primary">
                Carregando recarga
              </p>
            </div>
          </section>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2 lg:items-start">
            <section className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Valor
                  </p>
                  <h2 className="mt-0.5 text-lg font-black tracking-[-0.04em] text-[hsl(228.51deg_100%_19.94%)]">
                    Escolha o valor
                  </h2>
                </div>
                <div className="grid size-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Banknote size={20} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {cardData.rechargeOptions.map((amount) => {
                  const isSelected = selectedAmount === amount && !customAmount;

                  return (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleQuickAmount(amount)}
                      className={`relative h-11 rounded-2xl border px-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-slate-200 bg-slate-50 text-[hsl(228.51deg_100%_19.94%)] hover:border-brand-primary/30"
                      }`}
                    >
                      {formatCurrency(amount).replace(/\s/g, "")}
                      {isSelected ? (
                        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-brand-primary shadow-sm">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <label className="mt-3 flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                <span className="text-sm font-black text-brand-primary">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Inserir outro valor"
                  className="h-9 min-w-0 flex-1 bg-transparent text-base font-black text-[hsl(228.51deg_100%_19.94%)] outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-brand-primary/45"
                />
              </label>
            </section>

            <section className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Pagamento
                  </p>
                  <h2 className="mt-0.5 text-lg font-black tracking-[-0.04em] text-[hsl(228.51deg_100%_19.94%)]">
                    Método de pagamento
                  </h2>
                </div>
                <div className="grid size-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Smartphone size={20} />
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {cardData.paymentMethods.map((method) => {
                  const Icon = getPaymentIcon(method.id);
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex min-h-12 items-center gap-3 rounded-2xl border px-3 py-1.5 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-slate-200 bg-slate-50 hover:border-brand-primary/30"
                      }`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                          isSelected
                            ? "bg-brand-primary text-white"
                            : "bg-white text-brand-primary"
                        }`}
                      >
                        <Icon size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-black">
                            {method.title}
                          </span>
                          {isSelected ? (
                            <BadgeCheck
                              className="shrink-0 text-emerald-700"
                              size={15}
                            />
                          ) : null}
                        </span>
                        <span className="block truncate text-[11px] font-semibold text-brand-primary/65">
                          {method.feeLabel} • {method.availability}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="lg:col-span-2">
              <button
                type="button"
                disabled={selectedAmount <= 0}
                className="flex min-h-11 w-full items-center justify-center gap-3 rounded-[18px] bg-brand-primary px-5 py-3 text-base font-black text-white shadow-[0_14px_32px_rgba(15,63,116,0.24)] transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Realizar recarga
                <ArrowRight size={19} />
              </button>

              <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700">
                <ShieldCheck size={15} />
                Pagamento protegido no ambiente NeoVIa
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
