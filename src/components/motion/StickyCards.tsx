import { useScroll, useTransform, motion } from 'framer-motion';
import { useReducedAfterMount } from './useReducedAfterMount';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';

type Card = { slug: string; repo: string; title: string; category: string; summary: string; stack: string[]; takeaway: string; print: string | null; printAlt: string };

export default function StickyCards({ projects }: { projects: Card[] }) {
  const container = useRef<HTMLDivElement>(null);
  const reduce = useReducedAfterMount();
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });
  return (
    <div ref={container} className="flex flex-col gap-6 px-5 sm:px-8 md:px-10">
      {projects.map((p, i) => (
        <Card key={p.slug} p={p} i={i} total={projects.length} progress={scrollYProgress} reduce={!!reduce} />
      ))}
    </div>
  );
}

function Card({ p, i, total, progress, reduce }: { p: Card; i: number; total: number; progress: MotionValue<number>; reduce: boolean }) {
  const targetScale = 1 - (total - 1 - i) * 0.03;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const counter = `${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
  return (
    <div className="sticky top-24 h-[52vh] min-h-[340px] md:top-32">
      <motion.article style={{ scale: reduce ? 1 : scale, top: i * 16 }}
        className={`relative grid h-full gap-5 overflow-hidden rounded-[var(--radius-card)] border-2 border-[var(--fg)] bg-[var(--bg)] p-5 sm:p-8 md:items-stretch md:gap-10 md:p-10 ${p.print ? 'md:grid-cols-2' : ''}`}>
        <div className="flex min-w-0 flex-col justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-[var(--fg)]/60">{counter}</span>
            <span className="text-[11px] uppercase tracking-widest text-[var(--fg)]/60">{p.category}</span>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium uppercase leading-[1.05] text-[var(--fg)]" style={{ fontSize: 'clamp(1.5rem, 3.1vw, 2.4rem)' }}>{p.title}</h3>
            <p className="max-w-[46ch] font-light leading-relaxed text-[var(--fg)]/75" style={{ fontSize: 'clamp(.9rem, 1.2vw, 1.1rem)' }}>{p.takeaway}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full border border-[var(--fg)]/25 px-2.5 py-1 text-[11px] uppercase tracking-widest text-[var(--fg)]/70">{s}</span>
            ))}
            <a href={`/projetos/${p.slug}`} aria-label={`Ver projeto ${p.title}`}
              className="ml-1 w-fit text-xs text-[var(--fg)] underline decoration-[var(--fg)]/30 underline-offset-4 transition-colors hover:decoration-[var(--fg)]">Ver projeto →</a>
            <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`Repositório GitHub de ${p.title}`}
              className="ml-1 w-fit text-xs text-[var(--fg)] underline decoration-[var(--fg)]/30 underline-offset-4 transition-colors hover:decoration-[var(--fg)]">GitHub ↗</a>
          </div>
        </div>
        {p.print && (
          <div className="hidden h-full min-h-0 md:block">
            <img src={p.print} alt={p.printAlt} width={1280} height={800} loading="lazy"
              className="h-full w-full rounded-[var(--radius-tile)] object-cover object-top" />
          </div>
        )}
      </motion.article>
    </div>
  );
}
