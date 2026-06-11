import {
  CalendarClock,
  BusFront,
  CreditCard,
  Search,
} from "lucide-react";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-28 pt-5 text-slate-950">
      <section className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Bom dia</p>
            <h1 className="text-3xl font-black tracking-[-0.07em]">NeoVIa</h1>
          </div>
          <Link
            href="/versoes"
            className="rounded-full bg-brand-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            MVP v0.0.6
          </Link>
        </header>

        <label className="mt-6 flex min-h-14 items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/25">
          <Search className="text-brand-primary" size={22} />
          <input
            type="search"
            placeholder="Escolha sua rota"
            className="min-h-12 w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-primary">
                Rotas favoritas
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.06em]">
                Acesso rapido
              </h2>
            </div>
            <BusFront className="text-brand-primary" size={28} />
          </div>

          <div className="mt-4 grid gap-3">
            {favoriteRoutes.map((route) => (
              <article
                key={route.line}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <BusFront size={26} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {route.time}
                  </span>
                </div>
                <p className="mt-4 text-sm font-black text-brand-primary">
                  {route.line}
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tighter">
                  {route.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {route.points}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[30px] bg-brand-primary p-5 text-white shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white text-brand-primary">
              <CreditCard size={30} />
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Passe
            </span>
          </div>
          <p className="mt-5 text-sm font-semibold text-white/65">
            Valor restante no passe
          </p>
          <strong className="mt-1 block text-5xl font-black tracking-[-0.08em]">
            R$ 42,80
          </strong>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white/80">
            <CalendarClock size={18} />
            Ultima atualizacao hoje, 10:15
          </div>
        </section>
      </section>

    </main>
  );
}
