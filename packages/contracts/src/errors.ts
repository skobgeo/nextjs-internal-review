import { z } from 'zod';

/**
 * Единый формат ошибки API. Для 422 заполняется `errors` — по одной записи на поле,
 * чтобы фронт мог разложить сообщения по инпутам (см. задание S3-04).
 */
export const fieldErrorSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  errors: z.array(fieldErrorSchema).optional(),
});

export type FieldError = z.infer<typeof fieldErrorSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

/** Превращает список ошибок полей в словарь `{ поле: [сообщения] }`. */
export function toFieldErrorMap(errors: readonly FieldError[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const { path, message } of errors) {
    const bucket = result[path];
    if (bucket) {
      bucket.push(message);
    } else {
      result[path] = [message];
    }
  }

  return result;
}
