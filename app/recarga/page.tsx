"use client";

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Check,
  Clock3,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  WalletCards,
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

type PaymentMethod = {
  id: "pix" | "credit" | "debit";
  title: string;
  description: string;
  feeLabel: string;
  feeValue: number;
  availability: string;
};

type Transaction = {
  title: string;
  date: string;
  value: number;
  type: "credit" | "debit";
};

type CardData = {
  card: CardInfo;
  rechargeOptions: number[];
  paymentMethods: PaymentMethod[];
  recentTransactions: Transaction[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getPaymentIcon(methodId: PaymentMethod["id"]) {
  if (methodId === "pix") {
    return QrCode;
  }

  if (methodId === "credit") {
    return CreditCard;
  }

  return Landmark;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export default function RecargaPage() {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);
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

        setCardData(data);
        setSelectedAmount(data.rechargeOptions[1] ?? data.rechargeOptions[0] ?? 0);
        setSelectedMethod(data.paymentMethods[0]?.id ?? "");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPayment = cardData?.paymentMethods.find(
    (method) => method.id === selectedMethod,
  );
  const feeValue = selectedPayment?.feeValue ?? 0;
  const totalValue = selectedAmount + feeValue;
  const balanceAfterRecharge = (cardData?.card.balance ?? 0) + selectedAmount;
  const SelectedPaymentIcon = selectedPayment
    ? getPaymentIcon(selectedPayment.id)
    : CreditCard;

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-28 text-slate-950 sm:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <AppTopBar
          className="-mx-5 sm:-mx-8 sm:px-8"
          version="MVP v0.0.15"
        />

        <header className="mt-5 flex items-center gap-4">
          <Link
            href="/inicio"
            aria-label="Voltar para o início"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-brand-primary shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Meu passe
            </p>
            <h1 className="text-3xl font-black tracking-[-0.06em]">
              Recarregar cartão
            </h1>
          </div>
        </header>

        {!cardData ? (
          <section className="mt-6 flex min-h-[420px] items-center justify-center rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2
                className="animate-spin text-brand-primary"
                size={30}
                strokeWidth={2.5}
              />
              <p className="text-sm font-black text-slate-600">
                Carregando cartão
              </p>
            </div>
          </section>
        ) : (
          <>
            <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="grid content-start gap-5">
                <section className="rounded-[28px] bg-brand-primary p-5 text-white shadow-card sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand-primary">
                      <WalletCards size={27} />
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

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                        Titular
                      </p>
                      <p className="mt-1 truncate text-sm font-black">
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
                    <Clock3 size={16} />
                    Atualizado {cardData.card.lastUpdate.toLowerCase()}
                  </div>
                </section>

                <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                        Resumo
                      </p>
                      <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                        Próxima recarga
                      </h2>
                    </div>
                    <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <ReceiptText size={22} />
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-3">
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <dt className="text-sm font-bold text-slate-500">
                        Valor escolhido
                      </dt>
                      <dd className="text-sm font-black">
                        {formatCurrency(selectedAmount)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <dt className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <SelectedPaymentIcon size={16} />
                        Pagamento
                      </dt>
                      <dd className="text-right text-sm font-black">
                        {selectedPayment?.title ?? "Selecionar"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <dt className="text-sm font-bold text-slate-500">Taxas</dt>
                      <dd className="text-sm font-black">
                        {formatCurrency(feeValue)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <dt className="text-sm font-bold text-slate-500">
                        Total a pagar
                      </dt>
                      <dd className="text-sm font-black">
                        {formatCurrency(totalValue)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-brand-primary px-4 py-3 text-white">
                      <dt className="text-sm font-bold text-white/75">
                        Saldo após recarga
                      </dt>
                      <dd className="text-base font-black">
                        {formatCurrency(balanceAfterRecharge)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-[20px] bg-brand-primary px-5 py-4 text-base font-black text-white shadow-[0_14px_32px_rgba(15,63,116,0.28)] transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    Finalizar recarga
                    <ArrowRight size={20} />
                  </button>

                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                    <ShieldCheck size={16} />
                    Pagamento protegido no ambiente NeoVIa
                  </div>
                </section>
              </div>

              <div className="grid content-start gap-5">
                <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                        Depósito
                      </p>
                      <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                        Escolha o valor
                      </h2>
                    </div>
                    <div className="grid size-11 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Banknote size={22} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {cardData.rechargeOptions.map((amount) => {
                      const isSelected = selectedAmount === amount;

                      return (
                        <button
                          key={amount}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedAmount(amount)}
                          className={`relative flex min-h-24 flex-col justify-between rounded-[22px] border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                            isSelected
                              ? "border-brand-primary bg-brand-primary text-white shadow-[0_14px_28px_rgba(15,63,116,0.22)]"
                              : "border-slate-200 bg-slate-50 text-slate-900 hover:border-brand-primary/30 hover:bg-white"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                              isSelected ? "text-white/65" : "text-slate-400"
                            }`}
                          >
                            Adicionar
                          </span>
                          <strong className="text-2xl font-black tracking-[-0.06em]">
                            {formatCurrency(amount)}
                          </strong>
                          {isSelected ? (
                            <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-white text-brand-primary">
                              <Check size={16} strokeWidth={3} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                        Pagamento
                      </p>
                      <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                        Método de pagamento
                      </h2>
                    </div>
                    <div className="grid size-11 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Smartphone size={22} />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {cardData.paymentMethods.map((method) => {
                      const Icon = getPaymentIcon(method.id);
                      const isSelected = selectedMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`flex min-h-20 items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                            isSelected
                              ? "border-brand-primary bg-brand-primary/5"
                              : "border-slate-200 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/5"
                          }`}
                        >
                          <span
                            className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                              isSelected
                                ? "bg-brand-primary text-white"
                                : "bg-slate-100 text-brand-primary"
                            }`}
                          >
                            <Icon size={22} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate text-sm font-black text-slate-950">
                                {method.title}
                              </span>
                              {isSelected ? (
                                <BadgeCheck
                                  className="shrink-0 text-emerald-700"
                                  size={16}
                                />
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                              {method.description}
                            </span>
                            <span className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em]">
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500">
                                {method.feeLabel}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                                {method.availability}
                              </span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>

            <section className="mt-5 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Histórico
                  </p>
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
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          {transaction.date}
                        </p>
                      </div>
                      <strong
                        className={`shrink-0 text-sm font-black ${
                          isCredit ? "text-emerald-700" : "text-slate-900"
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
          </>
        )}
      </section>
    </main>
  );
}
