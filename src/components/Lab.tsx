import { Component, Suspense, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { LAB } from "../lab";
import { Label, Pill, Rich, reveal } from "./ui";

class Boundary extends Component<{ children: ReactNode; name: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return <p className="p-8 font-mono text-sm text-[#8d8d89]">{this.props.name} could not start here. It runs in its repository.</p>;
    return this.props.children;
  }
}

export function Lab() {
  const [active, setActive] = useState("GanttChart");
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion();
  const item = LAB.find((l) => l.id === active)!;
  const Live = item.Component;

  return (
    <section id="lab" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label>Component lab</Label>
        </div>
        <motion.div {...reveal(reduce)} className="lg:col-span-7">
          <h2 className="font-mono text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-none tracking-[-0.045em] text-ink">
            20 components, running live
          </h2>
          <p className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-muted">
            <Rich text="Single-file React components, each solving one hard UI problem without a library. *These are the real components, not recordings.* Pick one and use it." />
          </p>
        </motion.div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-12">
        <ul className="scrollbar-none flex gap-1.5 overflow-x-auto lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible" aria-label="Components">
          {LAB.map((l) => {
            const on = l.id === active;
            return (
              <li key={l.id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setActive(l.id);
                    setRun((r) => r + 1);
                  }}
                  className={`w-full rounded-full px-4 py-2 text-left font-mono text-[13px] transition lg:rounded-[12px] ${
                    on ? "bg-invert text-invert-ink" : "text-muted hover:bg-surface-2 hover:text-ink max-lg:border max-lg:border-line"
                  }`}
                >
                  {l.title}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-w-0 lg:col-span-8">
          <div className="flex items-start justify-between gap-4">
            <p className="line-clamp-3 max-w-[52ch] text-[14px] leading-relaxed text-muted">{item.blurb}</p>
            <button
              type="button"
              onClick={() => setRun((r) => r + 1)}
              aria-label={`Restart ${item.title}`}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink active:scale-95"
            >
              <ArrowCounterClockwise size={16} />
            </button>
          </div>
          {}
          <div className="mt-5 h-[560px] overflow-auto rounded-[20px] border border-line bg-[#0e0e0f] p-5 text-[#e8e8e4] [transform:translateZ(0)]">
            <Boundary key={`${active}-${run}`} name={item.title}>
              <Suspense fallback={<p className="font-mono text-sm text-[#8d8d89]">Loading {item.title}...</p>}>
                <Live />
              </Suspense>
            </Boundary>
          </div>
          <div className="mt-4 flex justify-end">
            <Pill href="https://github.com/phoenix2610/react-projects" external className="h-9 px-4 text-[13px]">
              Source
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
