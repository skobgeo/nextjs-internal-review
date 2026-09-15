export type ClassValue = string | false | null | undefined;

/** Крошечный аналог clsx: соединяет классы и выкидывает пустые значения. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
