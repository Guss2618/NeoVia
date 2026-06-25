"use client";

import { Route, Search } from "lucide-react";
import { PageTransitionOverlay } from "./PageTransitionOverlay";
import { usePageTransition } from "../hooks/usePageTransition";

type RouteSearchTriggerProps = {
  className?: string;
};

export function RouteSearchTrigger({ className = "" }: RouteSearchTriggerProps) {
  const { isTransitioning, navigate } = usePageTransition();

  function handleClick() {
    navigate("/rotas?entrada=1");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Escolher rota"
        className={`flex h-12 w-full items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 text-left shadow-sm transition hover:border-brand-primary/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 md:h-14 md:px-5 ${className}`}
      >
        <Search className="shrink-0 text-brand-primary" size={20} />
        <span className="truncate text-base font-semibold text-slate-400">
          Escolha sua rota
        </span>
      </button>

      {isTransitioning ? (
        <PageTransitionOverlay
          icon={<Route size={30} strokeWidth={2.5} />}
          title="Abrindo rotas"
          subtitle="Para onde você quer ir?"
        />
      ) : null}
    </>
  );
}
