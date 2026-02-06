"use client";
import { motion } from "framer-motion";

export type Project = {
  title: string;
  href?: string;
  technologies?: string[];
  bullets?: string[];
};

const defaultProjects: Project[] = [
  {
    title: "BudgetLens: Interactive Financial Dashboard",
    href: "https://github.com/cbangera2/BudgetLens",
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Docker", "Prisma", "shadcn/ui"],
    bullets: [
      "Enabled users to gain financial insights by developing an interactive dashboard that visualized complex transactions",
    ],
  },
  {
    title: "CreditKarmaExtractor: Chrome Extension for Transaction Export",
    href: "https://github.com/cbangera2/CreditKarmaExtractor",
    technologies: ["JavaScript", "Chrome Extensions"],
    bullets: [
      "Streamlined personal financial tracking by automating the export of Credit Karma transactions into CSV files",
    ],
  },
  {
    title: "Compensation Calculator",
    href: "https://github.com/cbangera2/compensation-calculator",
    technologies: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    bullets: [
      "Model and compare compensation packages over time with offers and assumptions (base, bonus, equity grants/vesting, raises, cost of living)",
      "Project total compensation, visualize equity value, and compare scenarios side-by-side",
      "All data is stored locally in your browser",
    ],
  },
  {
    title: "Personal Website",
    href: "https://github.com/cbangera2/ahumanwebsite",
    technologies: ["Next.js", "React Three Fiber (R3F)", "Tailwind CSS"],
    bullets: [
      "Conveyed the theme \"Human.\" — highlighting the partnership between human creativity and AI in building and storytelling",
    ],
  },
];

export default function Projects({ id = "projects", projects = defaultProjects }: { id?: string; projects?: Project[] }) {

  return (
    <section id={id} className="relative mx-auto max-w-6xl px-6 py-24">
      {/* HUD grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />

      {/* Title */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Projects</h2>
        <p className="text-slate-300/90 mt-2 max-w-3xl">
          A small collection of things I built and shipped.
        </p>
      </div>

      {/* Grid layout */}
      <div
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 z-10"
        aria-label="Projects"
      >
        {projects.map((p, idx) => (
          <motion.a
            key={`${p.title}-${idx}`}
            href={p.href}
            target={p.href ? "_blank" : undefined}
            rel={p.href ? "noopener noreferrer" : undefined}
            className="group relative rounded-xl border border-slate-800/70 bg-slate-900/30 backdrop-blur px-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 flex flex-col"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: idx * 0.03 }}
            whileHover={{ y: -6 }}
            aria-label={`${p.title}${p.href ? ", opens in new tab" : ""}`}
          >


            {/* Decorative brackets */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-sky-300/40" />
              <div className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-sky-300/30" />
            </div>

            {/* Top light */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/25 to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col flex-1">
              <h3 className="text-white text-lg md:text-xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-sky-200 to-sky-400/80 bg-clip-text text-transparent">
                  {p.title}
                </span>
              </h3>

              {p.technologies && p.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.technologies.map((t, tIdx) => (
                    <span
                      key={`${p.title}-tech-${tIdx}`}
                      className="rounded-md border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-[11px] font-medium text-sky-200/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {p.bullets && p.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 text-slate-300/90 flex-1">
                  {p.bullets.map((b, bIdx) => (
                    <li key={`${p.title}-bullet-${bIdx}`} className="flex gap-2">
                      <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-sky-400/90 shadow-[0_0_10px_rgba(56,189,248,0.6)]" aria-hidden />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA hint */}
              {p.href && (
                <div className="mt-5 inline-flex items-center gap-2 text-sky-300/90 text-sm">
                  <span>Open</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M9 7h8v8" />
                  </svg>
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
