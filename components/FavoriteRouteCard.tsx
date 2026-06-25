"use client";

import { BusFront, Clock3 } from "lucide-react";
import { PageTransitionOverlay } from "./PageTransitionOverlay";
import { usePageTransition } from "../hooks/usePageTransition";

type FavoriteRouteCardProps = {
  line: string;
  title: string;
  time: string;
  points: string;
};

export function FavoriteRouteCard({
  line,
  title,
  time,
  points,
}: FavoriteRouteCardProps) {
  const { isTransitioning, navigate } = usePageTransition();

  function handleClick() {
    navigate("/horarios?entrada=1");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex h-[72px] w-full items-center gap-2 rounded-[22px] border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-brand-primary/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 md:h-[104px] md:gap-4 md:rounded-[26px] md:p-5"
      >
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary md:size-12 md:rounded-2xl">
          <BusFront size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-wide text-brand-primary">
            {line}
          </p>
          <h3 className="truncate text-sm font-black tracking-tighter text-[hsl(228.51deg_100%_19.94%)] md:text-lg">
            {title}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700 md:px-3 md:text-xs">
            {time}
          </span>
          <p className="mt-1 whitespace-nowrap text-[10px] font-semibold text-slate-500 md:text-xs">
            {points}
          </p>
        </div>
      </button>

      {isTransitioning ? (
        <PageTransitionOverlay
          icon={<Clock3 size={30} strokeWidth={2.5} />}
          title="Abrindo horários"
          subtitle="Consulte as linhas de ônibus"
        />
      ) : null}
    </>
  );
}
