import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { ARCHIVE, EDUCATION, PROFILE, WORK } from "../data";
import { Circle, Label, Pill, ResumeMenu, Rich, reveal } from "./ui";

const rowLi = "border-t border-line transition-colors duration-200 hover:bg-invert hover:text-invert-ink";
const rowBase = "mx-auto grid max-w-7xl items-center gap-x-6 gap-y-1 px-5 py-4 sm:px-8";

export function Archive() {
  const reduce = useReducedMotion();
  const [preview, setPreview] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  return (
    <section
      id="index"
      className="relative py-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left + 24);
        y.set(e.clientY - r.top - 90);
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Label>Index</Label>
        <motion.h2 {...reveal(reduce)} className="mt-6 font-mono text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-none tracking-[-0.045em] text-ink">
          Everything else
        </motion.h2>
      </div>

      <ul className="mt-12 border-b border-line">
        {ARCHIVE.map((a) => {
          const body = (
            <>
              <span className="font-mono text-xs opacity-70">{a.year}</span>
              <span className="text-[15px] font-normal">{a.name}</span>
              <span className="font-mono text-[13px] opacity-80 max-md:col-span-2">{a.what}</span>
              <span className="hidden font-mono text-xs opacity-60 lg:block">{a.stack}</span>
              <span className="hidden justify-self-end md:block">{a.href && <ArrowUpRight size={16} />}</span>
            </>
          );
          const cls = `${rowBase} grid-cols-[3.5rem_1fr] md:grid-cols-[4rem_12rem_1fr_auto] lg:grid-cols-[4rem_13rem_1fr_12rem_1.5rem]`;
          return (
            <li
              key={a.name}
              className={rowLi}
              onPointerEnter={(e) => e.pointerType === "mouse" && a.preview && setPreview(a.preview)}
              onPointerLeave={() => setPreview(null)}
            >
              {a.href ? (
                <a href={a.href} target="_blank" rel="noopener" className={cls}>
                  {body}
                </a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {preview && !reduce && (
          <motion.img
            key={preview}
            src={preview}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-30 h-44 w-72 rounded-[16px] object-cover object-top shadow-2xl"
          />
        )}
      </AnimatePresence>
    </section>
  );
}

type Row = { from: string; span: string; org: string; role: string; tech: string; href?: string };

function Table({ rows }: { rows: Row[] }) {
  return (
    <ul className="border-b border-line">
      {rows.map((r) => {
        const body = (
          <>
            <span>
              <span className="block text-[15px]">{r.from}</span>
              <span className="block text-xs opacity-60">{r.span}</span>
            </span>
            <span className="text-[15px]">{r.org}</span>
            <span className="font-mono text-[13px] max-md:col-span-2">
              {r.role} <span className="mx-2 opacity-60">|</span> {r.tech}
            </span>
          </>
        );
        const cls = `${rowBase} grid-cols-[8rem_1fr] md:grid-cols-[10rem_1fr_1.2fr]`;
        return (
          <li key={r.org} className={rowLi}>
            {r.href ? (
              <a href={r.href} target="_blank" rel="noopener" className={cls}>
                {body}
              </a>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Work() {
  const reduce = useReducedMotion();
  return (
    <section id="work" className="py-24">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 sm:px-8">
        <Label>Experience</Label>
        <motion.h2 {...reveal(reduce)} className="font-mono text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-[-0.045em] text-ink">
          Work
        </motion.h2>
      </div>
      <div className="mt-10">
        <Table rows={WORK} />
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-5 text-right text-[15px] text-muted sm:px-8">
        Working since
        <br />
        <em>November 2025</em>
      </p>

      <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <Label>Education</Label>
      </div>
      <div className="mt-8">
        <Table rows={EDUCATION} />
      </div>
    </section>
  );
}

export function Contact() {
  const reduce = useReducedMotion();
  return (
    <footer id="contact" className="relative overflow-hidden pb-10 pt-28">
      <Circle className="-left-48 top-10 size-[520px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Label>Contacts</Label>
        <motion.h2 {...reveal(reduce)} className="mt-8 font-mono text-[clamp(2.6rem,8.4vw,7.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-ink">
          Let's build
          <br />
          <span className="block text-right">something.</span>
        </motion.h2>
        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-[26rem] text-[15px] leading-relaxed text-muted">
              <Rich text="Open to *internships* and *new-grad roles* in frontend, backend or AI engineering." />
            </p>
            <a
              href={`mailto:${PROFILE.email}`}
              className="mt-5 inline-block font-mono text-[clamp(1rem,2.4vw,1.6rem)] text-ink underline decoration-line decoration-1 underline-offset-8 transition hover:decoration-ink"
            >
              {PROFILE.email}
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <Pill href={PROFILE.github} external icon={<GithubLogo size={16} />}>Github</Pill>
            <Pill href={PROFILE.linkedin} external icon={<LinkedinLogo size={16} />}>Linkedin</Pill>
            <Pill href={`mailto:${PROFILE.email}`} icon={<EnvelopeSimple size={16} />}>Email</Pill>
            <ResumeMenu up />
          </div>
        </div>
        <p className="mt-24 border-t border-line pt-6 font-mono text-xs text-muted">© 2026 Tathya Dubey</p>
      </div>
    </footer>
  );
}
