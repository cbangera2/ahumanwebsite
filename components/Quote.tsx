"use client";
import { motion } from "framer-motion";

type QuoteProps = {
	text?: string;
	author?: string;
	className?: string;
	id?: string;
};

export default function Quote({
	text = "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.",
	author = "Albert Camus",
	className = "",
	id = "quote",
}: QuoteProps) {
	return (
		<section id={id} className={`relative px-6 py-24 md:py-32 bg-[#020617] ${className}`}>
			{/* Smooth color bridge from hero into quote */}
			<div className="pointer-events-none absolute inset-x-0 -top-8 h-24 bg-gradient-to-b from-[#020617] via-[#081022]/70 to-transparent" />

			{/* Subtle background glow */}
			<div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />
			{/* Gentle fade into the next section */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#020617] to-transparent" />

			<motion.figure
				initial={{ opacity: 0, y: 12 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="quote-section mx-auto max-w-3xl rounded-2xl border border-slate-800/70 bg-slate-900/30 p-8 md:p-12 shadow-[0_10px_40px_-18px_rgba(2,132,199,0.22)] backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:shadow-sky-400/30 hover:shadow-2xl"
			>
				{/* Decorative opening quote */}
				<div className="mb-4 flex justify-center" aria-hidden>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/15 ring-1 ring-sky-400/25">
						<span className="text-2xl leading-none text-sky-300">“</span>
					</div>
				</div>

				<blockquote className="quote-block text-center text-xl md:text-2xl leading-relaxed text-slate-200/95 italic">
					{text}
				</blockquote>
				<figcaption className="quote-author mt-6 text-center text-sm text-slate-400/90">
					— {author}
				</figcaption>
			</motion.figure>
		</section>
	);
}
