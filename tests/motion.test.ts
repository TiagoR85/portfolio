import { describe, it, expect } from 'vitest';
import { magnetOffset, charOpacity } from '../src/lib/motion';

describe('magnetOffset', () => {
  const rect = { x: 0, y: 0, width: 400, height: 400 }; // centro (200,200)
  it('sem mouse perto (fora do padding) retorna 0,0', () =>
    expect(magnetOffset({ mouseX: 5, mouseY: 5, rect, padding: 50, strength: 3 })).toEqual({ x: 0, y: 0 }));
  it('centro exato retorna 0,0', () =>
    expect(magnetOffset({ mouseX: 200, mouseY: 200, rect, padding: 150, strength: 3 })).toEqual({ x: 0, y: 0 }));
  it('mouse à direita do centro puxa x positivo proporcional ao strength', () => {
    const { x } = magnetOffset({ mouseX: 300, mouseY: 200, rect, padding: 150, strength: 4 });
    expect(x).toBeCloseTo(25, 5); // (300-200)/4
  });
});

describe('charOpacity', () => {
  it('progresso 0 deixa o primeiro caractere em 0.2', () => expect(charOpacity(0, 0, 100)).toBeCloseTo(0.2));
  it('progresso 1 deixa o último caractere em 1', () => expect(charOpacity(1, 99, 100)).toBeCloseTo(1));
  it('revela na ordem de leitura: caractere anterior fica mais opaco no mesmo progresso', () =>
    expect(charOpacity(0.5, 10, 100)).toBeGreaterThan(charOpacity(0.5, 50, 100)));
});
