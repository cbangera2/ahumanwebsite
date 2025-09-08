"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Output = { type: "out" | "err"; text: string };

// Source-of-truth text snapshots of the homepage sections
const CONTENT = {
  hero: `Human.`,
  quote: {
    text:
      "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.",
    author: "Albert Camus",
  },
  timeline: [
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
    { title: "Masters", subtitle: "University of Michigan", description: "M.S.E in Computer Science." },
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
      description: "B.S.E in Computer Science, Minor in Business and Multidisciplinary Design.",
    },
  ],
  human: {
    name: "Chirag Bangera",
    id: "CB-24-HMN",
    details: "Species: Homo sapiens • Citizen: United States • Locale: Earth (UTC±)",
    hobbies: [
      { title: "Running", subtitle: "5K 17:05 • 10K 42:30 • Half Marathon: ??" },
      { title: "Reading", subtitle: "Always" },
      { title: "Football", subtitle: "Detroit Lions • Michigan" },
      { title: "Ultimate Frisbee", subtitle: "Cutter / Handler" },
      { title: "Book Recommendations", subtitle: "See Library", href: "#library" },
      { title: "Podcasts", subtitle: "See Podcast Shelf", href: "#podcasts" },
    ],
  },
  library: [
    {
      title: "Children of Time",
      author: "Adrian Tchaikovsky",
      href: "https://www.goodreads.com/book/show/25499718-children-of-time",
    },
    { title: "Abundance", author: "Ezra Klein", href: "https://www.goodreads.com/book/show/176444106-abundance" },
    {
      title: "How to Invent Everything: A Survival Guide for the Stranded Time Traveler",
      author: "Ryan North",
      href: "https://www.goodreads.com/book/show/39026990-how-to-invent-everything",
    },
    {
      title: "The Dark Forest (The Three-Body Problem, #2)",
      author: "Liu, Cixin",
      href: "https://www.goodreads.com/book/show/23168817-the-dark-forest",
    },
    { title: "Chrysalis", author: "BeaverFur", href: "https://www.goodreads.com/book/show/40202397-chrysalis" },
  ],
  podcasts: [
    {
      title: "Fall of Civilizations",
      author: "Paul M.M. Cooper",
      href: "https://fallofcivilizationspodcast.com/",
    },
    {
      title: "Dan Carlin's Hardcore History",
      author: "Dan Carlin",
      href: "https://www.dancarlin.com/hardcore-history-series/",
    },
  ],
  links: {
    github: "https://github.com/cbangera2",
    linkedin: "https://www.linkedin.com/in/chirag-bangera24/",
    builtWith: "Next.js • R3F • Tailwind",
  },
};

const FILES = [
  "hero.txt",
  "quote.txt",
  "timeline.txt",
  "human.txt",
  "hobbies.txt",
  "library.txt",
  "podcasts.txt",
  "links.txt",
  "all.txt",
];

function renderAll(): string {
  const lines: string[] = [];
  lines.push(`# ${CONTENT.hero}`);
  lines.push("");
  lines.push(`> ${CONTENT.quote.text}`);
  lines.push(`— ${CONTENT.quote.author}`);
  lines.push("");
  lines.push("== Timeline ==");
  CONTENT.timeline.forEach((t) => {
    lines.push(`• ${t.title}${t.subtitle ? " — " + t.subtitle : ""}`);
    if (t.description) lines.push(`  ${t.description}`);
  });
  lines.push("");
  lines.push("== Human Verification ==");
  lines.push(`${CONTENT.human.name} • ID: ${CONTENT.human.id}`);
  lines.push(CONTENT.human.details);
  lines.push("");
  lines.push("== Hobbies ==");
  CONTENT.human.hobbies.forEach((h) => {
    lines.push(`• ${h.title}${h.subtitle ? " — " + h.subtitle : ""}${h.href ? ` (${h.href})` : ""}`);
  });
  lines.push("");
  lines.push("== Library ==");
  CONTENT.library.forEach((b) => {
    lines.push(`• ${b.title}${b.author ? " — " + b.author : ""}${b.href ? ` (${b.href})` : ""}`);
  });
  lines.push("");
  lines.push("== Podcasts ==");
  CONTENT.podcasts.forEach((p) => {
    lines.push(`• ${p.title}${p.author ? " — " + p.author : ""}${p.href ? ` (${p.href})` : ""}`);
  });
  lines.push("");
  lines.push("== Links ==");
  lines.push(`• GitHub — ${CONTENT.links.github}`);
  lines.push(`• LinkedIn — ${CONTENT.links.linkedin}`);
  lines.push(`• Built with — ${CONTENT.links.builtWith}`);
  return lines.join("\n");
}

function catFile(name: string): string | null {
  switch (name) {
    case "hero":
    case "hero.txt":
      return CONTENT.hero;
    case "quote":
    case "quote.txt":
      return `${CONTENT.quote.text}\n— ${CONTENT.quote.author}`;
    case "timeline":
    case "timeline.txt":
      return CONTENT.timeline
        .map((t) => `• ${t.title}${t.subtitle ? " — " + t.subtitle : ""}${t.description ? "\n  " + t.description : ""}`)
        .join("\n");
    case "human":
    case "human.txt":
      return `${CONTENT.human.name} • ID: ${CONTENT.human.id}\n${CONTENT.human.details}`;
    case "hobbies":
    case "hobbies.txt":
      return CONTENT.human.hobbies
        .map((h) => `• ${h.title}${h.subtitle ? " — " + h.subtitle : ""}${h.href ? ` (${h.href})` : ""}`)
        .join("\n");
    case "library":
    case "library.txt":
      return CONTENT.library
        .map((b) => `• ${b.title}${b.author ? " — " + b.author : ""}${b.href ? ` (${b.href})` : ""}`)
        .join("\n");
    case "podcasts":
    case "podcasts.txt":
      return CONTENT.podcasts
        .map((p) => `• ${p.title}${p.author ? " — " + p.author : ""}${p.href ? ` (${p.href})` : ""}`)
        .join("\n");
    case "links":
    case "links.txt":
      return [`GitHub — ${CONTENT.links.github}`, `LinkedIn — ${CONTENT.links.linkedin}`, `Built with — ${CONTENT.links.builtWith}`].join(
        "\n",
      );
    case "all":
    case "all.txt":
    case "*":
    case ".":
    case "/":
      return renderAll();
    default:
      return null;
  }
}

export default function MockTerminal() {
  const [history, setHistory] = useState<Output[]>(() => [
    { type: "out", text: "Welcome to the Human text interface — a textual rendition of this site." },
    { type: "out", text: "Type 'help' or try: cat all | open human | tree" },
  ]);
  const [cwd] = useState<string>("/");
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(0); // command history index
  const [past, setPast] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastTabRef = useRef<{ prefix: string; time: number; matches: string[] }>({ prefix: "", time: 0, matches: [] });
  const [closed, setClosed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const prompt = useMemo(() => {
    return `chirag@human ${cwd} %`;
  }, [cwd]);

  const renderTree = () => {
    const parts = ["/", ...FILES];
    const lines: string[] = [];
    lines.push("/");
    parts.slice(1).forEach((f, i) => {
      const isLast = i === parts.length - 2;
      lines.push(`${isLast ? "└──" : "├──"} ${f}`);
    });
    return lines.join("\n");
  };

  const renderLs = (long = false) => {
    if (!long) return FILES.join("  ");
    const now = new Date();
    const pad = (s: string, n: number) => (s + " ".repeat(n)).slice(0, n);
    const fmt = (d: Date) =>
      d.toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(",", "");
    return FILES.map((f) => {
      const size = 256 + f.length * 7;
      return `-rw-r--r--  1 ${pad("chirag", 6)} ${pad("staff", 6)} ${size.toString().padStart(5, " ")} ${fmt(now)} ${f}`;
    }).join("\n");
  };

  useEffect(() => {
    // auto-scroll to bottom when history grows
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history.length]);

  useEffect(() => {
    // focus input when (re)opening and not minimized
    if (!closed && !minimized) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [closed, minimized, maximized]);

  const print = (items: Output[] | string, kind: "out" | "err" = "out") => {
    setHistory((h) => [
      ...h,
      ...(Array.isArray(items)
        ? items
        : items
            .split("\n")
            .map((line) => ({ type: kind, text: line }) as Output)),
    ]);
  };

  const handleCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setPast((p) => [...p, cmd]);
    setCursor(0);
    // echo the command
    setHistory((h) => [...h, { type: "out", text: `${prompt} ${cmd}` }]);

    const [name, ...args] = cmd.split(/\s+/);
  switch (name) {
      case "help": {
        print(
          [
            "Commands:",
            "  help                 Show this help",
      "  ls [-l]              List sections (long with -l)",
      "  tree                 Display sections as a tree",
      "  cat <file>           Print a section (try: cat all)",
            "  pwd                  Print working directory",
  "  open <section>       Scroll to a section (#quote | #timeline | #human | #library | #podcasts)",
      "  whoami               Show current user",
      "  date                 Show current date/time",
      "  rm -rf /             (easter egg)",
      "  clear                Clear the screen",
          ].join("\n"),
        );
        break;
      }
      case "pwd": {
        print(cwd);
        break;
      }
      case "ls": {
        const long = args.includes("-l");
        print(renderLs(long));
        break;
      }
      case "tree": {
        print(renderTree());
        break;
      }
      case "cat": {
        if (!args.length) {
          print("usage: cat <file>");
          break;
        }
        const target = args[0];
        const body = catFile(target);
        if (body == null) {
          print(`cat: ${target}: No such file or section`, "err");
        } else {
          print(body);
        }
        break;
      }
      case "man": {
        const topic = (args[0] || "").toLowerCase();
        if (!topic || topic === "human" || topic === "terminal") {
          print(
            [
              "HUMAN(1)                    User Commands                   HUMAN(1)",
              "",
              "NAME",
              "  human - textual rendition of this website",
              "",
              "SYNOPSIS",
              "  ls [-l] | tree | cat <file> | open <section> | pwd | whoami | date | clear",
              "",
              "FILES",
              `  ${FILES.join(" ")}`,
            ].join("\n"),
          );
        } else {
          print(`No manual entry for ${topic}`, "err");
        }
        break;
      }
      case "whoami": {
        print("chirag");
        break;
      }
      case "date": {
        print(new Date().toString());
        break;
      }
      case "rm": {
        const joined = args.join(" ");
        if (/\-rf/.test(joined)) {
          print(
            [
              "attempting superuser operation…",
              "access denied: this terminal is read-only.",
              "(nice try) 💾",
            ].join("\n"),
          );
        } else if (!args.length) {
          print("rm: missing operand");
        } else {
          print(`rm: cannot remove '${args[0]}': permission denied`, "err");
        }
        break;
      }
      case "open": {
        const target = (args[0] || "").toLowerCase();
        let selector = "";
        if (target.startsWith("#")) selector = target;
        else if (["quote", "quotes"].includes(target)) selector = "#quote";
        else if (["timeline", "time"].includes(target)) selector = "#timeline";
        else if (["human", "id", "hv", "verify"].includes(target)) selector = "#human";
        else if (["library", "books"].includes(target)) selector = "#library";
        else if (["podcasts", "podcast", "audio"].includes(target)) selector = "#podcasts";
  else if (["/", "home", "top"].includes(target)) selector = "body";
  else if (["hero"].includes(target)) selector = "#hero";
  else if (["terminal", "console", "shell"].includes(target)) selector = "#terminal";
  else if (["footer", "contact"].includes(target)) selector = "#footer";
        if (!selector) {
          print("usage: open <#anchor | quote | timeline | human | library | podcasts>");
          break;
        }
        const el = selector === "body" ? document.scrollingElement : (document.querySelector(selector) as HTMLElement | null);
        if (!el) {
          print(`open: cannot find ${selector}`, "err");
          break;
        }
        const top = selector === "body" ? 0 : el.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top, behavior: "smooth" });
        print(`opening ${selector} …`);
        break;
      }
      case "clear": {
        setHistory([]);
        break;
      }
      default: {
        print(`${name}: command not found. Type 'help'.`, "err");
      }
    }
  };

  const COMMANDS = useMemo(
    () => ["help", "ls", "tree", "cat", "pwd", "open", "whoami", "date", "rm", "man", "clear"],
    [],
  );

  const SECTION_SUGGESTIONS = useMemo(
    () => ["#hero", "#quote", "#timeline", "#terminal", "#human", "#library", "#podcasts", "#footer", "hero", "quote", "timeline", "terminal", "human", "library", "podcasts", "footer", "top", "home", "/"],
    [],
  );

  const FILE_SUGGESTIONS = useMemo(() => {
    const bases = [
      "hero",
      "quote",
      "timeline",
      "human",
      "hobbies",
      "library",
      "podcasts",
      "links",
      "all",
      "*",
      ".",
      "/",
    ];
    return Array.from(new Set([...FILES, ...bases]));
  }, []);

  const longestCommonPrefix = (arr: string[]): string => {
    if (!arr.length) return "";
    let prefix = arr[0];
    for (let i = 1; i < arr.length; i++) {
      const s = arr[i];
      let j = 0;
      while (j < prefix.length && j < s.length && prefix[j] === s[j]) j++;
      prefix = prefix.slice(0, j);
      if (!prefix) break;
    }
    return prefix;
  };

  const completeAtCursor = () => {
    const el = inputRef.current;
    if (!el) return;
    const caret = el.selectionStart ?? input.length;
    // find token boundaries
    let tokenStart = caret;
    while (tokenStart > 0 && input[tokenStart - 1] !== " ") tokenStart--;
    let tokenEnd = caret;
    while (tokenEnd < input.length && input[tokenEnd] !== " ") tokenEnd++;
    const prefix = input.slice(tokenStart, caret);
    const before = input.slice(0, tokenStart);
    const after = input.slice(tokenEnd);
    const tokensBefore = before.trim().length ? before.trim().split(/\s+/) : [];
    const tokenIndex = tokensBefore.length; // 0-based: current token position
    const firstToken = (input.trim().split(/\s+/)[0] ?? "").toLowerCase();

    // candidates
    let candidates: string[] = [];
    if (tokenIndex === 0) candidates = COMMANDS;
    else if (firstToken === "cat") candidates = FILE_SUGGESTIONS;
    else if (firstToken === "open") candidates = SECTION_SUGGESTIONS;
    else if (firstToken === "ls") candidates = ["-l"];
    else if (firstToken === "rm") candidates = ["-rf", "/"];
    else if (firstToken === "man") candidates = ["human", "terminal"];

    const matches = candidates.filter((c) => c.startsWith(prefix));
    const now = Date.now();

    if (matches.length === 0) return; // nothing to do

    if (matches.length === 1) {
      const comp = matches[0];
      const next = before + comp + (after.startsWith(" ") || after === "" ? "" : " ") + after;
      setInput(next);
      requestAnimationFrame(() => {
        const newPos = (before + comp).length;
        el.setSelectionRange(newPos, newPos);
      });
      lastTabRef.current = { prefix: comp, time: now, matches };
      return;
    }

    // multiple matches: try to extend to common prefix
    const lcp = longestCommonPrefix(matches);
    if (lcp && lcp.length > prefix.length) {
      const next = before + lcp + input.slice(caret); // preserve rest after caret
      setInput(next);
      requestAnimationFrame(() => {
        const newPos = (before + lcp).length;
        el.setSelectionRange(newPos, newPos);
      });
      lastTabRef.current = { prefix: lcp, time: now, matches };
      return;
    }

    // no further prefix extension -> if user double-tabs quickly, print options
    const last = lastTabRef.current;
    if (last.prefix === prefix && now - last.time < 600) {
      print(matches.join("  "));
    }
    lastTabRef.current = { prefix, time: now, matches };
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = input;
      setInput("");
      handleCommand(next);
    } else if (e.key === "Tab") {
      e.preventDefault();
      completeAtCursor();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (past.length === 0) return;
      const idx = cursor + 1;
      const val = past[past.length - idx];
      if (val != null) {
        setCursor(idx);
        setInput(val);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor <= 1) {
        setCursor(0);
        setInput("");
      } else {
        const idx = cursor - 1;
        const val = past[past.length - idx];
        setCursor(idx);
        setInput(val ?? "");
      }
    }
  };

  if (closed) {
    return (
      <section className="relative mx-auto max-w-3xl px-6 py-14">
        <button
          onClick={() => setClosed(false)}
          className="group mx-auto flex items-center justify-between w-full max-w-lg rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-left hover:border-slate-700"
          aria-label="Reopen terminal"
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] ring-1 ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] ring-1 ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] ring-1 ring-black/20" />
          </div>
          <div className="text-xs text-slate-400 font-mono">human — zsh (closed) • click to reopen</div>
          <div className="w-16" />
        </button>
      </section>
    );
  }

  const wrapperWidth = maximized ? "max-w-6xl" : "max-w-3xl";
  const contentVH = maximized ? "max-h-[70vh] min-h-[320px]" : "max-h-[420px] min-h-[260px]";

  return (
    <section id="terminal" className={`relative mx-auto ${wrapperWidth} px-6 py-14`}>
      {/* HUD grid backdrop and gentle fades to blend into page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 -top-1 h-8 bg-gradient-to-b from-transparent to-[#020617]/60 -z-10" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-10 bg-gradient-to-t from-[#020617] to-transparent -z-10" />

      <div className="relative">
        {/* soft glow */}
        {!minimized && (
          <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-sky-400/15 blur-2xl -z-10" />
        )}

        <div className={`rounded-xl border border-slate-800/70 bg-slate-900/60 backdrop-blur shadow-2xl overflow-hidden ${!minimized ? "moving-border" : ""}`}>
        {/* title bar */}
        <div
          className="flex items-center justify-between border-b border-slate-800/70 bg-slate-950/60 px-3 py-2 select-none"
          onDoubleClick={() => setMinimized((m) => !m)}
        >
          <div className="flex items-center gap-2 group">
            <button
              className="relative h-3 w-3 rounded-full bg-[#ff5f56] ring-1 ring-black/20 hover:brightness-110"
              aria-label="Close"
              onClick={() => setClosed(true)}
              title="Close"
            >
              <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100">
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
                  <path d="M3 3l6 6M9 3L3 9" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <button
              className="relative h-3 w-3 rounded-full bg-[#ffbd2e] ring-1 ring-black/20 hover:brightness-110"
              aria-label="Minimize"
              onClick={() => setMinimized((m) => !m)}
              title="Minimize"
            >
              <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100">
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
                  <rect x="2.5" y="5.2" width="7" height="1.6" rx="0.8" fill="#000" />
                </svg>
              </span>
            </button>
            <button
              className="relative h-3 w-3 rounded-full bg-[#27c93f] ring-1 ring-black/20 hover:brightness-110"
              aria-label="Toggle full size"
              onClick={() => setMaximized((x) => { if (!x) setMinimized(false); return !x; })}
              title="Zoom"
            >
              <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100">
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
                  <path d="M3 4h2M4 3v2" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                  <path d="M9 8H7M8 9V7" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                  <path d="M3 9l6-6" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
          <div className="text-xs text-slate-400 font-mono">human — zsh</div>
          <div className="w-16" />
        </div>

        {/* content */}
        {!minimized && (
          <div
            ref={containerRef}
            className={`${contentVH} overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 text-slate-200 selection:bg-sky-400/20`}
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div key={i} className={line.type === "err" ? "text-red-300" : undefined}>
                {line.text}
              </div>
            ))}
            {/* prompt */}
            <div className="flex items-center gap-2">
              <span className="text-sky-300">{prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                placeholder="help | ls -l | tree | cat all | open human | rm -rf /"
                aria-label="Terminal input"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
