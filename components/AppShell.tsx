"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={pathname === "/" ? undefined : "md:pl-24"}>
      {children}
    </div>
  );
}
