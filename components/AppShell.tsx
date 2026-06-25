"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hasNavigation = pathname !== "/" && pathname !== "/versoes";

  return <div className={hasNavigation ? "md:pl-24" : undefined}>{children}</div>;
}
