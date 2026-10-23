type Job = { id: number; url: string; w: number; h: number; cols: number; rows: number; count: number };

self.onmessage = async (e: MessageEvent<Job>) => {
  const { id, url, w, h, cols, rows, count } = e.data;
  try {
    const blob = await (await fetch(url)).blob();
    const big = await createImageBitmap(blob, { resizeWidth: w * cols, resizeHeight: h * rows, resizeQuality: "high" });
    const frames = await Promise.all(
      Array.from({ length: count }, (_, i) => createImageBitmap(big, (i % cols) * w, Math.floor(i / cols) * h, w, h)),
    );
    big.close();
    (self as unknown as Worker).postMessage({ id, frames }, frames);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String(err) });
  }
};
