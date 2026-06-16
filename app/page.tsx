import {
  ArrowRight,
  BusFront,
  Clock3,
  CreditCard,
  MapPinned,
  Route,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Horarios",
    description: "Consulte saidas das linhas de forma rapida e acessivel.",
    icon: Clock3,
  },
  {
    title: "Recarga",
    description: "Prepare recargas online para o cartao de transporte.",
    icon: CreditCard,
  },
  {
    title: "Rotas",
    description: "Veja quais linhas ajudam voce a chegar ao destino.",
    icon: Route,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_32%),linear-gradient(145deg,#0a2b52_0%,#0f3f74_52%,#071f3d_100%)] px-5 pb-28 pt-6 text-white sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl flex-col justify-between gap-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-brand-primary shadow-card">
              <BusFront size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Mobilidade
              </p>
              <h1 className="text-2xl font-black tracking-[-0.08em]">NeoVIa</h1>
            </div>
          </div>
          <Link
            href="/versoes"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            MVP v0.0.10
          </Link>
        </header>

        <div className="flex flex-1 items-center">
          <section className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <MapPinned size={18} />
              Transporte publico mais simples
            </div>
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-7xl">
              Sua cidade conectada em uma unica plataforma.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              Consulte horarios, planeje rotas e acompanhe recursos de recarga
              em uma experiencia mobile-first feita para funcionar bem tambem no
              PC.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inicio"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-black text-brand-primary shadow-card transition hover:-translate-y-0.5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                Começar
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/versoes"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-bold text-white/80 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                Ver versoes
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur"
                  >
                    <Icon className="mb-3 text-white" size={24} />
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
