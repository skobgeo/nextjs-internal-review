/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * [T-04] Состояние формы обратной связи: то, что Server Action возвращает
 * в `useActionState`.
 *
 * Написано «на потом»: три поля из четырёх — `any`, `status` — любая строка.
 * Из-за этого компонент формы обращается к `state.fieldErrors.email[0]`,
 * а действие складывает туда массив, и компилятор об этом молчит.
 *
 * Задача: сделать тип честным и переиспользуемым —
 *  - `status` — объединение литералов;
 *  - `fieldErrors` — сообщения по именам полей формы (`Partial<Record<TField, string[]>>`),
 *    где имена полей выводятся из `leadInputSchema`, а не перечисляются руками;
 *  - `values` — что пользователь ввёл, чтобы не терять при ошибке;
 *  - `formError` — не произвольный текст сервера, а код (`'network' | 'rate-limited' | 'server'`),
 *    который компонент превращает в понятное сообщение.
 * Форма заявки — не последняя форма на сайте: подумайте, что здесь общее (`FormState<TField>`),
 * а что специфично для неё.
 */
export interface ContactFormState {
  status: string;
  fieldErrors: any;
  formError?: any;
  values?: any;
}

export const initialContactState: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
};
