"use client";
import { motion } from "framer-motion";

export default function Blogs({ id = "blogs" }: { id?: string }) {
	return (
		<section id={id} className="relative mx-auto max-w-6xl px-6 py-20">
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

			<h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-tight">Blog</h2>

					<motion.div
				initial={{ opacity: 0, y: 12 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.25 }}
				transition={{ duration: 0.4 }}
						className="relative rounded-xl border border-slate-800/70 bg-slate-900/40 backdrop-blur p-6 md:p-8 overflow-hidden"
			>
                
				{/* corner brackets */}
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-sky-300/40" />
					<div className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-sky-300/30" />
				</div>

				{/* top scan line */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

				<div className="flex items-start justify-between gap-6">
					<div className="min-w-0">
						<div className="inline-flex items-center gap-2">
							<span className="text-sky-200/90 font-mono uppercase tracking-widest text-[10px] px-2 py-1 rounded border border-sky-400/25 bg-sky-400/10">Status</span>
							<span className="text-sky-100/90 text-xs">Top Secret / Coming Soon</span>
						</div>
						<h3 className="mt-3 text-white text-xl md:text-2xl font-semibold tracking-tight">Why “Human”?</h3>

						{/* teaser with caret */}
						<p className="mt-2 text-slate-300/90 leading-relaxed">
							AI is everywhere — but the point isn’t replacement. It’s partnership.
							<span className="animate-caret ml-1">|</span>
						</p>

						{/* redaction bars */}
						<div className="mt-4 space-y-2" aria-label="Redacted content">
							<div className="h-4 rounded bg-slate-800/80" />
							<div className="h-4 w-11/12 rounded bg-slate-800/80" />
							<div className="h-4 w-2/3 rounded bg-slate-800/80" />
						</div>

						{/* coming soon footer */}
						<div className="mt-5 inline-flex items-center gap-2 text-sky-300/90 text-sm">
							<span>Decrypt scheduled</span>
							<svg
								className="h-4 w-4 animate-spin-slow"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
							>
								<circle cx="12" cy="12" r="9" className="opacity-30" />
								<path d="M21 12a9 9 0 0 0-9-9" />
							</svg>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}

