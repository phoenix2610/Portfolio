import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SCRUB } from "../scrub-meta";

let worker: Worker | null = null;
let jobId = 0;
const jobs = new Map<number, { ok: (f: ImageBitmap[]) => void; fail: (e: unknown) => void }>();
function decodeFrames(url: string, w: number, h: number, cols: number, rows: number, count: number) {
  if (!worker) {
    worker = new Worker(new URL("./scrub.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ id: number; frames?: ImageBitmap[]; error?: string }>) => {
      const job = jobs.get(e.data.id);
      jobs.delete(e.data.id);
      if (e.data.frames) job?.ok(e.data.frames);
      else job?.fail(e.data.error);
    };
  }
  const id = ++jobId;
  return new Promise<ImageBitmap[]>((ok, fail) => {
    jobs.set(id, { ok, fail });
    worker!.postMessage({ id, url: new URL(url, location.href).href, w, h, cols, rows, count });
  });
}

type Props = {
  sprite: string;
  label: string;
  className?: string;

  rule?: boolean;

  start?: number;

  interactive?: boolean;
};

export function Scrub({ sprite, label, className = "", rule = true, start = 0, interactive = true }: Props) {
  const meta = SCRUB[sprite];
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sheet = useRef<ImageBitmap[] | null>(null);
  const warmed = useRef(false);
  const decoding = useRef<Promise<void> | null>(null);
  const frame = useRef(meta ? Math.round(start * (meta.count - 1)) : 0);
  const pending = useRef<number | null>(null);
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();

  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    fetch(`/scrub/${sprite}.webp`).catch(() => (warmed.current = false));
  };

  const draw = (i: number) => {
    frame.current = i;
    if (bar.current && meta) bar.current.style.transform = `scaleX(${meta.count > 1 ? i / (meta.count - 1) : 1})`;
    const bm = sheet.current?.[i];
    const c = canvas.current;
    if (!bm || !c) return;
    c.getContext("2d")!.drawImage(bm, 0, 0, c.width, c.height);
  };

  const ensure = () => {
    if (!meta || sheet.current) return Promise.resolve();
    const el = box.current!;
    const w = Math.min(meta.w, Math.round(el.clientWidth * Math.min(window.devicePixelRatio || 1, 2)));
    const h = Math.round((w * meta.h) / meta.w);
    return (decoding.current ??= decodeFrames(`/scrub/${sprite}.webp`, w, h, meta.cols, meta.rows, meta.count)
      .then((frames) => {
        if (!decoding.current) return frames.forEach((f) => f.close());
        const c = canvas.current!;
        c.width = w;
        c.height = h;
        sheet.current = frames;
        draw(pending.current ?? frame.current);
        pending.current = null;
        setLive(true);
      })
      .catch(() => {
        decoding.current = null;
      }));
  };

  const release = () => {
    sheet.current?.forEach((f) => f.close());
    sheet.current = null;
    decoding.current = null;
  };

  useEffect(() => {
    const el = box.current;
    if (!el || !meta || reduce || !interactive) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && warm(), { rootMargin: "600px 0px" });
    const far = new IntersectionObserver(([e]) => !e.isIntersecting && release(), { rootMargin: "1200px 0px" });
    near.observe(el);
    far.observe(el);
    return () => {
      near.disconnect();
      far.disconnect();
      release();
    };

  }, [sprite, reduce, interactive]);

  useEffect(() => {
    const el = box.current;
    if (!el || !meta || reduce || !interactive || window.matchMedia("(hover: hover)").matches) return;
    let timer = 0;
    let dir = 1;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (!e.isIntersecting) return;
        ensure().then(() => {
          timer = window.setInterval(() => {
            let next = frame.current + dir;
            if (next >= meta.count || next < 0) {
              dir = -dir;
              next = frame.current + dir;
            }
            draw(next);
          }, 110);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };

  }, [sprite, reduce, interactive]);

  if (!meta) return null;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !interactive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (meta.count - 1));
    if (i === frame.current && sheet.current) return;
    if (sheet.current) draw(i);
    else {
      pending.current = i;
      ensure();
    }
  };

  return (
    <div className={className}>
      <div
        ref={box}
        role="img"
        aria-label={label}
        onPointerEnter={(e) => interactive && !reduce && e.pointerType === "mouse" && ensure()}
        onPointerMove={onMove}
        className={`relative w-full overflow-hidden bg-surface-2 ${interactive ? "cursor-ew-resize" : ""}`}
        style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
      >
        <img
          src={`/scrub/${sprite}-0.webp`}
          alt=""
          width={meta.w}
          height={meta.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover ${live ? "invisible" : ""}`}
        />
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full ${live ? "" : "invisible"}`} />
      </div>
      {rule && (
        <div className="relative mt-3 h-px w-full bg-line" aria-hidden>
          <div ref={bar} className="absolute inset-0 origin-left bg-ink" style={{ transform: `scaleX(${meta.count > 1 ? frame.current / (meta.count - 1) : 1})` }} />
        </div>
      )}
    </div>
  );
}
