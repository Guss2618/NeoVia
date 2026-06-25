"use client";

import { CreditCard, Plus } from "lucide-react";
import Link from "next/link";
import { PageTransitionOverlay } from "./PageTransitionOverlay";
import { usePageTransition } from "../hooks/usePageTransition";

export function CartaoInicioCard() {
  const { isTransitioning, navigate } = usePageTransition();

  function handleCardClick() {
    navigate("/recarga?entrada=1");
  }

  return (
    <>
      <section
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
        className="mt-2 cursor-pointer rounded-[26px] bg-brand-primary p-4 text-white shadow-card transition hover:brightness-[1.03] focus:outline-none focus:ring-2 focus:ring-white/40 md:p-6"
        aria-label="Abrir área do cartão"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="grid size-11 place-items-center rounded-xl bg-white text-brand-primary md:size-12 md:rounded-2xl">
            <CreditCard size={24} />
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Passe
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-white/65 md:mt-6">
          Valor restante no passe
        </p>
        <strong className="block text-4xl font-black tracking-[-0.08em] md:text-5xl">
          R$ 42,80
        </strong>
        <Link
          href="/recarga/pagamento"
          onClick={(event) => event.stopPropagation()}
          className="relative z-10 mt-3 flex h-10 items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70 md:mt-5 md:h-12"
        >
          <Plus size={17} strokeWidth={3} />
          Recarregar cartão
        </Link>
      </section>

      {isTransitioning ? (
        <PageTransitionOverlay
          icon={<CreditCard size={30} strokeWidth={2.5} />}
          title="Abrindo cartão"
          subtitle="Saldo, histórico e recarga"
        />
      ) : null}
    </>
  );
}
