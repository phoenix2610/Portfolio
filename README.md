# Portfolio

Personal portfolio of Tathya Dubey, full-stack developer.

Projects are shown as recordings of the real apps running. Each recording is a sprite sheet of frames, and moving the cursor across it plays it frame by frame. The component lab runs 20 React components live on the page.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck and build into dist/
```

## Structure

- `src/data.ts`: all page content
- `src/components/`: sections (hero, about, project stages, lab, index, work, contact)
- `src/components/Scrub.tsx`: the frame-by-frame scrubber
- `src/lab/`: the live components
- `public/scrub/`: recordings as sprite sheets, described by `src/scrub-meta.ts`
- `scripts/capture/`: how the recordings were made

Built with React 19, TypeScript, Tailwind CSS 4 and Motion.
