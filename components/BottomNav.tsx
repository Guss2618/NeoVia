"use client";

import { Clock3, CreditCard, Home, MapPinned } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Início",
    href: "/inicio",
    icon: Home,
  },
  {
    label: "Cartão",
    href: "/recarga",
    icon: CreditCard,
  },
  {
    label: "Horários",
    href: "/horarios",
    icon: Clock3,
  },
  {
    label: "Rotas",
    href: "/rotas",
    icon: MapPinned,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pb-4 pt-3 shadow-[0_-12px_36px_rgba(15,63,116,0.12)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-brand-primary"
              }`}
            >
              <Icon size={22} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
