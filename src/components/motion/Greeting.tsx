import { useEffect, useState } from 'react';

type Item = { lang: string; text: string };
type Period = 'morning' | 'afternoon' | 'evening';

// 12 idiomas na escrita nativa; ru = russo, sw = suaíli (África Oriental).
const GREETINGS: Record<Period, Item[]> = {
  morning: [
    { lang: 'pt-BR', text: 'Bom dia' },
    { lang: 'es', text: 'Buenos días' },
    { lang: 'it', text: 'Buongiorno' },
    { lang: 'fr', text: 'Bonjour' },
    { lang: 'en', text: 'Good morning' },
    { lang: 'de', text: 'Guten Morgen' },
    { lang: 'ru', text: 'Доброе утро' },
    { lang: 'zh', text: '早上好' },
    { lang: 'ja', text: 'おはよう' },
    { lang: 'ko', text: '좋은 아침' },
    { lang: 'sv', text: 'God morgon' },
    { lang: 'sw', text: 'Habari za asubuhi' },
  ],
  afternoon: [
    { lang: 'pt-BR', text: 'Boa tarde' },
    { lang: 'es', text: 'Buenas tardes' },
    { lang: 'it', text: 'Buon pomeriggio' },
    { lang: 'fr', text: 'Bon après-midi' },
    { lang: 'en', text: 'Good afternoon' },
    { lang: 'de', text: 'Guten Tag' },
    { lang: 'ru', text: 'Добрый день' },
    { lang: 'zh', text: '下午好' },
    { lang: 'ja', text: 'こんにちは' },
    { lang: 'ko', text: '좋은 오후' },
    { lang: 'sv', text: 'God eftermiddag' },
    { lang: 'sw', text: 'Habari za mchana' },
  ],
  evening: [
    { lang: 'pt-BR', text: 'Boa noite' },
    { lang: 'es', text: 'Buenas noches' },
    { lang: 'it', text: 'Buonasera' },
    { lang: 'fr', text: 'Bonsoir' },
    { lang: 'en', text: 'Good evening' },
    { lang: 'de', text: 'Guten Abend' },
    { lang: 'ru', text: 'Добрый вечер' },
    { lang: 'zh', text: '晚上好' },
    { lang: 'ja', text: 'こんばんは' },
    { lang: 'ko', text: '좋은 저녁' },
    { lang: 'sv', text: 'God kväll' },
    { lang: 'sw', text: 'Habari za jioni' },
  ],
};

function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

const TYPE_MS = 62;
const HOLD_MS = 1700;
const DELETE_MS = 26;

// Kanit não cobre CJK nem cirílico: o fallback do sistema resolve.
const FONT_STACK = "'Kanit', 'Noto Sans', 'Segoe UI', system-ui, sans-serif";

export default function Greeting() {
  // SSR: primeira saudação completa (sem animação em tela sem JS).
  const [list, setList] = useState<Item[]>(GREETINGS.morning);
  const [idx, setIdx] = useState(0);
  const [len, setLen] = useState(GREETINGS.morning[0].text.length);
  const [phase, setPhase] = useState<'hold' | 'deleting' | 'typing' | 'swap'>('hold');

  useEffect(() => {
    const items = GREETINGS[periodOf(new Date().getHours())];
    setList(items);
    setIdx(0);
    setLen(items[0].text.length);
    setPhase('hold');
  }, []);

  useEffect(() => {
    if (!list.length) return;
    const current = list[idx]?.text ?? '';

    // shortcut: digitação é conteúdo (não decoração); mantida mesmo com
    // prefers-reduced-motion — só o cursor perde o pulso.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'hold') t = setTimeout(() => setPhase('deleting'), HOLD_MS);
    else if (phase === 'deleting') {
      t = setTimeout(() => (len > 0 ? setLen(len - 1) : setPhase('swap')), DELETE_MS);
    } else if (phase === 'swap') {
      t = setTimeout(() => {
        const next = (idx + 1) % list.length;
        setIdx(next);
        setLen(0);
        setPhase('typing');
      }, 160);
    } else {
      t = setTimeout(() => (len < current.length ? setLen(len + 1) : setPhase('hold')), TYPE_MS);
    }
    return () => clearTimeout(t);
  }, [phase, len, idx, list]);

  const item = list[idx];
  const text = (item?.text ?? '').slice(0, len);

  return (
    <span className="inline-flex items-baseline" style={{ fontFamily: FONT_STACK }}>
      <span lang={item?.lang ?? 'pt-BR'}>{text}</span>
      <span aria-hidden="true"
        className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] bg-[var(--accent)] motion-safe:animate-pulse" />
      <span className="sr-only">{list.map((l) => l.text).join(', ')}</span>
    </span>
  );
}
