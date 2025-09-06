"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatSpec = { id: number; label: string; messages: string[] };

const CHATS: ChatSpec[] = [
  {
    id: 0,
    label: "Intro",
    messages: [
      "Hi there.",
      "I'm Chirag Bangera.",
      "I'm an engineer working on simulations.",
    ],
  },
  {
    id: 1,
    label: "Why Human",
    messages: [
      "Why 'Human.'?",
      "Because lately, it feels like the world only talks about AI — what it can do, what it might replace.",
      "But the point isn’t to replace humans. It’s to amplify us.",
      "AI accelerates progress, and human imagination gives it meaning and direction.",
      "That’s how we create abundance — together.",
      "This site is a reflection of that: built by me, with help from AI.",
      "Enjoy exploring, and know that I'll keep building.",
    ],
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<number>(0);
  const [display, setDisplay] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const fullText = useMemo(() => CHATS[activeChat].messages.join("\n"), [activeChat]);

  useEffect(() => {
    // Auto-open shortly after mount
    const t = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setDisplay("");
      setIsTyping(false);
      if (typingRef.current) clearTimeout(typingRef.current);
      return;
    }

    // typewriter effect for the selected chat
    if (typingRef.current) clearTimeout(typingRef.current);
    setDisplay("");
    setIsTyping(true);
    let i = 0;
    const type = () => {
      setDisplay(fullText.slice(0, i));
      if (i < fullText.length) {
        const ch = fullText[i];
        const delay = ch === "\n" ? 450 : 26 + Math.random() * 60; // pause on breaks
        i += 1;
        typingRef.current = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        // Auto-advance or close after finishing
        if (activeChat === 0) {
          typingRef.current = setTimeout(() => {
            setActiveChat(1);
          }, 650);
        } else {
          typingRef.current = setTimeout(() => {
            setOpen(false);
          }, 1200);
        }
      }
    };
    type();

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [open, fullText, activeChat]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Floating button */}
      <div className="pointer-events-auto absolute bottom-5 right-5">
        <button
          aria-label={open ? "Close chat" : "Open chat"}
          onClick={() => setOpen((v) => !v)}
          className="group h-12 w-12 rounded-full bg-gradient-to-b from-sky-400 to-sky-500 shadow-lg shadow-sky-500/25 ring-1 ring-white/10 flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-transform"
        >
          {/* Chat icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
          </svg>
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-auto absolute bottom-20 right-5 w-[min(92vw,360px)]"
          >
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 backdrop-blur p-4 shadow-[0_8px_40px_-12px_rgba(2,132,199,0.35)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-300/90">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider">Chat</span>
                  <span className="text-[10px] rounded bg-sky-500/10 text-sky-300/90 px-2 py-0.5 border border-sky-500/20">
                    {CHATS[activeChat].label}
                  </span>
                </div>
                <div className="inline-flex rounded-lg bg-slate-800/60 p-0.5 ring-1 ring-white/10">
                  {CHATS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChat(c.id)}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                        activeChat === c.id
                          ? "bg-slate-700/80 text-slate-100"
                          : "text-slate-300/70 hover:text-slate-200"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed">
                {display}
                <span className={`ml-0.5 align-baseline ${isTyping ? "inline-block w-2 h-4 bg-sky-300/80 animate-caret" : "hidden"}`} />
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
