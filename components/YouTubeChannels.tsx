"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

export type Channel = {
  url: string;
  name: string;
  description?: string;
  avatar: string;
  note?: string;
};

const channels: Channel[] = [
  {
    url: "https://www.youtube.com/@Asianometry",
    name: "Asianometry",
    description:
      "Video essays on business, economics, and history. Sometimes about Asia, but not always.",
    avatar:
      "https://yt3.googleusercontent.com/t_WHWwjVFb-837gRQ-ExcsjK1q5Z4dZ-mb4I6ItI4aBo3woGH7MkO7RAKf5kiAZUa3148lgNWw=s160-c-k-c0x00ffffff-no-rj",
    note: "Tech and silicon history deep-dives.",
  },
  {
    url: "https://www.youtube.com/@t3dotgg",
    name: "Theo - t3.gg",
    description:
      "Hi, I'm a software dev nerd mostly known for full stack TypeScript stuff. Check out me and my stack at t3.gg",
    avatar:
      "https://yt3.googleusercontent.com/Y6jut5A-dhWRlv7W81kGxVFPtZGjZN97IhBP75uLnx2AVV7ZEJUUUxBKHlFw9GcwILxkz1E_cLc=s160-c-k-c0x00ffffff-no-rj",
    note: "Pragmatic TS takes—useful and entertaining.",
  },
  {
    url: "https://www.youtube.com/@veritasium",
    name: "Veritasium",
    description:
      "An element of truth - videos about science, education, and anything else we find interesting.",
    avatar:
      "https://yt3.googleusercontent.com/7vCbvtCqtjQ3YLgsJt7Y952MQV1sBvhllSCSxHP8_sVZdcPCBrITfhkN2RdyCuwPnsByq-1GoA=s160-c-k-c0x00ffffff-no-rj",
    note: "High-production science that sticks with you.",
  },
  {
    url: "https://www.youtube.com/@theAIsearch",
    name: "AI Search",
    description:
      "Making AI easy to understand for everyone. Subscribe to stay on top of the latest AI news, trends, and tools!",
    avatar:
      "https://yt3.googleusercontent.com/GV5UTW2IlP29PhsLKm65ue4LZYXxMyPV5YQdfE6GVgv9KH1_y_8kCirPGfpVn9yTJuNBvVHktEE=s160-c-k-c0x00ffffff-no-rj",
    note: "Succinct AI news with solid curation.",
  },
  {
    url: "https://www.youtube.com/@kevinfaang",
    name: "Kevin Fang",
    description:
      "I read tech postmortems and make bad videos about them",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_kuMYJ8DWw6SbxmKiOTjDKC-yyCaxT9iwkCmCueaWAdqg=s160-c-k-c0x00ffffff-no-rj",
    note: "Dry-wit postmortems—my kind of humor.",
  },
  {
    url: "https://www.youtube.com/@Fireship",
    name: "Fireship",
    description:
      "High-intensity ⚡ code tutorials and tech news to help you ship your app faster. New videos every week covering the topics every programmer should know.",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_mKzklyPPhghBJQH5H3HpZ108YcE618DBRLAvRUD1AjKNw=s160-c-k-c0x00ffffff-no-rj",
    note: "Crash-course energy to stay current fast.",
  },
  {
    url: "https://www.youtube.com/@lauriewired",
    name: "LaurieWired",
    description: "researcher; serial complexity unpacker",
    avatar:
      "https://yt3.googleusercontent.com/kZdtzwtGEkHXUw7uaB7JltcEuiuI0Z7PfFsKr6s0suipVxLmn1tKRKeqa40eK6b_EmwZScdU4w=s160-c-k-c0x00ffffff-no-rj",
    note: "Dense research, excellent signal-to-noise.",
  },
  {
    url: "https://www.youtube.com/@bycloudAI",
    name: "bycloud",
    description: "I cover the latest AI tech/research papers for fun",
    avatar:
      "https://yt3.googleusercontent.com/1umpkXgsEDP_RNqyWO-22q3rFYaf73ldv4ewpqbEEwL3zPIBhVRLVVxYICVoMbGqspldBLXVmlg=s160-c-k-c0x00ffffff-no-rj",
    note: "Deep dives on papers without fluff.",
  },
  {
    url: "https://www.youtube.com/@3blue1brown",
    name: "3Blue1Brown",
    description:
      "My name is Grant Sanderson. Videos here cover a variety of topics in math, or adjacent fields like physics and CS, all with an emphasis on visualizing the core ideas. The goal is to use animation to help elucidate and motivate otherwise tricky topics, and for difficult problems to be made simple with changes in perspective.",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_nFzZFPLxPZRHcE3SSwzdrbuWqfoWYwLAu0_2iO6blQYAU=s160-c-k-c0x00ffffff-no-rj",
    note: "When math feels like poetry.",
  },
  {
    url: "https://www.youtube.com/@aiDotEngineer",
    name: "AI Engineer",
    description:
      "Talks, workshops, events, and training for AI Engineers.",
    avatar:
      "https://yt3.googleusercontent.com/ajVemEB89DAOemsbfuMY6ZOWXJAACx3cbty9z21jeqRKODaVkDBSRun1b1xfQJljEsziOWS_Mg=s160-c-k-c0x00ffffff-no-rj",
    note: "Practical talks for builders.",
  },
  {
    url: "https://www.youtube.com/@WelchLabsVideo",
    name: "Welch Labs",
    description: "Great math & science stories.",
    avatar:
      "https://yt3.googleusercontent.com/RFCKJgHcSbN14fHQn-Xhwzch3xgbwxh15edMdiYZbslxMrU-Y-gFEOPGdIy3Cot0oVAr8E0Dow=s160-c-k-c0x00ffffff-no-rj",
    note: "Charming, curious explorations.",
  },
  {
    url: "https://www.youtube.com/@programmersarealsohuman5909",
    name: "Kai Lentit",
    description: "Tech humor skits",
    avatar:
      "https://yt3.googleusercontent.com/USAYjiKcuDi6fvRLfWaZoMY0hYO9HJtajxEYom8DGDe-vDW8UetZ5Yr6DECCXzYXd5ghRuc3E-o=s160-c-k-c0x00ffffff-no-rj",
    note: "Absurd and relatable tech humor.",
  },
  {
    url: "https://www.youtube.com/@cultrepo",
    name: "CultRepo",
    description:
      "🧠 Documentaries and shorts about the human stories behind open source technology. \n🌟 Our mission: Document every major programming language ever created",
    avatar:
      "https://yt3.googleusercontent.com/JEY96H2ij7Xg9YaKv8vNZLu4M_Y2XzF_Zcx4GihTk0imoAdHTmwIlFWrygX0Z41rSNvP5Eud=s160-c-k-c0x00ffffff-no-rj",
    note: "Oral histories—OSS time capsules.",
  },
  {
    url: "https://www.youtube.com/@HighYield",
    name: "High Yield",
    description: "Analysis, commentary and current developments in hardware and tech.",
    avatar:
      "https://yt3.googleusercontent.com/ftDVy8Y3FXSziXLhkXNnRGxrw6LAUvG-8jpiNOEkfiUb3HkL2ms86u-CWyh5Thl1pBfWSZtMzA=s160-c-k-c0x00ffffff-no-rj",
    note: "Sober hardware/supply-chain analysis.",
  },
  {
    url: "https://www.youtube.com/@NeetCodeIO",
    name: "NeetCodeIO",
    description: undefined,
    avatar:
      "https://yt3.googleusercontent.com/WeETyMBPRtDutWCEdhq0qVtpBkYDZQylyncynna6SsTzvjDyeqzjbO7KUcbq2WPPqZDOUJtHsw=s160-c-k-c0x00ffffff-no-rj",
    note: "Solid DS&A walkthroughs.",
  },
  {
    url: "https://www.youtube.com/@KRAZAM",
    name: "KRAZAM",
    description: "Unlock the secrets to ETERNAL DIGITAL LONGEVITY",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_mnS2EOzDQt71WmB1JqHDIkadjuI_5RNRn4HOdW2fbMuw=s160-c-k-c0x00ffffff-no-rj",
    note: "Really funny tech skits. Unhinged in the best way.",
  },
];

export default function YouTubeChannels({ id = "hobbies" }: { id?: string }) {
  // Rotary dial state
  const [active, setActive] = useState(0);
  const count = channels.length;
  const step = 360 / count;

  const clampWrap = useCallback(
    (i: number) => ((i % count) + count) % count,
    [count]
  );
  const next = useCallback(() => setActive((a) => clampWrap(a + 1)), [clampWrap]);
  const prev = useCallback(() => setActive((a) => clampWrap(a - 1)), [clampWrap]);

  // radius measurement for responsiveness
  const stageRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(220);
  useEffect(() => {
    const update = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      // Slightly larger circle: raise min, reduce padding, raise cap
      const r = Math.max(130, Math.min(Math.floor(Math.min(w, h) / 2) - 52, 280));
      setRadius(r);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // gestures: wheel and drag
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) < 24) return;
    if (dx < 0) next();
    else prev();
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;
    if ((Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) > 0) next();
    else prev();
  };

  // auto-rotate with smart pausing
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [docVisible, setDocVisible] = useState(true);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    try {
      prefersReducedMotion.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    } catch {
      prefersReducedMotion.current = false;
    }
  }, []);

  useEffect(() => {
    const onVis = () => setDocVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (hovered || !inView || !docVisible || prefersReducedMotion.current) return;
    const id = setInterval(() => next(), 3600);
    return () => clearInterval(id);
  }, [hovered, inView, docVisible, next]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Enter") {
        window.open(channels[active].url, "_blank", "noopener,noreferrer");
      }
    },
    [active, next, prev]
  );

  // precompute positions
  const positions = useMemo(() => {
    return channels.map((_, i) => {
      // active sits at top (12 o'clock). Others placed clockwise around.
      const a = (i - active) * step - 90; // deg
      const rad = (a * Math.PI) / 180;
      const x = radius * Math.cos(rad);
      const y = radius * Math.sin(rad);
      const near = Math.cos(((a + 90) * Math.PI) / 180); // 1 at top, -1 at bottom
      const scale = 0.86 + 0.14 * Math.max(0, near);
      const opacity = 0.45 + 0.55 * Math.max(0, near);
      const z = 50 + Math.round(near * 50);
      const isActive = i === active;
      return { x, y, scale, opacity, z, isActive, angle: a };
    });
  }, [active, radius, step]);

  // numeric formatter for consistent SSR/CSR strings
  const fmt = useCallback((n: number, p = 3) => Number(n.toFixed(p)), []);

  return (
    <section id={id} className="relative mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">My YouTube Recommendations</h2>

      {/* Dial stage */}
      <div
        ref={stageRef}
        className="relative h-[30rem] md:h-[34rem] rounded-2xl"
        tabIndex={0}
        role="region"
        aria-roledescription="Rotary dial of YouTube channels"
        aria-label={`Selected: ${channels[active].name}`}
        onKeyDown={onKeyDown}
  onPointerEnter={() => setHovered(true)}
  onPointerLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        {/* Outer ring glow and ticks */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: radius * 2 + 40, height: radius * 2 + 40 }}
          suppressHydrationWarning
        >
          <div className="absolute inset-0 rounded-full ring-1 ring-sky-400/25 shadow-[0_0_40px_rgba(56,189,248,0.25)_inset]" />
          {/* tick marks */}
          {Array.from({ length: count }).map((_, i) => {
            const a = (i * step - 90) * (Math.PI / 180);
      const tx = (radius + 14) * Math.cos(a);
      const ty = (radius + 14) * Math.sin(a);
            const rot = (i * step) - 90;
            return (
              <div
                key={`tick-${i}`}
                className="absolute left-1/2 top-1/2 w-[22px] h-[2px] bg-sky-400/30"
        style={{ transform: `translate(${fmt(tx)}px, ${fmt(ty)}px) rotate(${fmt(rot, 2)}deg)` }}
              />
            );
          })}
          {/* top indicator */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-sky-400/60 ring-2 ring-sky-300/60 animate-pulse-glow" />
        </div>

        {/* Avatars on ring */}
        {channels.map((c, i) => {
          const p = positions[i];
          return (
            <motion.button
              key={`${c.name}-${i}`}
              onClick={() => setActive(i)}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-sky-400/30 overflow-hidden bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
              style={{ width: 56, height: 56, zIndex: p.z }}
              initial={false}
              animate={{ x: p.x, y: p.y, scale: p.scale, opacity: p.opacity }}
              transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.6 }}
              aria-label={`Focus ${c.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.avatar}
                alt={`Avatar for ${c.name}`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              {/* small label when near top */}
              {i === active && (
                <div className="pointer-events-none absolute left-1/2 top-[62px] -translate-x-1/2 text-[10px] text-sky-200/90 font-semibold whitespace-nowrap">
                  {c.name}
                </div>
              )}
            </motion.button>
          );
        })}

        {/* Center detail card */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[20rem] md:w-[26rem] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 999 }}
          key={active}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="relative rounded-2xl bg-slate-900/50 backdrop-blur ring-1 ring-sky-400/25 moving-border p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full ring-2 ring-sky-300/40 overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={channels[active].avatar} alt={`Avatar for ${channels[active].name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold leading-tight truncate">{channels[active].name}</div>
                {channels[active].description && (
                  <div className="text-sky-200/90 text-xs mt-1 line-clamp-2 md:line-clamp-3">{channels[active].description}</div>
                )}
              </div>
              <a
                href={channels[active].url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-sky-400/20 ring-1 ring-sky-300/40 grid place-items-center text-sky-200"
                aria-label={`Open ${channels[active].name} on YouTube`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>

            {channels[active].note && (
              <div className="mt-4">
                <div className="rounded-lg holo-ribbon bg-sky-500/10 ring-1 ring-sky-400/20 p-3">
                  <p className="text-[12px] text-sky-100/95 leading-snug">{channels[active].note}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="h-8 w-8 rounded-full bg-slate-800/60 ring-1 ring-sky-400/30 text-sky-200 hover:bg-slate-800/80"
            aria-label="Previous channel"
          >
            ‹
          </button>
          <div className="text-xs text-sky-200/80 font-mono">
            {active + 1}/{count}
          </div>
          <button
            onClick={next}
            className="h-8 w-8 rounded-full bg-slate-800/60 ring-1 ring-sky-400/30 text-sky-200 hover:bg-slate-800/80"
            aria-label="Next channel"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
