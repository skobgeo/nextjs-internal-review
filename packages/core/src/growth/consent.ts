export const CONSENT_COOKIE = 'lumen_consent';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  readonly granted: readonly ConsentCategory[];
  readonly updatedAt: string;
}

const KNOWN: readonly ConsentCategory[] = ['necessary', 'analytics', 'marketing'];

/** Технические куки не требуют согласия, остальное — требует. */
export function canTrack(state: ConsentState | null, category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  return state?.granted.includes(category) ?? false;
}

export function parseConsentCookie(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));

    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as { granted?: unknown; updatedAt?: unknown };

    if (!Array.isArray(candidate.granted) || typeof candidate.updatedAt !== 'string') return null;

    const granted = candidate.granted.filter((item): item is ConsentCategory =>
      KNOWN.includes(item as ConsentCategory),
    );

    return { granted, updatedAt: candidate.updatedAt };
  } catch {
    return null;
  }
}

export function serializeConsentCookie(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}
