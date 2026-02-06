"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type Book = {
  title: string;
  author?: string;
  href?: string;
  cover?: string;
};

const defaultBooks: Book[] = [
  { title: "Children of Time", author: "Adrian Tchaikovsky", href: "https://www.goodreads.com/book/show/25499718-children-of-time", cover: "/images/books/children-of-time.jpg" },
  { title: "Abundance", author: "Ezra Klein", href: "https://www.goodreads.com/book/show/176444106-abundance", cover: "/images/books/abundance.jpg" },
  {
    title: "How to Invent Everything: A Survival Guide for the Stranded Time Traveler",
    author: "Ryan North",
    href: "https://www.goodreads.com/book/show/39026990-how-to-invent-everything",
    cover: "/images/books/how-to-invent-everything.jpg",
  },
  { title: "The Dark Forest (The Three-Body Problem, #2)", author: "Liu, Cixin", href: "https://www.goodreads.com/book/show/23168817-the-dark-forest", cover: "/images/books/the-dark-forest.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", href: "https://www.goodreads.com/book/show/54493401-project-hail-mary", cover: "/images/books/project-hail-mary.jpg" },
  { title: "Chrysalis", author: "BeaverFur", href: "https://www.goodreads.com/book/show/40202397-chrysalis" },
];

export default function Library({ id = "library", books = defaultBooks }: { id?: string; books?: Book[] }) {
  // One-at-a-time moving scan along the row
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (!books.length) return;
    const SCAN_DURATION_MS = 3000; // match CSS .moving-border rotation duration
    const idTimer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % books.length);
    }, SCAN_DURATION_MS);
    return () => clearInterval(idTimer);
  }, [books.length]);
  return (
  <section id={id} className="relative mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">My Book Recommendations</h2>

  {/* Fading edges for scroll hint */}
  <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-10 bg-gradient-to-t from-[#020617] to-transparent z-0" />
  <div className="pointer-events-none absolute left-0 right-0 -top-1 h-8 bg-gradient-to-b from-transparent to-[#020617]/40 z-0" />

      {/* Shelf bar */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 bottom-2 h-1.5 rounded bg-gradient-to-r from-sky-500/30 via-sky-400/20 to-sky-500/30 blur-[1px]" />

        {/* Scroll row */}
        <div
          className="relative -mx-6 px-6 pt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 z-10"
          aria-label="Bookshelf"
        >
          {books.map((b, i) => {
            // Blue-themed translucent cover with subtle holographic grid
            const cover =
              "linear-gradient(135deg, rgba(56,189,248,0.14) 0%, rgba(56,189,248,0.10) 50%, rgba(2,132,199,0.08) 100%)";
            const spine = "linear-gradient(to bottom, rgba(56,189,248,0.5), rgba(2,132,199,0.35))";
            const pages = "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 3px)";
            const grid =
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 1px)";
            return (
              <a
                key={`${b.title}-${i}`}
                href={b.href}
                target={b.href ? "_blank" : undefined}
                rel={b.href ? "noopener noreferrer" : undefined}
                className="snap-start shrink-0 w-28 md:w-32 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 rounded-lg"
                aria-label={`${b.title}${b.author ? ` by ${b.author}` : ""}${b.href ? ", opens in new tab" : ""}`}
                style={{ perspective: 900, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ y: -6 }}
                >
                  {/* Hover state controller for inner 3D elements */}
                  <motion.div initial="rest" whileHover="hover" className="relative h-40 md:h-48" style={{ transformStyle: "preserve-3d" }}>
                    {/* Back board */}
                    <div className="absolute inset-0 rounded-lg bg-slate-900/25 ring-1 ring-sky-400/15 shadow-lg" />

                    {/* Page block edges on the right */}
                    <div className="absolute inset-y-2 right-0 w-3 opacity-50" style={{ backgroundImage: pages }} />

                    {/* Extra inner page layers for a thicker look */}
                    {Array.from({ length: 4 }).map((_, pIdx) => (
                      <motion.div
                        key={`page-${pIdx}`}
                        variants={{
                          rest: { rotateY: 0, z: 1 + pIdx * 1.2 },
                          hover: { rotateY: -8 - pIdx * 3.5, z: 2 + pIdx * 1.2 },
                        }}
                        className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-sky-200/10"
                        style={{
                          transformOrigin: "left center",
                          transformStyle: "preserve-3d",
                          background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                          boxShadow: pIdx === 0 ? "inset 0 0 0 1px rgba(2,132,199,0.06)" : undefined,
                        }}
                      >
                        {/* subtle page lines */}
                        <div className="absolute inset-y-3 right-2 w-1 opacity-30" style={{ backgroundImage: pages }} />
                      </motion.div>
                    ))}

                    {/* Rotating scan border overlay */}
                    <div className={`absolute inset-0 rounded-lg ${activeIdx === i ? "moving-border" : ""}`} />

                    {/* Front cover that opens on hover */}
                    <motion.div
                      variants={{ rest: { rotateY: 0, z: 0 }, hover: { rotateY: -30, z: 10 } }}
                      className="absolute inset-0 overflow-hidden rounded-lg ring-1 ring-sky-400/25 bg-slate-900/20 backdrop-blur-sm"
                      style={{ backgroundImage: b.cover ? undefined : cover, transformOrigin: "left center", transformStyle: "preserve-3d" }}
                    >
                      {/* Cover image */}
                      {b.cover && (
                        <img
                          src={b.cover}
                          alt={b.title}
                          className="absolute inset-0 h-full w-full object-cover rounded-lg"
                        />
                      )}
                      {/* Spine stays attached to the left */}
                      <div className="absolute inset-y-0 left-0 w-2.5" style={{ background: spine }} />
                      {/* Grid overlay (only when no cover image) */}
                      {!b.cover && <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: grid, backgroundSize: "16px 16px" }} />}
                      {/* Sheen sweep on hover */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100">
                        <div className="absolute -left-[150%] top-0 bottom-0 w-[40%] rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-sheen-x" />
                      </div>
                      {/* Darkened overlay for text readability on cover images */}
                      {b.cover && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />}
                      {/* Corner brackets */}
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-1 top-1 h-3 w-3 border-l border-t border-sky-300/50" />
                        <div className="absolute right-1 bottom-1 h-3 w-3 border-r border-b border-sky-300/40" />
                      </div>
                      {/* Sheen */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/10 via-transparent to-transparent" />
                      <div className="absolute inset-0 p-3 pl-4 flex flex-col justify-end">
                        <div className="text-slate-50 text-[11px] font-semibold leading-tight line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{b.title}</div>
                        {b.author && (
                          <div className="text-sky-200/90 font-mono uppercase tracking-wider text-[9px] mt-1 line-clamp-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{b.author}</div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
