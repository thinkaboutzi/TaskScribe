import { useEffect } from "react";

export default function useGlassHover(deps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const coarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarsePointer || reduceMotion) return undefined;

    let activeEl = null;
    let rafId = null;

    const resetEl = (el) => {
      el.style.setProperty("--hover", "0");
      el.style.setProperty("--hx", "50%");
      el.style.setProperty("--hy", "50%");
    };

    const handleMove = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest(".glass-hover");
      if (!el) return;

      if (activeEl && activeEl !== el) {
        resetEl(activeEl);
      }
      activeEl = el;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xr = (x / rect.width) * 100;
      const yr = (y / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--hover", "1");
        el.style.setProperty("--hx", `${xr}%`);
        el.style.setProperty("--hy", `${yr}%`);
      });
    };

    const handlePointerOut = (event) => {
      if (!activeEl) return;
      const related = event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(".glass-hover")
        : null;
      if (event.target === activeEl && !related) {
        resetEl(activeEl);
        activeEl = null;
      }
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerout", handlePointerOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, deps);
}
