export type SpriteMeta = { count: number; cols: number; rows: number; w: number; h: number };

export const SCRUB: Record<string, SpriteMeta> = {
  "apple-scroll": { count: 48, cols: 8, rows: 6, w: 960, h: 600 },
  "calc-balance": { count: 40, cols: 8, rows: 5, w: 960, h: 600 },
  "calc-graph": { count: 36, cols: 8, rows: 5, w: 960, h: 600 },
  "calc-home": { count: 32, cols: 8, rows: 4, w: 960, h: 600 },
  "calc-sci": { count: 29, cols: 8, rows: 4, w: 960, h: 600 },
  "devpulse-findings": { count: 32, cols: 8, rows: 4, w: 960, h: 600 },
  "devpulse-scan": { count: 40, cols: 8, rows: 5, w: 960, h: 600 },
  "gesture": { count: 40, cols: 8, rows: 5, w: 960, h: 540 },
  "pd-flights": { count: 32, cols: 8, rows: 4, w: 960, h: 600 },
  "pd-holidays": { count: 30, cols: 8, rows: 4, w: 960, h: 600 },
  "pd-home": { count: 40, cols: 8, rows: 5, w: 960, h: 600 },
  "pd-pay": { count: 40, cols: 8, rows: 5, w: 960, h: 600 },
  "pulse-outage": { count: 36, cols: 8, rows: 5, w: 960, h: 600 },
  "tkh-home": { count: 40, cols: 8, rows: 5, w: 960, h: 600 },
  "tkh-production": { count: 30, cols: 8, rows: 4, w: 960, h: 600 },
  "unduo-dash": { count: 20, cols: 8, rows: 3, w: 960, h: 600 },
  "unduo-store": { count: 34, cols: 12, rows: 3, w: 390, h: 844 },
};
