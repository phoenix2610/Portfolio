import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const [scriptPath, outDir] = process.argv.slice(2);
const script = JSON.parse(readFileSync(scriptPath, "utf8"));
const W = script.w ?? 1440, H = script.h ?? 900;
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn("google-chrome-stable", [
  "--headless=new", "--hide-scrollbars", "--mute-audio", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/claude-1000/rec-${port}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 60; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const pg = list.find((t) => t.type === "page");
    if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; }
  } catch {}
  await sleep(200);
}
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.error ? { error: m.error } : m.result); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: script.dpr ?? 1, mobile: !!script.mobile });
if (script.dark !== undefined)
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: script.dark ? "dark" : "light" }] });
await send("Page.enable");

let clip = "default", n = 0, mouse = [W / 2, H / 2];
mkdirSync(`${outDir}/stills`, { recursive: true });
const grab = async () => {
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
  mkdirSync(`${outDir}/${clip}`, { recursive: true });
  writeFileSync(`${outDir}/${clip}/f${String(++n).padStart(4, "0")}.jpg`, Buffer.from(data, "base64"));
};
const moveTo = (x, y) => { mouse = [x, y]; return send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }); };
const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return r?.result?.value;
};

for (const s of script.steps) {
  if (s.go) { await send("Page.navigate", { url: s.go }); await sleep(s.settle ?? 2500); }
  if (s.wait) await sleep(s.wait);
  if (s.eval) { const v = await evalJs(s.eval); if (s.log) console.log(s.log, JSON.stringify(v)); await sleep(s.after ?? 300); }
  if (s.clip) { clip = s.clip; n = 0; }
  if (s.shot) { const { data } = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${outDir}/stills/${s.shot}.png`, Buffer.from(data, "base64")); console.log("still", s.shot); }
  if (s.move) await moveTo(...s.move);
  if (s.clickText) {
    for (const label of [].concat(s.clickText)) {
      const r = await evalJs(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(s.tag ?? "button")})].find(b => b.innerText.trim().split('\\n')[0] === ${JSON.stringify(label)} && b.offsetParent); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width/2, b.y + b.height/2]; })()`);
      if (!r) { console.log("missing text", label); continue; }
      await moveTo(...r); await sleep(s.hover ?? 60);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: r[0], y: r[1], button: "left", clickCount: 1 });
      if (s.capture) await grab();
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: r[0], y: r[1], button: "left", clickCount: 1 });
      await sleep(s.after ?? 160);
      if (s.capture) await grab();
    }
  }
  if (s.click || s.clickSel) {
    let [x, y] = s.click ?? [0, 0];
    if (s.clickSel) {
      const r = await evalJs(`(() => { const e = document.querySelector(${JSON.stringify(s.clickSel)}); if (!e) return null; e.scrollIntoView({block:'center'}); const b = e.getBoundingClientRect(); return [b.x + b.width/2, b.y + b.height/2]; })()`);
      if (!r) { console.log("missing", s.clickSel); continue; }
      [x, y] = r; await sleep(200);
    }
    await moveTo(x, y);
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
    await sleep(s.after ?? 600);
  }
  if (s.type) { for (const ch of s.type) { await send("Input.insertText", { text: ch }); await sleep(s.charDelay ?? 40); if (s.capture) await grab(); } await sleep(s.after ?? 400); }
  if (s.key) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: s.key, code: s.key, windowsVirtualKeyCode: s.vk ?? 13 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: s.key, code: s.key, windowsVirtualKeyCode: s.vk ?? 13 });
    await sleep(s.after ?? 600);
  }
  if (s.hoverSel) {
    const r = await evalJs(`(() => { const e = document.querySelector(${JSON.stringify(s.hoverSel)}); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; })()`);
    if (r) {
      const y = r[1] + r[3] * (s.yFrac ?? 0.5);
      s.hoverPath = [[r[0] + r[2] * 0.04, y], [r[0] + r[2] * 0.96, y + (s.dy ?? 0)]];
    } else console.log("missing", s.hoverSel);
  }
  if (s.hoverPath) {
    const pts = s.hoverPath, frames = s.frames ?? 24;
    for (let f = 0; f < frames; f++) {
      const t = frames === 1 ? 0 : f / (frames - 1);
      const seg = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
      const lt = t * (pts.length - 1) - seg;
      const x = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * lt;
      const y = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * lt;
      await moveTo(x, y);
      await sleep(s.delay ?? 90);
      await grab();
    }
  }
  if (s.scroll !== undefined && s.scroll !== 0) {
    const frames = s.frames ?? 24, step = s.scroll / frames;
    for (let f = 0; f < frames; f++) {
      if (s.wheel) await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: mouse[0], y: mouse[1], deltaX: 0, deltaY: step });
      else await evalJs(s.sel ? `document.querySelector(${JSON.stringify(s.sel)}).scrollBy(0, ${step})` : `scrollBy(0, ${step})`);
      await sleep(s.delay ?? 90);
      await grab();
    }
  }
  if (s.frames && !s.hoverPath && s.scroll === undefined) {
    for (let f = 0; f < s.frames; f++) { await sleep(s.delay ?? 80); await grab(); }
  }
}
ws.close(); chrome.kill();
console.log("done", outDir);
