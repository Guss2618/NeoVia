import { Bell, BusFront, UserRound } from "lucide-react";
import Link from "next/link";

type AppTopBarProps = {
  className?: string;
  version: string;
};

export function AppTopBar({ className = "", version }: AppTopBarProps) {
  return (
    <header
      className={`flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 shadow-sm ${className}`}
    >
      <button
        type="button"
        aria-label="NeoVIa"
        className="flex min-w-0 items-center gap-2.5 rounded-2xl text-left focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-primary text-white shadow-sm">
          <BusFront size={22} strokeWidth={2.5} />
        </span>
        <span className="truncate text-xl font-black tracking-[-0.05em] text-brand-dark">
          NeoVIa
        </span>
      </button>

      <Link
        href="/versoes"
        className="shrink-0 text-[11px] font-semibold text-slate-300 transition hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/40"
      >
        {version}
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Notificacoes"
          className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <Bell size={19} />
        </button>
        <button
          type="button"
          aria-label="Perfil"
          className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <UserRound size={19} />
        </button>
      </div>
    </header>
  );
}
