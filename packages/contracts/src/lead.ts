import { z } from 'zod';

export const LEAD_BUDGETS = ['unknown', 'lt10k', '10k-50k', 'gt50k'] as const;

export type LeadBudget = (typeof LEAD_BUDGETS)[number];

/**
 * Схема формы обратной связи. Одна и та же схема используется и в Server Action
 * на фронте, и в обработчике `POST /api/leads` на бэкенде — см. задание T-04.
 * Сообщения об ошибках человекочитаемые: их показывают пользователю как есть.
 */
export const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters.').max(80, 'That name is too long.'),
  email: z.email('This does not look like an email address.').max(160, 'That email is too long.'),
  company: z.string().trim().max(120, 'That company name is too long.').optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'Please describe your case in at least 20 characters.')
    .max(2000, 'Please keep the message under 2000 characters.'),
  budget: z.enum(LEAD_BUDGETS, 'Please pick one of the budget options.').default('unknown'),
  consent: z.preprocess(
    (value) => value === true || value === 'on' || value === 'true',
    z.literal(true, 'We need your consent to reply.'),
  ),
  /** Honeypot: люди это поле не видят, боты — заполняют. */
  website: z.string().max(0, 'This field must stay empty.').optional().or(z.literal('')),
});

export type LeadInput = z.input<typeof leadInputSchema>;
export type LeadPayload = z.output<typeof leadInputSchema>;

export const leadCreatedSchema = z.object({
  id: z.number().int(),
  created_at: z.string(),
});

export type LeadCreated = z.infer<typeof leadCreatedSchema>;
