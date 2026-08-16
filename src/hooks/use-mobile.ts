import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener("change", onChange);
    // Use the event-based path — don't call setState synchronously in the effect body
    // Initial state will be set on the first matchMedia change event,
    // but to avoid SSR/hydration mismatch we check on mount via requestAnimationFrame.
    const raf = requestAnimationFrame(() => setIsMobile(mql.matches));
    return () => {
      mql.removeEventListener("change", onChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  return !!isMobile;
}
