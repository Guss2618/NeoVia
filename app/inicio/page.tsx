import { AppTopBar } from "../../components/AppTopBar";
import { CartaoInicioCard } from "../../components/CartaoInicioCard";
import { FavoriteRouteCard } from "../../components/FavoriteRouteCard";
import { RouteSearchTrigger } from "../../components/RouteSearchTrigger";

const favoriteRoutes = [
  {
    line: "Linha 012",
    title: "Centro via Kobrasol",
    time: "Sai em 8 min",
    points: "3 pontos próximos",
  },
  {
    line: "Linha 063",
    title: "Barreiros via Campinas",
    time: "Sai em 14 min",
    points: "2 pontos próximos",
  },
];

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-24 text-slate-950 md:px-8 md:pb-10 lg:px-10">
      <section className="mx-auto w-full max-w-md md:max-w-6xl">
        <AppTopBar
          className="-mx-5 md:mx-0 md:rounded-b-[28px] md:px-6"
          version="MVP v0.0.25"
        />

        <RouteSearchTrigger className="mt-6 md:mt-8 md:max-w-3xl" />

        <div className="md:mt-6 md:grid md:grid-cols-[minmax(0,1fr)_360px] md:items-start md:gap-5 lg:grid-cols-[minmax(0,1.1fr)_390px] lg:gap-6">
          <section className="mt-4 md:mt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Rotas favoritas
            </p>

            <div className="mt-2 grid gap-2 md:gap-3">
              {favoriteRoutes.map((route) => (
                <FavoriteRouteCard
                  key={route.line}
                  line={route.line}
                  title={route.title}
                  time={route.time}
                  points={route.points}
                />
              ))}
            </div>
          </section>

          <div className="mt-3 md:mt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Cartão
            </p>

            <CartaoInicioCard />
          </div>
        </div>
      </section>
    </main>
  );
}
