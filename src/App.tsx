import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Lab } from "./components/Lab";
import { Archive, Contact, Work } from "./components/Tables";

export default function App() {
  return (
    <>
      <a
        href="#projects"
        className="sr-only z-[60] rounded-full bg-invert px-4 py-2 text-invert-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to projects
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Lab />
        <Archive />
        <Work />
      </main>
      <Contact />
    </>
  );
}
