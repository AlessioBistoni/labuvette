"use client";

import { useLayoutEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

/** null fino al primo layout sul client (evita mismatch SSR). */
export function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
