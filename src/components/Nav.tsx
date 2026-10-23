import { useState } from "react";
import { PROFILE } from "../data";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#lab", label: "Lab" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contacts" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-bg/95">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <a href="#top" className="text-[15px] leading-tight text-ink">
          {PROFILE.first}
          <br />
          {PROFILE.last}
        </a>
        <ul className="hidden items-center gap-9 text-[13px] text-ink md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="opacity-80 transition hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeSwitch />
      </nav>
    </header>
  );
}

function ThemeSwitch() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "dark");
  const pick = (t: "dark" | "light") => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {
    }
    setTheme(t);
  };
  return (
    <div className="flex flex-col items-end text-[13px] leading-tight" role="group" aria-label="Colour theme">
      {(["dark", "light"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => pick(t)}
          aria-pressed={theme === t}
          className={`capitalize transition ${theme === t ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
