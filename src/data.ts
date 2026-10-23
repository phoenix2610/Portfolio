export const PROFILE = {
  first: "Tathya",
  last: "Dubey",
  email: "tathyadubey3628@gmail.com",
  github: "https://github.com/phoenix2610",
  linkedin: "https://www.linkedin.com/in/tathya-dubey-8a626b320/",
};

export const RESUMES = [
  { label: "Software engineering", href: "/resume/Tathya_resume_SDE.pdf" },
  { label: "Frontend & creative web", href: "/resume/Tathya_resume_Frontend.pdf" },
  { label: "AI & LLM systems", href: "/resume/Tathya_resume_AI.pdf" },
];

const gh = (repo: string) => `https://github.com/phoenix2610/${repo}`;

export type Clip = { label: string; sprite: string; start?: number };
export type Link = { label: string; href: string };

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  facts: string[];
  stack: string[];
  clips: Clip[];
  code?: { file: string; text: string };
  video?: { src: string; poster: string };
  links: Link[];
};

export const PROJECTS: Project[] = [
  {
    id: "plandestination",
    name: "PlanDestination",
    kind: "Travel platform",
    year: "2026",
    line: "A full travel booking platform with its *own payment gateway*, PlanPay.",
    facts: [
      "13 verticals, from flights and hotels to visas, forex and gift cards",
      "PlanPay: cards with live brand detection, UPI with QR, net banking, EMI and Pay Later",
      "3-D Secure-style OTP, tokenised saved cards, retries and refunds",
    ],
    stack: ["React 18", "React Router", "Express 5", "scrypt", "HMAC tokens"],
    clips: [
      { label: "Home", sprite: "pd-home" },
      { label: "PlanPay", sprite: "pd-pay" },
      { label: "Flights", sprite: "pd-flights" },
      { label: "Holidays", sprite: "pd-holidays" },
    ],
    links: [{ label: "Source", href: gh("planDestination") }],
  },
  {
    id: "tkh",
    name: "TKH Factory",
    kind: "Manufacturing ERP",
    year: "2026",
    line: "Multi-tenant ERP for Indian factories, built at *THEKULTHOUSE*, told as a 3D scroll story.",
    facts: [
      "10 business modules, sold to each factory one by one",
      "Tenant entitlement (402) and role (403) gates on every page and API route",
      "Row-level security on every table and an append-only audit log",
    ],
    stack: ["Next.js 15", "Supabase", "PostgreSQL RLS", "React Three Fiber", "Zustand", "Zod"],
    clips: [
      { label: "Landing story", sprite: "tkh-home" },
      { label: "Production module", sprite: "tkh-production" },
    ],
    links: [{ label: "Prototype", href: gh("factory-ERP-prototype") }],
  },
  {
    id: "calculator",
    name: "Ultimate Calculator",
    kind: "Web app",
    year: "2026",
    line: "*324 calculators* across 20 disciplines, with live charts and step-by-step working.",
    facts: [
      "Graphing with tracing, roots, extrema and intersections",
      "A chemical equation balancer and parser for all 118 elements",
      "No build step, runs offline through a service worker",
    ],
    stack: ["Vanilla JS", "Chart.js", "Service worker", "Safe expression parser"],
    clips: [
      { label: "Equation balancer", sprite: "calc-balance" },
      { label: "Graphing", sprite: "calc-graph" },
      { label: "Scientific", sprite: "calc-sci" },
      { label: "Home", sprite: "calc-home" },
    ],
    links: [],
  },
  {
    id: "devpulse",
    name: "DevPulse",
    kind: "AI code reviewer",
    year: "2026",
    line: "Submit a repository and watch *LangGraph agents* review it, line by line, live.",
    facts: [
      "PII and secret masking that keeps line numbers intact, before any LLM call",
      "Redis Lua token bucket, tested with 200 concurrent threads",
      "Failover from Anthropic to Gemini to Ollama, then static analysis",
    ],
    stack: ["LangGraph", "FastAPI", "Celery", "pgvector", "Redis", "Next.js", "Monaco", "OpenTelemetry"],
    clips: [
      { label: "Live scan", sprite: "devpulse-scan", start: 0.7 },
      { label: "Findings", sprite: "devpulse-findings" },
    ],
    links: [{ label: "Source", href: gh("DevPulse") }],
  },
  {
    id: "gesture",
    name: "Gesture Band",
    kind: "Computer vision",
    year: "2026",
    line: "Play drums, guitar, piano and violin *in the air*, in front of a webcam.",
    facts: [
      "Five modes: drums, air guitar, piano, violin and singing",
      "Hand landmarks drive synthesized voices in real time",
      "Chords on the left hand, strums on the right",
    ],
    stack: ["Python", "MediaPipe", "NumPy", "SciPy", "sounddevice"],
    clips: [{ label: "Session", sprite: "gesture", start: 0.5 }],
    video: { src: "/media/gesture.mp4", poster: "/media/gesture-poster.webp" },
    links: [],
  },
  {
    id: "pulse",
    name: "Pulse",
    kind: "Monitoring",
    year: "2026",
    line: "Uptime and incident monitoring with *zero npm dependencies*.",
    facts: [
      "HTTP(S), TCP, DNS, TLS, ICMP and cron heartbeat checks",
      "One incident per outage, alerts to 6 channels with retries",
      "Live SSE dashboard with p50/p95/p99 latency",
    ],
    stack: ["Node.js 22", "node:sqlite", "Vanilla JS", "SSE"],
    clips: [{ label: "A real outage", sprite: "pulse-outage" }],
    links: [{ label: "Source", href: gh("Pulse") }],
  },
  {
    id: "epl",
    name: "EPL",
    kind: "Programming language",
    year: "2026",
    line: "A programming language written in *plain English*, so a small local model can write it.",
    facts: [
      "The whole language fits in one spec file of about 4k tokens",
      "Permissions are English lines in a file the program can never write",
      "One C11 binary, no dependencies, about 2-3 MB of RAM",
    ],
    stack: ["C11", "POSIX sockets", "VS Code extension", "GitHub Actions"],
    clips: [],
    code: {
      file: "examples/bakery/shop.EP",
      text: `to sell taking wanted, qty
    set p by find_product with wanted
    if p is null then
        fail with "no product called " plus wanted
    !
    set stock_left as field "stock" from p
    if qty greater than stock_left then
        fail with "only " plus stock_left plus " left"
    !
    set amount as field "price" from p times qty
    save into "sales" with product as wanted, qty as qty, amount as amount
    return amount
!`,
    },
    links: [{ label: "Source", href: gh("EPL") }],
  },
  {
    id: "macbook",
    name: "MacBook Pro landing",
    kind: "3D product page",
    year: "2025",
    line: "An Apple-style product page where *scroll drives the 3D*: orbit, recolour and resize the model.",
    facts: [
      "React Three Fiber viewer with two finishes and two sizes",
      "Pinned, scroll-scrubbed showcase where a mask opens into full-screen video",
      "The model turns a full rotation on scroll while its screen texture changes",
    ],
    stack: ["React 19", "React Three Fiber", "Drei", "GSAP ScrollTrigger", "Tailwind CSS 4", "Zustand"],
    clips: [{ label: "Scroll story", sprite: "apple-scroll" }],
    links: [
      { label: "Live site", href: "https://apple-clone-six-wheat.vercel.app/" },
      { label: "Source", href: gh("react-apple") },
    ],
  },
  {
    id: "unduopoly",
    name: "Unduopoly",
    kind: "Restaurant platform",
    year: "2026",
    line: "Order-ahead pickup and table booking at a *flat fee* instead of a commission.",
    facts: [
      "A storefront per restaurant, linked from its Google Maps listing",
      "QR check-in at the door, food brought out ready",
      "A live kitchen dashboard for the restaurant",
    ],
    stack: ["Next.js", "React", "QR codes"],
    clips: [
      { label: "Storefront", sprite: "unduo-store" },
      { label: "Kitchen", sprite: "unduo-dash" },
    ],
    links: [{ label: "Source", href: gh("Unduopoly") }],
  },
];

export type ArchiveItem = {
  year: string;
  name: string;
  what: string;
  stack: string;
  preview?: string;
  href?: string;
};

export const ARCHIVE: ArchiveItem[] = [
  { year: "2026", name: "epy", what: "Opens a Python file as a mind map of its real code", stack: "Python", preview: "/scrub/epy-demo-0.webp", href: gh("Extended_Programming") },
  { year: "2026", name: "Collapse", what: "Solo Leveling-style life RPG with 3D dungeons", stack: "React 19 & Three.js", preview: "/media/collapse-guilds.webp" },
  { year: "2026", name: "Nova", what: "Offline voice assistant as seven systemd daemons", stack: "Python & Ollama", href: gh("NOVA_AI") },
  { year: "2026", name: "Drawgon", what: "Community whiteboard: publish, vote and remix boards", stack: "React 19 & NestJS", href: "https://drawgon-indol.vercel.app/" },
  { year: "2026", name: "AI/ML journey", what: "44 tested milestones, from a parser to a LangGraph agent", stack: "Python & scikit-learn", href: gh("ai-ml-journey") },
  { year: "2026", name: "NIFTY-50 research", what: "Seasonality studies on 14 years of prices and headlines", stack: "pandas & Flask", preview: "/media/nifty-heatmap.webp" },
  { year: "2026", name: "lunar", what: "HUD-style file manager for Hyprland", stack: "Python & GTK3" },
  { year: "2026", name: "notefeed", what: "Reels-style flashcards, 140 Python cards in 8 levels", stack: "React & Vite" },
  { year: "2026", name: "Activity tracker", what: "Maps every focused window to a project", stack: "Python & Hyprland IPC" },
  { year: "2026", name: "4Mart", what: "Supermarket POS, inventory and reports", stack: "HTML, CSS & JS" },
];

export const SKILLS = [
  { title: "Front-end", items: ["TypeScript", "React 19", "Next.js", "Vite", "Zustand", "Zod", "Tailwind", "Vanilla JS", "Canvas"] },
  { title: "3D & motion", items: ["Three.js", "R3F", "GSAP", "Motion", "WebGL"] },
  { title: "Back-end", items: ["Python", "FastAPI", "Node.js", "Express", "NestJS", "PostgreSQL", "pgvector", "Supabase", "Redis", "Celery"] },
  { title: "AI", items: ["LangGraph", "RAG", "Ollama", "faster-whisper", "MediaPipe", "scikit-learn"] },
  { title: "Systems", items: ["C", "POSIX", "Linux", "systemd", "Docker", "OpenTelemetry", "GitHub Actions"] },
];

export const WORK = [
  { from: "2026 -", span: "5 months", org: "THEKULTHOUSE", role: "Co-founder & tech lead", tech: "Next.js & Supabase" },
  { from: "2025", span: "1 month", org: "HostingSpell", role: "Cybersecurity intern", tech: "OWASP & AppSec" },
];

export const EDUCATION = [
  { from: "- 2027", span: "CGPA 8.71", org: "Indus Institute of Technology and Engineering", role: "B.Tech", tech: "Computer Science", href: "" },
  { from: "2026", span: "AWS Academy", org: "Machine Learning Foundations", role: "Certification", tech: "Credly", href: "https://credly.com/go/V436gx4Q" },
  { from: "2026", span: "AWS Academy", org: "ML for Natural Language Processing", role: "Certification", tech: "Credly", href: "https://credly.com/go/l6gon3el" },
];
