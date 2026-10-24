import { useEffect, useRef, useState, type ReactNode } from 'react';
import { magnetOffset } from '../../lib/motion';

// shortcut: o magnet é resposta direta ao cursor (não animação automática), então
// permanece ativo mesmo com prefers-reduced-motion; só o easing encurta.
// Listener no window: o efeito acompanha o cursor até `padding` px do centro da foto,
// não só quando o ponteiro está sobre ela.
const MAX_OFFSET = 34;

export default function Magnet({ children, padding = 320, strength = 5 }: { children: ReactNode; padding?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));

  useEffect(() => {
    const reset = () => { setActive(false); setPos({ x: 0, y: 0 }); };
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const next = magnetOffset({ mouseX: e.clientX, mouseY: e.clientY, rect: el.getBoundingClientRect(), padding, strength });
      const x = clamp(next.x); const y = clamp(next.y);
      setActive(next.x !== 0 || next.y !== 0);
      setPos((p) => (p.x === x && p.y === y ? p : { x, y }));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', reset);
    };
  }, [padding, strength]);

  return (
    <div ref={ref} style={{ willChange: 'transform' }}>
      <div style={{
        transform: `translate3d(${pos.x}px,${pos.y}px,0)`,
        transition: active ? 'transform .28s cubic-bezier(.22,.61,.36,1)' : 'transform .45s cubic-bezier(.22,.61,.36,1)',
      }}>
        {children}
      </div>
    </div>
  );
}
