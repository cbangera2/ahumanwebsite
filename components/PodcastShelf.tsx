"use client";
import { motion } from "framer-motion";

type Podcast = {
  title: string;
  author?: string;
  href?: string;
  cover?: string;
};

const defaultPodcasts: Podcast[] = [
  { title:"Dwarkesh Patel", author: "Dwarkesh Patel", href: "https://www.youtube.com/c/DwarkeshPatel", cover: "/images/podcasts/dwarkesh.jpg" },
  { title: "The Peterman Pod", author: "Ryan Peterman", href: "https://www.youtube.com/playlist?list=PLmvMm6hsJgCc9VPDgq8SQEFMln_azyKSG", cover: "/images/podcasts/peterman.jpg" },
  { title: "Fall of Civilizations", author: "Paul M.M. Cooper", href: "https://fallofcivilizationspodcast.com/", cover: "/images/podcasts/fall-of-civ.jpg" },
  { title: "Dan Carlin's Hardcore History", author: "Dan Carlin", href: "https://www.dancarlin.com/hardcore-history-series/", cover: "/images/podcasts/hardcore.jpg" },
  { title: "Dust", author: "Dust Studios", href: "https://www.youtube.com/channel/UC7sDT8jZ76VLV1u__krUutA", cover: "/images/podcasts/dust.jpg" },
];

export default function PodcastShelf({ id = "podcasts", podcasts = defaultPodcasts }: { id?: string; podcasts?: Podcast[] }) {
  return (
  <section id={id} className="relative mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">My Podcast Recommendations</h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Podcast shelf">
          {podcasts.map((p, i) => (
            <motion.div
              key={`${p.title}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative h-28 md:h-32 rounded-xl bg-slate-900/30 backdrop-blur ring-1 ring-sky-400/25 shadow-lg overflow-hidden"> 
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-sky-400/50 to-sky-600/30 ring-2 ring-sky-300/30 shadow-[0_0_30px_-8px_rgba(56,189,248,0.6)] animate-spin-slow overflow-hidden">
                  {p.cover && (
                    <img src={p.cover} alt="" className="h-full w-full object-cover" />
                  )}
                </div>

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
    </section>
  );
}
