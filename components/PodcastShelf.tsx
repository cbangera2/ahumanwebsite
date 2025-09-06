"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Podcast = {
  title: string;
  author?: string;
  href?: string;
};

const defaultPodcasts: Podcast[] = [
  { title: "Fall of Civilizations", author: "Paul M.M. Cooper", href: "https://fallofcivilizationspodcast.com/" },
  { title: "Dan Carlin's Hardcore History", author: "Dan Carlin", href: "https://www.dancarlin.com/hardcore-history-series/" },
];

export default function PodcastShelf({ id, podcasts = defaultPodcasts }: { id?: string; podcasts?: Podcast[] }) {
  // One-at-a-time moving scan along the row
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (!podcasts.length) return;
    const SCAN_DURATION_MS = 3000; // match CSS .moving-border rotation duration
    const idTimer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % podcasts.length);
    }, SCAN_DURATION_MS);
    return () => clearInterval(idTimer);
  }, [podcasts.length]);
  return (
  <section id={id} className="relative mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">My Podcast Recommendations</h2>

      {/* Fading edges */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-10 bg-gradient-to-t from-[#020617] to-transparent z-0" />
      <div className="pointer-events-none absolute left-0 right-0 -top-1 h-8 bg-gradient-to-b from-transparent to-[#020617]/40 z-0" />

      <div className="relative">
        {/* Shelf bar */}
        <div className="pointer-events-none absolute left-0 right-0 bottom-2 h-1.5 rounded bg-gradient-to-r from-sky-500/30 via-sky-400/20 to-sky-500/30 blur-[1px]" />

        {/* Scroll row */}
        <div className="relative -mx-6 px-6 flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory pb-6 z-10" aria-label="Podcast shelf">
          {podcasts.map((p, i) => (
            <motion.div
              key={`${p.title}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -6 }}
              className="snap-start shrink-0 w-[22rem] max-w-[80vw]"
            >
              <div className={`relative h-28 md:h-32 rounded-xl bg-slate-900/30 backdrop-blur ring-1 ring-sky-400/25 shadow-lg overflow-hidden ${activeIdx === i ? "moving-border" : ""}`}> 
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${p.title}${p.author ? ` by ${p.author}` : ""}`}
                    className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 rounded-xl cursor-pointer"
                  />
                )}
                {/* Grid overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

                {/* Disc */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-sky-400/50 to-sky-600/30 ring-2 ring-sky-300/30 shadow-[0_0_30px_-8px_rgba(56,189,248,0.6)] animate-spin-slow" />
                {/* Disc hub */}
                <div className="absolute left-[3.5rem] md:left-[4.2rem] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-slate-900/80 ring-2 ring-sky-200/60" />

                {/* Content */}
                <div className="absolute left-28 right-4 md:left-32 top-0 bottom-0 flex flex-col justify-center">
                  <div className="text-white font-semibold leading-snug">{p.title}</div>
                  {p.author && (
                    <div className="text-sky-200/90 font-mono uppercase tracking-wider text-[10px] mt-1">{p.author}</div>
                  )}

                  {/* Waveform / equalizer */}
                  <div className="mt-3 flex items-end gap-1 h-4" aria-hidden>
                    <span className="w-1 bg-sky-400/80 animate-eq-1 rounded" />
                    <span className="w-1 bg-sky-300/80 animate-eq-2 rounded" />
                    <span className="w-1 bg-sky-400/80 animate-eq-3 rounded" />
                    <span className="w-1 bg-sky-300/80 animate-eq-2 rounded" />
                    <span className="w-1 bg-sky-400/80 animate-eq-1 rounded" />
                  </div>
                </div>

                {/* Play button */}
                <div className="absolute right-3 bottom-3 h-8 w-8 rounded-full bg-sky-400/20 ring-1 ring-sky-300/40 grid place-items-center text-sky-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
