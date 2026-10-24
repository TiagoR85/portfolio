import { useEffect, useState } from 'react';

type Accent = { id: string; label: string; accent: string; tie: string };
export const accents: Accent[] = [
  { id: 'gelo', label: 'Gelo', accent: '#97a5b4', tie: '' },
  { id: 'magenta', label: 'Magenta', accent: '#ec5bc9', tie: '#d61bb0' },
  { id: 'ambar', label: 'Âmbar', accent: '#c98a1a', tie: '#e0a526' },
  { id: 'esmeralda', label: 'Esmeralda', accent: '#1a9c72', tie: '#17a97a' },
  { id: 'violeta', label: 'Violeta', accent: '#a08cff', tie: '#7a5af8' },
  { id: 'ciano', label: 'Ciano', accent: '#1f9fc9', tie: '#1f9fc9' },
];

const ACCENT_KEY = 'portfolio-accent';

function applyAccent(opt: Accent) {
  const root = document.documentElement;
  root.style.setProperty('--accent', opt.accent);
  root.style.setProperty('--accent-tie', opt.tie || 'transparent');
  root.dataset.accent = opt.id;
  localStorage.setItem('portfolio-accent-color', opt.accent);
  localStorage.setItem('portfolio-tie', opt.tie || 'transparent');
}

export default function AccentPicker() {
  const [accent, setAccent] = useState('gelo');

  useEffect(() => {
    const savedAccent = accents.find((a) => a.id === localStorage.getItem(ACCENT_KEY)) ?? accents[0];
    setAccent(savedAccent.id);
    applyAccent(savedAccent);
  }, []);

  const pickAccent = (opt: Accent) => {
    setAccent(opt.id);
    applyAccent(opt);
    localStorage.setItem(ACCENT_KEY, opt.id);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-light uppercase tracking-widest text-[var(--fg)]/60">cor</span>
      <ul className="flex flex-col items-center gap-2" role="list">
        {accents.map((a) => (
          <li key={a.id}>
            <button type="button" data-accent={a.id} onClick={() => pickAccent(a)} aria-label={`Cor ${a.label}`}
              aria-pressed={accent === a.id}
              className="h-5 w-5 rounded-full border transition-transform duration-200 hover:scale-110"
              style={{
                background: a.tie || 'linear-gradient(135deg,#646973,#bbccd7)',
                borderColor: accent === a.id ? 'var(--fg)' : 'color-mix(in oklab, var(--fg) 28%, transparent)',
                boxShadow: accent === a.id ? '0 0 0 3px color-mix(in oklab, var(--accent) 35%, transparent)' : 'none',
              }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
