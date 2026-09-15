import { z } from 'zod';

import { localeSchema } from './locale';

/**
 * Схема формы обратной связи. Одна и та же схема используется и в Server Action
 * на фронте, и в обработчике `POST /api/leads` на бэкенде — см. задание S3-04.
 */
export const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'validation.name.min').max(80, 'validation.name.max'),
  email: z.email('validation.email.invalid').max(160, 'validation.email.max'),
  company: z.string().trim().max(120, 'validation.company.max').optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'validation.message.min')
    .max(2000, 'validation.message.max'),
  budget: z.enum(['unknown', 'lt10k', '10k-50k', 'gt50k']).default('unknown'),
  consent: z
    .union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('false')])
    .transform((value) => value === true || value === 'on' || value === 'true')
    .refine((value) => value === true, 'validation.consent.required'),
  locale: localeSchema.default('en'),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  pagePath: z.string().max(255).optional(),
  /** Honeypot: люди это поле не видят, боты — заполняют. */
  website: z.string().max(0, 'validation.website.bot').optional().or(z.literal('')),
});

export type LeadInput = z.input<typeof leadInputSchema>;
export type LeadPayload = z.output<typeof leadInputSchema>;

export const leadCreatedSchema = z.object({
  id: z.number().int(),
  score: z.number().int(),
  created_at: z.string(),
});

export type LeadCreated = z.infer<typeof leadCreatedSchema>;
