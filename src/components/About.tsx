import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { PROFILE, SKILLS } from "../data";
import { Circle, Label, Rich, SlashList, reveal } from "./ui";

function SkillBox({ title, items, inverted = false, className = "" }: { title: string; items: string[]; inverted?: boolean; className?: string }) {
  return (
    <div
      className={`rounded-[20px] px-5 py-4 ${
        inverted ? "bg-invert text-invert-ink" : "border border-line text-ink"
      } ${className}`}
    >
      <h3 className="text-[15px] font-normal">{title}</h3>
      <SlashList items={items} className="mt-2 opacity-90" />
    </div>
  );
}

export function About() {
  const reduce = useReducedMotion();
  const [front, three, back, ai, systems] = SKILLS;

  return (
    <section id="about" className="relative overflow-hidden py-20 lg:py-28">
      <Circle className="-right-40 top-24 size-[560px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label>About me</Label>
          </div>
          <motion.p {...reveal(reduce)} className="max-w-[34rem] text-lg leading-relaxed text-muted lg:col-span-7">
            <Rich text="Hello! I'm Tathya, a *full-stack developer* studying computer science (CGPA 8.71). I like owning the *whole product*: the schema, the queue, the agent and the pixels." />
          </motion.p>
        </div>

        <div className="mt-20 grid items-start gap-14 lg:grid-cols-12">
          <motion.div {...reveal(reduce)} className="grid gap-4 lg:col-span-6">
            <SkillBox {...front} inverted />
            <div className="grid grid-cols-[1fr_auto] items-center gap-6 sm:grid-cols-[minmax(0,22rem)_auto]">
              <SkillBox {...three} />
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener"
                aria-label="GitHub profile"
                className="group relative mr-4 inline-flex size-12 items-center justify-center rounded-full bg-invert text-invert-ink transition hover:scale-105"
              >
                <span className="absolute -left-5 inline-flex size-12 items-center justify-center rounded-full border border-line" aria-hidden />
                <ArrowUpRight size={18} />
              </a>
            </div>
            <SkillBox {...back} />
            <div className="grid items-end gap-4 sm:grid-cols-[1fr_minmax(0,21rem)]">
              <p className="text-xs leading-relaxed text-muted">
                <Rich text="Some of my *favourite tools*, all used in the projects below" />
              </p>
              <SkillBox {...ai} />
            </div>
            <SkillBox {...systems} />
          </motion.div>

          <motion.div {...reveal(reduce, 0.1)} className="lg:col-span-5 lg:col-start-8">
            <SelfPortrait />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SelfPortrait() {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = sound;
    if (!sound) v.play().catch(() => {});
    setSound(!sound);
  };

  return (
    <figure>
      <div className="group relative overflow-hidden rounded-[24px]">
        <video
          ref={video}
          src="/media/gesture.mp4"
          poster="/media/gesture-poster.webp"
          muted
          loop
          playsInline
          preload="none"
          controls={!!reduce}
          aria-label="Tathya playing drums, air guitar, piano and violin with hand tracking"
          className={`aspect-[4/5] w-full object-cover transition duration-700 ${sound ? "" : "grayscale group-hover:grayscale-0"}`}
          style={{ objectPosition: "42% 50%" }}
        />
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="absolute bottom-4 left-4 inline-flex h-10 items-center gap-2 rounded-full bg-invert px-4 text-sm italic text-invert-ink transition active:scale-[0.98]"
        >
          {sound ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
          {sound ? "Sound on" : "Play with sound"}
        </button>
      </div>
      <figcaption className="mt-4 text-[13px] leading-relaxed text-muted">
        <Rich text="That's me, playing *air guitar*. The hand tracking and the instruments are the Gesture Band project." />
      </figcaption>
    </figure>
  );
}
