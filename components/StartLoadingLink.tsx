"use client";

import { BusFront, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

type StartLoadingLinkProps = {
  children: ReactNode;
  className: string;
  href: string;
};

export function StartLoadingLink({
  children,
  className,
  href,
}: StartLoadingLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleStart() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      router.push(href);
    }, 850);
  }

  return (
    <>
      <button type="button" onClick={handleStart} className={className}>
        {children}
      </button>

      {isLoading ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-white text-brand-dark">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-primary text-white shadow-sm">
                <BusFront size={30} strokeWidth={2.5} />
              </span>
              <span className="text-3xl font-black tracking-[-0.05em]">
                NeoVIa
              </span>
            </div>
            <Loader2
              className="animate-spin text-brand-primary"
              size={28}
              strokeWidth={2.5}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
