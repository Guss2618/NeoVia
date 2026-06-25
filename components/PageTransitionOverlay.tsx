import type { ReactNode } from "react";

type PageTransitionOverlayProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export function PageTransitionOverlay({
  icon,
  title,
  subtitle,
}: PageTransitionOverlayProps) {
  return (
    <div
      className="page-transition fixed inset-0 z-80 grid place-items-center bg-[#f4f8fc]/95 px-6 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-transition__panel flex flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-[24px] bg-brand-primary text-white shadow-[0_18px_40px_rgba(15,63,116,0.28)]">
          {icon}
        </span>
        <div>
          <p className="text-lg font-black tracking-tight text-brand-dark">{title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
