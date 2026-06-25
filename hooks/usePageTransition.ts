"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const PAGE_TRANSITION_DELAY = 520;

export function usePageTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback(
    (href: string) => {
      if (isTransitioning) {
        return;
      }

      setIsTransitioning(true);

      window.setTimeout(() => {
        router.push(href);
      }, PAGE_TRANSITION_DELAY);
    },
    [isTransitioning, router],
  );

  return { isTransitioning, navigate };
}
