import { ArrowLeft, MapPinned, Route } from "lucide-react";
import Link from "next/link";

export default function RotasPage() {
  return (
    <main className="min-h-screen bg-[#f4f8fc] px-5 pb-28 pt-6 text-slate-950 sm:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <Link
          href="/inicio"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-card sm:p-8">
          <div className="grid size-16 place-items-center rounded-2xl bg-brand-primary text-white">
            <Route size={34} />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.07em] sm:text-6xl">
            Para onde voce quer ir?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Em breve, esta tela tera um campo de destino para sugerir rotas,
            linhas disponiveis e alternativas para chegar ao local desejado.
          </p>
          <div className="mt-8 rounded-[24px] border border-dashed border-brand-primary/30 bg-brand-primary/5 p-5 text-brand-primary">
            <MapPinned size={28} />
            <p className="mt-3 font-bold">Modulo em preparacao para o MVP.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
