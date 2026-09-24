import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Steps through 0..steps-1 once the element scrolls into view, one step every
 * `interval` ms. Under reduced motion it jumps straight to the LAST step, since
 * the finished state is the informative one.
 *
 * By default it restarts each time it scrolls back into view. `once` plays it
 * a single time. `run` increments to replay the sequence from the start.
 */
export function useSequence(
  steps: number,
  interval: number | ((step: number) => number),
  opts: { loopDelay?: number; once?: boolean } = {},
) {
  const delay = useRef(interval);
  delay.current = interval;
  const wait = (s: number) => (typeof delay.current === "function" ? delay.current(s) : delay.current);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: !!opts.once, amount: 0.35 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(steps - 1);
      return;
    }
    if (!inView) return;
    setStep(0);
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      current += 1;
      if (current < steps) {
        setStep(current);
        timer = setTimeout(tick, wait(current));
      } else if (opts.loopDelay) {
        timer = setTimeout(() => setRun((r) => r + 1), opts.loopDelay);
      }
    };
    timer = setTimeout(tick, wait(0));
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, steps, run, opts.loopDelay]);

  return { ref, step, replay: () => setRun((r) => r + 1), reduced: !!reduced };
}

/** Runs a callback on an interval while the element is on screen. */
export function useTickerInView(interval: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), interval);
    return () => clearInterval(id);
  }, [inView, reduced, interval]);

  return { ref, tick, active: inView && !reduced, reduced: !!reduced };
}

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
