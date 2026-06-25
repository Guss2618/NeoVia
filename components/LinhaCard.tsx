import { BusFront } from "lucide-react";
import Link from "next/link";

type LinhaCardProps = {
  id: string;
  line: string;
  title: string;
  time: string;
  points: string;
};

export function LinhaCard({ id, line, title, time, points }: LinhaCardProps) {
  return (
    <Link
      href={`/horarios/${id}`}
      className="block w-full min-w-0 max-w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 md:flex md:h-[104px] md:items-center md:gap-4 md:rounded-[26px] md:p-5"
    >
      <div className="flex min-w-0 items-center gap-2 md:min-w-0 md:flex-1 md:gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary md:size-12 md:rounded-2xl">
          <BusFront size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-wide text-brand-primary">
            {line}
          </p>
          <h3 className="line-clamp-2 text-sm font-black leading-tight tracking-tighter text-[hsl(228.51deg_100%_19.94%)] md:truncate md:text-lg">
            {title}
          </h3>
        </div>

        <div className="hidden shrink-0 text-right md:block">
          <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {time}
          </span>
          <p className="mt-1 whitespace-nowrap text-xs font-semibold text-slate-500">
            {points}
          </p>
        </div>
      </div>

      <div className="mt-2 flex min-w-0 items-center justify-between gap-2 pl-12 md:hidden">
        <span className="min-w-0 truncate rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
          {time}
        </span>
        <p className="shrink-0 text-[10px] font-semibold text-slate-500">{points}</p>
      </div>
    </Link>
  );
}
