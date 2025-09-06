"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

// Tiny seeded PRNG for deterministic decorative QR
function xorshift32(seed: number) {
  let x = seed || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function RealisticQR({ seed = 42, size = 25, quietZone = 2 }: { seed?: number; size?: number; quietZone?: number }) {
  // build matrix with finder and timing patterns
  const n = size;
  const rand = xorshift32(seed);
  const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  const drawFinder = (r: number, c: number) => {
    const drawSquare = (s: number, color: 0 | 1) => {
      for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) m[r + i][c + j] = color;
    };
    drawSquare(7, 1);
    for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) m[r + i][c + j] = 0;
    for (let i = 2; i < 5; i++) for (let j = 2; j < 5; j++) m[r + i][c + j] = 1;
  };
  // three finders
  drawFinder(0, 0);
  drawFinder(0, n - 7);
  drawFinder(n - 7, 0);

  // timing patterns
  for (let i = 8; i < n - 8; i++) m[6][i] = i % 2 === 0 ? 1 : 0;
  for (let i = 8; i < n - 8; i++) m[i][6] = i % 2 === 0 ? 1 : 0;

  // alignment-ish pattern near bottom-right
  const ar = n - 9, ac = n - 9;
  for (let i = -1; i <= 3; i++) for (let j = -1; j <= 3; j++) {
    const rr = ar + i, cc = ac + j;
    if (rr >= 0 && cc >= 0 && rr < n && cc < n) m[rr][cc] = (Math.abs(i) === 2 || Math.abs(j) === 2) ? 1 : 0;
  }
  m[ar][ac] = 1; // center dot

  // fill data area with deterministic bits, skipping reserved areas
  const isReserved = (r: number, c: number) => (
    (r < 7 && c < 7) ||
    (r < 7 && c >= n - 7) ||
    (r >= n - 7 && c < 7) ||
    r === 6 || c === 6 ||
    (r >= ar - 2 && r <= ar + 2 && c >= ac - 2 && c <= ac + 2)
  );
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isReserved(r, c)) continue;
      m[r][c] = rand() > 0.52 ? 1 : 0;
    }
  }

  const view = n + quietZone * 2;
  const cells: ReactElement[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (m[r][c]) cells.push(<rect key={`${r}-${c}`} x={c + quietZone} y={r + quietZone} width={1} height={1} fill="#000" />);
    }
  }
  return (
    <svg width={74} height={74} viewBox={`0 0 ${view} ${view}`} shapeRendering="crispEdges">
      <rect width={view} height={view} fill="#fff" />
      {cells}
    </svg>
  );
}

function FakeBarcode({ width = 160, height = 28, label = "CB24HMN • USA" }: { width?: number; height?: number; label?: string }) {
  // alternating bar widths reminiscent of Code 128
  const bars = [2,1,2,2,1,3,1,1,3,1,2,1,2,3,1,2,1,1,3,2,1,2,2,1,3,1,2,1,2,2,3,1];
  const totalUnits = bars.reduce((a, b) => a + b, 0);
  const unit = width / totalUnits;
  let x = 0;
  const rects: ReactElement[] = [];
  for (let i = 0; i < bars.length; i += 2) {
    const w = bars[i] * unit;
    rects.push(<rect key={i} x={x} y={0} width={w} height={height} fill="#000" />);
    x += (bars[i] + (bars[i + 1] ?? 1)) * unit; // include following gap
  }
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} fill="#fff" />
        {rects}
      </svg>
      {/* full-width highlight to match barcode width for proper left coverage */}
      <div
        className="mt-1 rounded-md bg-slate-100/95 ring-1 ring-slate-300/60 shadow-sm text-left"
        style={{ width }}
      >
        <span className="inline-block pl-4 pr-2 py-0.5 text-[10px] tracking-widest text-slate-700 whitespace-nowrap">{label}</span>
      </div>
    </div>
  );
}

type HVItem = {
  title: string;
  subtitle?: string;
  href?: string;
  icon: "run" | "book" | "football" | "frisbee" | "library" | "podcast";
};

const items: HVItem[] = [
  { title: "Running", subtitle: "5K 17:05 • 10K 42:30 • Half Marathon: ??", icon: "run" },
  { title: "Reading", subtitle: "Always", icon: "book" },
  { title: "Football", subtitle: "Detroit Lions • Michigan", icon: "football" },
  { title: "Ultimate Frisbee", subtitle: "Cutter / Handler", icon: "frisbee" },
  { title: "Book Recommendations", subtitle: "See Library", href: "#library", icon: "library" },
  { title: "Podcasts", subtitle: "See Podcast Shelf", href: "#podcasts", icon: "podcast" },
];

function Icon({ name }: { name: HVItem["icon"] }) {
  const common = "h-5 w-5";
  switch (name) {
    case "run":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M13 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
          <path d="M8 17l2-5 3-1 3 3 3 1" />
          <path d="M6 12l4 2" />
          <path d="M5 22l4-6 3 2 2 4" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4v15.5A2.5 2.5 0 0 1 6.5 17H20V4Z" />
        </svg>
      );
    case "football":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 3s5 2 5 9-5 9-5 9-5-2-5-9 5-9 5-9Z" />
          <path d="M11 12h10" />
        </svg>
      );
    case "frisbee":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <ellipse cx="12" cy="12" rx="9" ry="4" />
          <path d="M3 12c0 2.2 4 4 9 4s9-1.8 9-4" />
        </svg>
      );
    case "library":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 19V5a2 2 0 0 1 2-2h3v18H6a2 2 0 0 1-2-2Z" />
          <path d="M9 3h6v18H9" />
          <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
        </svg>
      );
    case "podcast":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="11" r="2" />
          <path d="M5 12a7 7 0 1 1 14 0" />
          <path d="M8 21v-2a4 4 0 1 1 8 0v2" />
        </svg>
      );
  }
}

export default function HumanVerification() {
  // live timestamp for fun “last active” line
  const [now, setNow] = useState<string>(""); // Start empty for SSR
  useEffect(() => {
    setNow(new Date().toLocaleString()); // Set on client only
    const id = setInterval(() => setNow(new Date().toLocaleString()), 5000);
    return () => clearInterval(id);
  }, []);

  // tilt/glare state
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const ry = (px - 0.5) * 10; // rotateY
    const rx = (0.5 - py) * 10; // rotateX
    setTilt({ rx, ry, gx: px * 100, gy: py * 100 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // sequential highlight across hobbies: traverse the grid perimeter as a whole
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth;
      // Tailwind default breakpoints: sm >= 640px, lg >= 1024px
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    };
    const apply = () => setCols(computeCols());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const perimeterOrder = useMemo(() => {
    const n = items.length;
    const c = Math.max(1, cols);
    const r = Math.max(1, Math.ceil(n / c));
    // build grid with -1 as empty
    const grid: number[][] = Array.from({ length: r }, () => Array(c).fill(-1));
    for (let i = 0; i < n; i++) {
      const rr = Math.floor(i / c);
      const cc = i % c;
      grid[rr][cc] = i;
    }
    const order: number[] = [];
    // top row: left -> right
    for (let cc = 0; cc < c; cc++) {
      const v = grid[0][cc];
      if (v !== -1) order.push(v);
    }
    // right col: top+1 -> bottom
    for (let rr = 1; rr < r; rr++) {
      const v = grid[rr][c - 1];
      if (v !== -1) order.push(v);
    }
    // bottom row: right-1 -> left (only if more than 1 row)
    if (r > 1) {
      for (let cc = c - 2; cc >= 0; cc--) {
        const v = grid[r - 1][cc];
        if (v !== -1) order.push(v);
      }
    }
    // left col: bottom-1 -> top+1 (only if more than 1 col)
    if (c > 1) {
      for (let rr = r - 2; rr >= 1; rr--) {
        const v = grid[rr][0];
        if (v !== -1) order.push(v);
      }
    }
    // if for some reason order is empty (shouldn't), fallback to sequential
    return order.length ? order : Array.from({ length: n }, (_, i) => i);
  }, [cols]);

  const [orderPos, setOrderPos] = useState(0);
  useEffect(() => {
    // reset position when layout changes
    setOrderPos(0);
  }, [cols]);
  useEffect(() => {
    if (perimeterOrder.length === 0) return;
    const SCAN_DURATION_MS = 3000; // match .moving-border rotateScan duration
    const id = setInterval(() => {
      setOrderPos((p) => (p + 1) % perimeterOrder.length);
    }, SCAN_DURATION_MS);
    return () => clearInterval(id);
  }, [perimeterOrder]);
  const activeIdx = perimeterOrder[orderPos] ?? 0;
  // (Optional quarter-mode helpers can be reintroduced when enabled)

  return (
    <section id="human" className="relative mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">Human Verification</h2>

      {/* ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
          className="group relative mx-auto w-full sm:w-[560px] rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden moving-border"
        >
          {/* glare layer */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              background: `radial-gradient(400px 200px at ${tilt.gx}% ${tilt.gy}%, rgba(56,189,248,0.18), transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />

          {/* hologram ribbon */}
          <div className="absolute -right-10 -top-10 h-40 w-56 rotate-12 rounded-xl holo-ribbon" />

          {/* microtext band (passport vibe) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 text-[8px] tracking-[0.35em] text-slate-300/25 text-center uppercase select-none">
            UNITED STATES OF AMERICA • UNITED STATES OF AMERICA • UNITED STATES OF AMERICA • UNITED STATES OF AMERICA
          </div>

          <div className="relative p-5 md:p-6">
            <div className="flex items-start gap-5">
              {/* avatar: SVG headshot */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 via-sky-400/10 to-emerald-400/20 text-white ring-1 ring-sky-400/30">
                <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
                  <circle cx="32" cy="22" r="10" fill="currentColor" />
                  <path d="M12 54c0-11 10-18 20-18s20 7 20 18v2H12v-2Z" fill="currentColor" />
                </svg>
              </div>

              {/* details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-lg font-semibold tracking-tight">Chirag Bangera</p>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-mono text-emerald-300 ring-1 ring-emerald-400/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Human Verified
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">Species: Homo sapiens • Citizen: United States • Locale: Earth (UTC±)</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300/90 md:max-w-md">
                  <div className="rounded bg-slate-800/40 px-2 py-1 ring-1 ring-slate-700/60">ID: CB-24-HMN</div>
                  <div className="rounded bg-slate-800/40 px-2 py-1 ring-1 ring-slate-700/60">Last Active: {now}</div>
                </div>
              </div>

              {/* QR / barcode */
              /* ghost head watermark */}
              <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 opacity-[0.06] md:block">
                <svg viewBox="0 0 64 64" width="140" height="140" aria-hidden>
                  <circle cx="32" cy="22" r="10" fill="#ffffff" />
                  <path d="M12 54c0-11 10-18 20-18s20 7 20 18v2H12v-2Z" fill="#ffffff" />
                </svg>
              </div>
              {/* QR / barcode */}
              <div className="hidden sm:flex flex-col items-center gap-2">
                <div className="rounded-md bg-white p-1 shadow-sm">
                  <RealisticQR seed={1337} />
                </div>
                <FakeBarcode width={148} height={28} label="CB-24-HMN • USA" />
              </div>
            </div>
          </div>

          {/* bottom strip */}
          <div className="relative flex items-center justify-between gap-2 border-t border-slate-800/70 bg-slate-950/50 px-5 py-3">
            <span className="text-xs text-slate-400">Proof-of-Human v1.0</span>
            <span className="text-[10px] text-sky-300/80 font-mono">HUMAN-L1 • PoH</span>
          </div>
        </div>
      </motion.div>

      <h3 className="text-xl md:text-2xl font-semibold mb-4 text-white tracking-tight">Hobbies</h3>

      {/* HUD grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <motion.a
            key={it.title}
            href={it.href}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className={`group relative rounded-xl border border-slate-800/70 bg-slate-900/30 backdrop-blur p-4 ring-1 ring-sky-400/20 hover:ring-sky-300/40 ${activeIdx === i ? "moving-border" : ""}`}
          >
            <div className="flex items-start gap-3 text-slate-200">
              <div className="mt-0.5 text-sky-300/90"> <Icon name={it.icon} /> </div>
              <div>
                <div className="text-white font-medium">{it.title}</div>
                {it.subtitle && (
                  <div className="text-slate-400 text-sm">{it.subtitle}</div>
                )}
              </div>
              <span className="ml-auto inline-flex items-center gap-1 text-emerald-300/90 text-xs font-mono uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Verified
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
