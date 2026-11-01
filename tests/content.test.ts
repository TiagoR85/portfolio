import { describe, it, expect } from 'vitest';
import { projectSchema } from '../src/content/schema';

const valid = {
  title: 'jobforge', category: 'sistema', order: 1, summary: 'Orquestração de jobs',
  problem: 'Execução de jobs agendados sem perda.', stack: ['.NET 10', 'Kafka'],
  repo: 'https://github.com/TiagoR85/jobforge-orchestrator',
  prints: [{ src: '/img/prints/jobforge-ui-1.avif', alt: 'Console de jobs' }],
  diagram: '/img/diagrams/jobforge.svg', takeaways: ['Outbox transacional'],
};

describe('projectSchema', () => {
  it('aceita projeto válido', () => expect(projectSchema.safeParse(valid).success).toBe(true));
  it('rejeita categoria desconhecida', () => expect(projectSchema.safeParse({ ...valid, category: 'outro' }).success).toBe(false));
  it('rejeita stack vazia', () => expect(projectSchema.safeParse({ ...valid, stack: [] }).success).toBe(false));
  it('rejeita print sem alt', () => expect(projectSchema.safeParse({ ...valid, prints: [{ src: '/img/prints/x.avif' }] }).success).toBe(false));
  it('rejeita repo que não é URL https', () => expect(projectSchema.safeParse({ ...valid, repo: 'http://github.com/x' }).success).toBe(false));
});
