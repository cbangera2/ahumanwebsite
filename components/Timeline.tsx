"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export type TimelineItem = {
  title: string;
  subtitle?: string;
  period?: string; // optional; not rendered in UI
  description?: string;
};

const defaultItems: TimelineItem[] = [
  {
    title: "Applied Intuition",
    subtitle: "Simulation / Autonomy",
    description:
      "Vehicle and Maritime simulation for autonomous systems. AI/ML local deployments.",
  },
  {
    title: "Amazon",
    subtitle: "AWS RoboMaker / AWS Simulation Technology / AWS HPC",
    description: "Worked on large-scale simulation systems.",
  },
  {
    title: "Masters",
    subtitle: "University of Michigan",
    description: "M.S.E in Computer Science.",
  },
  {
    title: "Research",
    subtitle: "Honda Research Institute",
    description: "Navigable plane detection for autonomous micro-mobility.",
  },
  {
    title: "Research",
    subtitle: "University of Michigan",
    description: "Monte carlo percolation simulations under Robert M. Ziff.",
  },
  {
    title: "Undergrad",
    subtitle: "University of Michigan",
    description:
      "B.S.E in Computer Science, Minor in Business and Multidisciplinary Design.",
  },
];

export default function Timeline({ items = defaultItems, id = "timeline" }: { items?: TimelineItem[]; id?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (!items.length) return;
    const SCAN_DURATION_MS = 3000;
    const timer = setInterval(() => {
      setActiveIdx((i: number) => (i + 1) % items.length);
    }, SCAN_DURATION_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section id={id} className="relative mx-auto max-w-3xl px-6 py-24">
      {/* HUD grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />

      <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-white tracking-tight">Timeline</h2>
      <div className="relative ml-4">
        {/* Spine with animated scan */}
        <div className="absolute left-0 top-0 bottom-0 w-px" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/40 via-sky-300/15 to-transparent" />
          <div className="absolute left-0 -ml-[1px] w-[3px] h-24 bg-gradient-to-b from-transparent via-sky-300/70 to-transparent animate-scan-y" />
        </div>

        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="relative pl-8 pb-10"
          >
            {/* Node */}
            <span
              className="absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full bg-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.6)] ring-4 ring-sky-400/20"
              aria-hidden
            />

            {/* Card */}
            <div className={`relative rounded-xl border border-slate-800/70 bg-slate-900/30 backdrop-blur p-4 md:p-5 transition-all duration-300 ${activeIdx === idx ? "moving-border scale-[1.03] shadow-sky-400/30 shadow-2xl" : ""}`}>
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
              <div className="text-white text-lg md:text-xl font-medium">{item.title}</div>
              {item.subtitle && (
                <div className="text-sky-300/80 font-mono uppercase tracking-wider text-xs mb-1">
                  {item.subtitle}
                </div>
              )}
              {item.description && (
                <p className="text-slate-300/90 leading-relaxed">{item.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
