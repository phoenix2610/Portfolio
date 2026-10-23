import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { PROJECTS, type Project } from "../data";
import { SCRUB } from "../scrub-meta";
import { Scrub } from "./Scrub";
import { Label, Pill, Rich, SlashList, reveal } from "./ui";

export function Projects() {
  const reduce = useReducedMotion();
  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Label>Projects</Label>
        <motion.h2
          {...reveal(reduce)}
          className="font-mono text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-[-0.045em] text-ink"
        >
          Projects
        </motion.h2>
      </div>
      <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-muted">
        <Rich text="Recorded from the running apps. *Move your cursor across a frame* to play it frame by frame." />
      </p>

      <div className="mt-14">
        {PROJECTS.map((p, i) => (
          <Stage key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function Stage({ project: p, index }: { project: Project; index: number }) {
  const [clip, setClip] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const active = p.clips[clip];
  const meta = active ? SCRUB[active.sprite] : undefined;
  const portrait = meta ? meta.h > meta.w : false;

  return (
    <article
      id={p.id}
      aria-labelledby={`${p.id}-name`}
      className="stage-sticky mb-[10vh] rounded-[28px] border border-line bg-surface p-5 shadow-[var(--stage-shadow)] sm:p-8 lg:p-10"
    >
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, "0")} <span className="opacity-50">/</span> {p.kind}
          </p>
          <h3 id={`${p.id}-name`} className="mt-2 font-mono text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-none tracking-[-0.04em] text-ink">
            {p.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-xs text-muted">{p.year}</span>
          {p.links.map((l) => (
            <Pill key={l.href} href={l.href} external className="h-9 px-4 text-[13px]">
              {l.label}
            </Pill>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          {p.clips.length > 1 && (
            <div className="scrollbar-none mb-4 flex gap-1.5 overflow-x-auto" role="tablist" aria-label={`${p.name} recordings`}>
              {p.clips.map((c, i) => (
                <button
                  key={c.sprite}
                  type="button"
                  role="tab"
                  aria-selected={i === clip}
                  onClick={() => setClip(i)}
                  className={`h-8 shrink-0 rounded-full px-3.5 font-mono text-xs transition ${
                    i === clip ? "bg-invert text-invert-ink" : "border border-line text-muted hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {p.code ? (
            <CodeBlock file={p.code.file} text={p.code.text} />
          ) : playing && p.video ? (
            <video src={p.video.src} poster={p.video.poster} controls autoPlay playsInline className="w-full rounded-[16px] bg-black" />
          ) : active ? (
            <div className={`overflow-hidden rounded-[16px] ${portrait ? "mx-auto max-w-[250px] rounded-[28px] border-[6px] border-surface-2" : ""}`}>
              <Scrub key={active.sprite} sprite={active.sprite} start={active.start} label={`${p.name}: ${active.label}`} />
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] text-muted">
              {p.code ? "Real source from the repository" : playing ? "Full session, with sound" : `${active?.label ?? ""}: move across to play`}
            </p>
            {p.video && !playing && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink underline underline-offset-4"
              >
                <Play size={12} weight="fill" /> Watch with sound
              </button>
            )}
          </div>
        </div>

        <motion.aside {...reveal(reduce, 0.1)} className="flex flex-col lg:col-span-4">
          <p className="text-xl leading-snug text-ink">
            <Rich text={p.line} />
          </p>
          <ol className="mt-8 space-y-4">
            {p.facts.map((f, i) => (
              <li key={f} className="grid grid-cols-[2rem_1fr] text-[14px] leading-relaxed text-muted">
                <span className="font-mono text-xs leading-[1.7rem] text-ink">{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
          <div className="mt-8 border-t border-line pt-5 lg:mt-auto">
            <SlashList items={p.stack} className="text-muted" />
          </div>
        </motion.aside>
      </div>
    </article>
  );
}

const KEYWORDS = new Set([
  "to", "taking", "set", "as", "by", "with", "if", "then", "fail", "field", "from", "greater", "than",
  "times", "save", "into", "return", "is", "null", "plus",
]);

function CodeBlock({ file, text }: { file: string; text: string }) {
  const reduce = useReducedMotion();
  const lines = text.split("\n");
  return (
    <figure className="overflow-hidden rounded-[16px] bg-[#0b0b0b] text-[13px] leading-[1.85] text-[#dcdcd8] sm:text-sm">
      <figcaption className="border-b border-white/10 px-5 py-3 font-mono text-xs text-[#8d8d89]">{file}</figcaption>
      <pre className="overflow-x-auto px-5 py-5 font-mono">
        <code>
          {lines.map((line, i) => (
            <motion.span
              key={i}
              className="block whitespace-pre"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <span className="mr-5 inline-block w-5 select-none text-right text-[#55554f]">{i + 1}</span>
              {(line.match(/"[^"]*"|\w+|\s+|./g) ?? []).map((t, j) =>
                t.startsWith('"') ? (
                  <span key={j} className="text-[#e9c9a0]">{t}</span>
                ) : KEYWORDS.has(t) ? (
                  <span key={j} className="text-white">{t}</span>
                ) : t === "!" ? (
                  <span key={j} className="text-[#55554f]">{t}</span>
                ) : (
                  <span key={j} className="text-[#9c9c96]">{t}</span>
                ),
              )}
            </motion.span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
