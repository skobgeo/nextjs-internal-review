import 'server-only';

import { unwrapOr } from '@repo/contracts';

import { apiGet } from './client';
import { experimentsSchema, type Experiment } from './schemas';

/**
 * Конфиг экспериментов меняется редко и одинаков для всех — его можно держать
 * в кэше долго. Бакет считается уже на его основе, локально.
 */
export async function getExperiments(): Promise<Experiment[]> {
  const result = await apiGet('/api/experiments', {
    schema: experimentsSchema,
    tags: ['experiments'],
    revalidate: 3600,
  });

  return unwrapOr(result, []);
}

export async function getExperiment(key: string): Promise<Experiment | null> {
  const experiments = await getExperiments();

  return experiments.find((experiment) => experiment.key === key) ?? null;
}
