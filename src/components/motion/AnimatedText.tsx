import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useReducedAfterMount } from './useReducedAfterMount';
import { charOpacity } from '../../lib/motion';

export default function AnimatedText({ text }: { text: string }) {
  const reduce = useReducedAfterMount();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  // SSR/no-hydration mantém o texto legível; a animação só assume depois do mount.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const chars = [...text];
  if (!ready || reduce) return (
    <p ref={ref} className="max-w-[560px] text-center font-medium leading-relaxed text-[var(--fg)]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>{text}</p>
  );
  return (
    <p ref={ref} className="max-w-[560px] text-center font-medium leading-relaxed text-[var(--fg)]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <Char key={i} progress={scrollYProgress} index={i} total={chars.length} ch={ch} />
      ))}
    </p>
  );
}

function Char({ progress, index, total, ch }: { progress: MotionValue<number>; index: number; total: number; ch: string }) {
  const opacity = useTransform(progress, (p: number) => charOpacity(p, index, total));
  return (
    <span className="relative inline">
      <span aria-hidden="true" style={{ opacity: 0 }}>{ch}</span>
      <motion.span aria-hidden="true" className="absolute inset-0" style={{ opacity }}>{ch}</motion.span>
    </span>
  );
}
