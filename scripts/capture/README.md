# Capture tooling

How the scrub recordings in `public/scrub` were made.

1. Start the app you want to record (its dev server).
2. Record a session: `node rec.mjs sessions/<name>.json <outDir>`. It drives a headless Chrome over CDP
   (cursor paths, scrolling, clicks, typing) and saves one JPEG per step into `<outDir>/<clip>/`.
3. Build a sprite: `./sprite.sh <outDir>/<clip> <sprite-name> <frames> 960 600 [crop w:h:x:y]`.
   A video file works as the source too.
4. Run `python3 ../scrub-meta.py` so the site knows the new sprite's grid.

The PlanDestination sessions log in as its demo traveller and create a gift-card booking to reach PlanPay.
Back up `server/data/db.json` first and restore it afterwards.
