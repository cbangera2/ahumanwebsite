"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Track = {
  title: string;
  artist: string;
  url?: string;
  cover?: string;
  lengthSec?: number;
};

// iPod sizing
const IPOD_WIDTH_REM = 18; // base width
const IPOD_WIDTH_SCALE = 1.1; // 10% bigger by default; adjust as needed
const IPOD_WIDTH = `${IPOD_WIDTH_REM * IPOD_WIDTH_SCALE}rem`;

const defaultTracks: Track[] = [
  {
    title: "Found",
    artist: "Spotify",
    lengthSec: 180,
    url: "https://open.spotify.com/track/7fwkT46STB0k6fBZLmQA2m?si=abcc575c86834d2e",
  },
  {
    title: "The",
    artist: "Spotify",
    lengthSec: 180,
    url: "https://open.spotify.com/track/1lb3H41lbvAN28N7yqRNL9?si=e79c3b3b53434fdc",
  },
  {
    title: "Easter",
    artist: "Spotify",
    lengthSec: 180,
    url: "https://open.spotify.com/track/1oUnBe0RDlneJQxuezHxa6?si=445b3efc89c84907",
  },
  {
    title: "Egg",
    artist: "Spotify",
    lengthSec: 180,
    url: "https://open.spotify.com/track/2agBDIr9MYDUducQPC1sFU?si=cfb564d8c20942a4",
  },
];

export default function IPodNano({ id = "music", tracks = defaultTracks }: { id?: string; tracks?: Track[] }) {
  const [index, setIndex] = useState(0);
  // reserved for future: volume control on wheel press+rotate
  // const [volume, setVolume] = useState(0.8);
  const [csvTracks, setCsvTracks] = useState<Track[] | null>(null);

  const sourceTracks = csvTracks && csvTracks.length > 0 ? csvTracks : tracks;
  const active = sourceTracks[Math.max(0, Math.min(index, sourceTracks.length - 1))];

  // Load tracks from public/The_Classics.csv
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("./data/The_Classics.csv", { cache: "force-cache" });
        if (!res.ok) return;
        const text = await res.text();
  const rows = parseCsv(text);
        if (!rows.length) return;
        // Map header to indices
        const header = rows[0];
        const data = rows.slice(1);
        const h = (name: string) => header.indexOf(name);
        const uriIdx = h("Track URI");
        const nameIdx = h("Track Name");
        const artistIdx = h("Artist Name(s)");
        const durIdx = h("Duration (ms)");
        const mapped: Track[] = data
          .map((cols: string[]) => {
            const uri = cols[uriIdx] || "";
            const id = spotifyIdFromUriOrUrl(uri);
            if (!id) return null;
            const title = cols[nameIdx] || "Unknown";
            const artist = cols[artistIdx] || "";
            const msStr = cols[durIdx];
            const lengthSec = msStr ? Math.max(1, Math.round(Number(msStr) / 1000)) : 180;
            return {
              title,
              artist,
              lengthSec,
              url: `https://open.spotify.com/track/${id}`,
            } as Track;
          })
          .filter(Boolean) as Track[];
        if (!cancelled && mapped.length) {
          setCsvTracks(mapped);
          // Keep index in range if existing index is out of bounds
          setIndex((i) => (i >= mapped.length ? 0 : i));
        }
      } catch {
        // ignore and keep defaults
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Wheel rotation handling (mouse/touch drag around center)
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const angleRef = useRef<number | null>(null);
  const accumRef = useRef(0);
  const threshold = 20; // degrees per step

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    angleRef.current = getAngleFromEvent(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (angleRef.current == null) return;
    const prev = angleRef.current;
    const now = getAngleFromEvent(e);
    if (now == null) return;
    let delta = now - prev;
    // Normalize to [-180, 180]
    delta = ((delta + 540) % 360) - 180;
    angleRef.current = now;
    accumRef.current += delta;
    if (Math.abs(accumRef.current) > threshold) {
      const steps = Math.trunc(accumRef.current / threshold);
      accumRef.current -= steps * threshold;
  setIndex((i) => clampIndex(i + steps, sourceTracks.length));
    }
  };
  const onPointerUp = () => {
    angleRef.current = null;
    accumRef.current = 0;
  };

  function getAngleFromEvent(e: React.PointerEvent) {
    const el = wheelRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..180
    return ang;
  }

  function clampIndex(i: number, len: number) {
    if (i < 0) return 0;
    if (i > len - 1) return len - 1;
    return i;
  }

  // No simulated progress; embed provides transport UI

  return (
    <section id={id} className="relative mx-auto max-w-6xl px-6 py-16">
  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">The Classics</h2>

      {/* subtle top/bottom fade like PodcastShelf */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-10 bg-gradient-to-t from-[#020617] to-transparent z-0" />
      <div className="pointer-events-none absolute left-0 right-0 -top-1 h-8 bg-gradient-to-b from-transparent to-[#020617]/40 z-0" />

  <div className="relative flex flex-col items-center gap-6">
        {/* iPod body */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="relative mx-auto h-[32rem] rounded-[2rem] bg-slate-900/50 ring-1 ring-sky-400/25 shadow-xl backdrop-blur overflow-hidden moving-border"
          style={{ width: IPOD_WIDTH }}
        >
          {/* Screen with embedded Spotify */}
          <div className="relative m-4 rounded-xl h-[152px] bg-slate-900/50 ring-1 ring-sky-400/30 overflow-hidden">
            {/* grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            {active?.url && (
              <iframe
                key={embedSrcFromUrl(active.url)}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                src={embedSrcFromUrl(active.url)}
                width="100%"
                height="100%"
                scrolling="no"
                title="Spotify player"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            )}
          </div>

          {/* Track list */}
          <div className="mx-4 mt-2 mb-4 space-y-2 max-h-40 overflow-y-auto overflow-x-hidden pr-1">
            {sourceTracks.map((t, i) => (
              <button
                key={`${t.title}-${i}`}
                onClick={() => {
                  setIndex(i);
                }}
                className={`group w-full text-left px-3 py-2 rounded-lg ring-1 transition-all duration-200 ${
                  i === index
                    ? "bg-sky-400/10 ring-sky-400/40 text-white"
                    : "bg-slate-900/40 ring-slate-700/40 text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium leading-tight truncate"
                      title={t.title}
                      aria-label={t.title}
                    >
                      {t.title}
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-wider text-sky-200/80 truncate"
                      title={t.artist}
                      aria-label={t.artist}
                    >
                      {t.artist}
                    </div>
                  </div>
                  {i === index && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-sky-400/80 animate-pulse-glow" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Wheel area */}
          <div className="absolute left-0 right-0 bottom-5 grid place-items-center">
            <div
              ref={wheelRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="relative h-40 w-40 rounded-full bg-slate-900/60 ring-1 ring-sky-400/30 shadow-inner cursor-pointer select-none"
            >
              {/* labels */}
              <div className="absolute inset-0 grid place-items-center text-sky-100/90">
                <div className="absolute top-3 text-[10px] uppercase tracking-widest">Menu</div>
                <div className="absolute bottom-3 text-[10px] uppercase tracking-widest">Play/Pause</div>
                <div className="absolute left-2 text-[10px] uppercase tracking-widest">Prev</div>
                <div className="absolute right-2 text-[10px] uppercase tracking-widest">Next</div>
              </div>

              {/* click areas */}
              <button
                aria-label="Previous"
                onClick={() => setIndex((i) => clampIndex(i - 1, sourceTracks.length))}
                className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-sky-400/10"
              />
              <button
                aria-label="Next"
                onClick={() => setIndex((i) => clampIndex(i + 1, sourceTracks.length))}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-sky-400/10"
              />
              <div
                aria-label="Menu"
                className="absolute top-1 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full"
              />
              <button
                aria-label="Open current track on Spotify"
                onClick={() => {
                  if (active?.url) window.open(active.url, "_blank", "noopener,noreferrer");
                }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full hover:bg-sky-400/10"
              />

              {/* center button */}
              <button
                aria-label="Open current track on Spotify"
                onClick={() => {
                  if (active?.url) window.open(active.url, "_blank", "noopener,noreferrer");
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-slate-800/60 ring-1 ring-sky-300/30 hover:bg-slate-800/80"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function embedSrcFromUrl(url: string): string {
  // Accept both regular and already-embed URLs; return the embed format.
  // Examples:
  // https://open.spotify.com/track/{id}?...
  // https://open.spotify.com/embed/track/{id}?...
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    // parts like ["track", "{id}"] or ["embed", "track", "{id}"]
    let id = "";
    const idx = parts.indexOf("track");
    if (idx !== -1 && parts[idx + 1]) {
      id = parts[idx + 1];
    }
    if (!id) return url; // fallback to original
    const qp = u.searchParams.toString();
    const base = `https://open.spotify.com/embed/track/${id}`;
    return qp ? `${base}?${qp}` : base;
  } catch {
    return url;
  }
}

// Minimal CSV parser to handle quoted values and commas
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          field += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        cur.push(field);
        field = "";
      } else if (c === '\n') {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === '\r') {
        // ignore
      } else {
        field += c;
      }
    }
  }
  // last line
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  // Trim BOM on first header cell if present
  if (rows.length && rows[0].length) {
    rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  }
  return rows;
}

function spotifyIdFromUriOrUrl(input: string): string | null {
  // Accept formats like:
  // spotify:track:{id}
  // https://open.spotify.com/track/{id}
  if (!input) return null;
  if (input.startsWith("spotify:track:")) {
    return input.split(":").pop() || null;
  }
  try {
    const u = new URL(input);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("track");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch {
    // not a URL
  }
  return null;
}
