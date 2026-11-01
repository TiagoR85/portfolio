import type { CSSProperties, ReactNode } from 'react';

// shortcut: stagger limitado a 150ms para o conteúdo não ficar invisível durante o delay (ver @starting-style em globals.css); subir se virar animação por scroll.
const MAX_DELAY = 0.15;

export default function FadeIn({ children, delay = 0, y = 30, x = 0, duration = 0.5, className }: {
  children: ReactNode; delay?: number; y?: number; x?: number; duration?: number; className?: string;
}) {
  const style = {
    '--fade-delay': `${Math.min(delay, MAX_DELAY)}s`,
    '--fade-y': `${y}px`,
    '--fade-x': `${x}px`,
    '--fade-duration': `${duration}s`,
  } as CSSProperties;
  return <div className={className ? `fade-in ${className}` : 'fade-in'} style={style}>{children}</div>;
}
