import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { PROFILE, PROJECTS } from "../data";
import { Scrub } from "./Scrub";
import { Circle, CircleArrow, Pill, ResumeMenu, Rich } from "./ui";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, className }: { children: string; delay: number; className: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-32 sm:pt-36">
      <Circle className="-right-48 -top-56 size-[620px] sm:-right-24" />
      <h1 className="sr-only">Tathya Dubey, full-stack developer</h1>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8" aria-hidden>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Line delay={0.05} className="font-mono text-[clamp(3rem,9.6vw,8.6rem)] font-medium leading-[0.95] tracking-[-0.045em] text-ink">
            Full-stack
          </Line>
          <motion.div {...fade(0.5)} className="hidden items-center gap-2 lg:flex">
            <Pill href="#projects" solid className="w-56 justify-center">
              Projects
            </Pill>
            <CircleArrow href="#projects" label="Go to projects" />
          </motion.div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-8 lg:mt-2 lg:flex-row lg:items-end lg:justify-between">
          <motion.p {...fade(0.4)} className="max-w-[22rem] text-[15px] leading-relaxed text-muted lg:mb-5">
            <Rich text="I build *real-time interfaces* and the *systems underneath them*, and I want both to feel good to use." />
          </motion.p>
          <Line delay={0.15} className="self-end text-right font-mono text-[clamp(3rem,9.6vw,8.6rem)] font-medium leading-[0.95] tracking-[-0.045em] text-ink">
            Developer
          </Line>
        </div>
      </div>

      <motion.div {...fade(0.6)} className="relative mx-auto mt-14 flex max-w-7xl flex-wrap justify-center gap-3 px-5 sm:px-8">
        <Pill href={PROFILE.github} external icon={<GithubLogo size={16} />}>Github</Pill>
        <Pill href={PROFILE.linkedin} external icon={<LinkedinLogo size={16} />}>Linkedin</Pill>
        <Pill href={`mailto:${PROFILE.email}`} icon={<EnvelopeSimple size={16} />}>Email</Pill>
        <ResumeMenu align="left" />
        <div className="lg:hidden">
          <Pill href="#projects" solid>Projects</Pill>
        </div>
      </motion.div>

      <motion.div {...fade(0.75)}>
        <Carousel />
      </motion.div>
    </section>
  );
}

const CARD_W = "min(760px, 88vw)";

function Carousel() {
  const items = PROJECTS.filter((p) => p.clips.length > 0);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const n = items.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);
  const offsetOf = (k: number) => ((k - index + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);

  return (
    <div
      className="relative mt-14 h-[470px] overflow-hidden sm:h-[268px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {items.map((p, k) => {
        const o = offsetOf(k);
        const active = o === 0;
        return (
          <motion.article
            key={p.id}
            aria-hidden={!active}
            initial={false}
            animate={{ x: `${o * 104}%`, opacity: active ? 1 : Math.abs(o) === 1 ? 0.3 : 0, scale: active ? 1 : 0.94 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease }}
            className={`absolute left-1/2 top-0 grid overflow-hidden rounded-[20px] border border-line bg-surface sm:grid-cols-[1.1fr_1fr] ${
              active ? "" : "pointer-events-none"
            }`}
            style={{ width: CARD_W, marginLeft: `calc(${CARD_W} / -2)` }}
          >
            <Scrub sprite={p.clips[0].sprite} start={p.clips[0].start} interactive={active} label={`${p.name}: ${p.clips[0].label}`} rule={false} className="self-center" />
            <div className="flex flex-col p-6">
              <h3 className="font-mono text-[17px] font-medium leading-snug text-ink">{p.name}</h3>
              <p className="mt-1 font-mono text-xs text-muted">{p.kind}</p>
              <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted">
                <Rich text={p.line} />
              </p>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <Pill href={`#${p.id}`} solid className="h-9 px-6 text-[13px]">
                  Open project
                </Pill>
                <CircleArrow href={`#${p.id}`} label={`Open ${p.name}`} />
              </div>
            </div>
          </motion.article>
        );
      })}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous project"
        className="absolute left-3 top-[40%] inline-flex size-12 items-center justify-center rounded-full border border-line bg-bg/60 text-ink backdrop-blur transition hover:border-ink active:scale-95 sm:left-[6%] sm:top-1/2 sm:-translate-y-1/2"
      >
        <ArrowLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next project"
        className="absolute right-3 top-[40%] inline-flex size-12 items-center justify-center rounded-full border border-line bg-bg/60 text-ink backdrop-blur transition hover:border-ink active:scale-95 sm:right-[6%] sm:top-1/2 sm:-translate-y-1/2"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
