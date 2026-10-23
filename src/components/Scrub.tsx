import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SCRUB } from "../scrub-meta";

type Props = {
  sprite: string;
  label: string;
  className?: string;

  rule?: boolean;

  start?: number;
};

export function Scrub({ sprite, label, className = "", rule = true, start = 0 }: Props) {
  const meta = SCRUB[sprite];
  const box = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const frame = useRef(meta ? Math.round(start * (meta.count - 1)) : 0);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  const show = (i: number) => {
    const el = box.current;
    if (!el || !meta) return;
    frame.current = i;
    const col = i % meta.cols;
    const row = Math.floor(i / meta.cols);
    const x = meta.cols > 1 ? (col / (meta.cols - 1)) * 100 : 0;
    const y = meta.rows > 1 ? (row / (meta.rows - 1)) * 100 : 0;
    el.style.backgroundPosition = `${x}% ${y}%`;
    if (bar.current) bar.current.style.transform = `scaleX(${meta.count > 1 ? i / (meta.count - 1) : 1})`;
  };

  useEffect(() => {
    setReady(false);
    const el = box.current;
    if (!el || !meta) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const img = new Image();
        img.onload = () => !cancelled && setReady(true);
        img.src = `/scrub/${sprite}.webp`;
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [sprite, meta]);

  useEffect(() => {
    if (ready) show(frame.current);

  }, [ready]);

  useEffect(() => {
    const el = box.current;
    if (!ready || reduce || !el || !meta || window.matchMedia("(hover: hover)").matches) return;
    let timer = 0;
    let dir = 1;
    const tick = () => {
      let next = frame.current + dir;
      if (next >= meta.count || next < 0) {
        dir = -dir;
        next = frame.current + dir;
      }
      show(next);
    };
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(tick, 120);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };

  }, [ready, reduce, meta]);

  if (!meta) return null;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready || reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    show(Math.round(t * (meta.count - 1)));
  };

  return (
    <div className={className}>
      <div
        ref={box}
        role="img"
        aria-label={label}
        onPointerMove={onMove}
        className="w-full cursor-ew-resize bg-surface-2 bg-no-repeat"
        style={{
          aspectRatio: `${meta.w} / ${meta.h}`,
          backgroundImage: `url(/scrub/${sprite}${ready ? "" : "-0"}.webp)`,
          backgroundSize: ready ? `${meta.cols * 100}% ${meta.rows * 100}%` : "100% 100%",
          backgroundPosition: "0% 0%",
        }}
      />
      {rule && (
        <div className="relative mt-3 h-px w-full bg-line" aria-hidden>
          <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-75" />
        </div>
      )}
    </div>
  );
}
