import { z } from 'astro/zod';

export const projectSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['sistema', 'devops', 'estudo']),
  order: z.number().int().positive(),
  summary: z.string().min(10),
  problem: z.string().min(20),
  stack: z.array(z.string()).min(1),
  repo: z.url().startsWith('https://'),
  prints: z.array(z.object({ src: z.string().startsWith('/img/'), alt: z.string().min(5) })),
  diagram: z.string().startsWith('/img/'),
  takeaways: z.array(z.string().min(5)).min(1),
});

export type Project = z.infer<typeof projectSchema>;
