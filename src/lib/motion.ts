export function magnetOffset({ mouseX, mouseY, rect, padding, strength }: {
  mouseX: number; mouseY: number; rect: { x: number; y: number; width: number; height: number };
  padding: number; strength: number;
}) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  // Ativa apenas dentro do raio `padding` ao redor do centro do elemento.
  const inside = mouseX > cx - padding && mouseX < cx + padding
    && mouseY > cy - padding && mouseY < cy + padding;
  if (!inside) return { x: 0, y: 0 };
  return { x: (mouseX - cx) / strength, y: (mouseY - cy) / strength };
}

// revela na ordem de leitura: caracteres anteriores chegam a 1 primeiro
export function charOpacity(progress: number, index: number, total: number) {
  const local = Math.min(Math.max(progress * total - index, 0), 1);
  return 0.2 + 0.8 * local;
}
