import { BusFront, CreditCard, Plus, Search } from "lucide-react";
import Link from "next/link";
import { AppTopBar } from "../../components/AppTopBar";

const favoriteRoutes = [
  {
    line: "Linha 012",
    title: "Centro via Kobrasol",
    time: "Sai em 8 min",
    points: "3 pontos proximos",
  },
  {
    line: "Linha 063",
    title: "Barreiros via Campinas",
    time: "Sai em 14 min",
    points: "2 pontos proximos",
  },
];

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-24 text-slate-950">
      <section className="mx-auto w-full max-w-md">
        <AppTopBar className="-mx-5" version="MVP v0.0.17" />

        <label className="mt-6 flex h-12 items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/25">
          <Search className="text-brand-primary" size={20} />
          <input
            type="search"
            placeholder="Escolha sua rota"
            className="h-10 w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <section className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
            Rotas favoritas
          </p>

          <div className="mt-2 grid gap-2">
            {favoriteRoutes.map((route) => (
              <article
                key={route.line}
                className="flex h-[72px] items-center gap-2 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <BusFront size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-brand-primary">
                    {route.line}
                  </p>
                  <h3 className="truncate text-sm font-black tracking-tighter text-[hsl(228.51deg_100%_19.94%)]">
                    {route.title}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                    {route.time}
                  </span>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-semibold text-slate-500">
                    {route.points}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
          Cartão
        </p>

        <section className="mt-2 rounded-[26px] bg-brand-primary p-4 text-white shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-white text-brand-primary">
              <CreditCard size={24} />
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Passe
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-white/65">
            Valor restante no passe
          </p>
          <strong className="block text-4xl font-black tracking-[-0.08em]">
            R$ 42,80
          </strong>
          <Link
            href="/recarga/pagamento"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <Plus size={17} strokeWidth={3} />
            Recarregar cartão
          </Link>
        </section>
      </section>

    </main>
  );
}
