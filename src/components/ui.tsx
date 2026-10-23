import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { RESUMES } from "../data";

export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs font-medium tracking-tight text-ink">... /{children} ...</p>;
}

export function SlashList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`font-mono text-[12.5px] leading-6 ${className}`}>
      {items.map((t, i) => (
        <Fragment key={t}>
          {i > 0 && <span className="opacity-50"> / </span>}
          <span className="whitespace-nowrap">{t}</span>
        </Fragment>
      ))}
    </p>
  );
}

type PillProps = { href: string; children: ReactNode; solid?: boolean; external?: boolean; icon?: ReactNode; className?: string };

export function Pill({ href, children, solid, external, icon, className = "" }: PillProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm transition active:scale-[0.98] ${
        solid
          ? "bg-invert font-normal text-invert-ink hover:opacity-90"
          : "border border-line text-ink hover:border-ink"
      } ${className}`}
    >
      {icon}
      <span className="italic">{children}</span>
      {external && <ArrowUpRight size={13} className="opacity-70" />}
    </a>
  );
}

export function CircleArrow({ href, label, onClick }: { href?: string; label: string; onClick?: () => void }) {
  const cls =
    "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-invert text-invert-ink transition hover:scale-105 active:scale-95";
  return href ? (
    <a href={href} aria-label={label} className={cls}>
      <ArrowRight size={16} />
    </a>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      <ArrowRight size={16} />
    </button>
  );
}

export function Circle({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none absolute rounded-full border border-line ${className}`} />;
}

export function ResumeMenu({ up = false, align = "right" }: { up?: boolean; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm italic text-ink transition hover:border-ink active:scale-[0.98]"
      >
        Resume
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={reduce ? false : { opacity: 0, y: up ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: up ? 6 : -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute z-50 w-64 rounded-[20px] border border-line bg-surface p-1.5 shadow-2xl ${
              align === "right" ? "right-0" : "left-0"
            } ${up ? "bottom-full mb-2" : "top-full mt-2"}`}
          >
            {RESUMES.map((r) => (
              <li key={r.href} role="none">
                <a
                  role="menuitem"
                  href={r.href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-[14px] px-3.5 py-2.5 text-sm text-ink transition hover:bg-invert hover:text-invert-ink"
                >
                  {r.label}
                  <span className="font-mono text-[11px] opacity-60">PDF</span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export const reveal = (reduce: boolean | null, delay = 0) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
      };
