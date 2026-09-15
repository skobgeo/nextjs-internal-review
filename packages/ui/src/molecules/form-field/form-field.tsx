import type { ReactNode } from 'react';

import { FieldError, FieldHint, Label } from '../../atoms/field/field';
import { cx } from '../../lib/cx';
import styles from './form-field.module.css';

export interface FormFieldRenderProps {
  readonly id: string;
  readonly invalid: boolean;
  readonly 'aria-describedby': string | undefined;
  readonly required: boolean;
}

export interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly className?: string;
  /**
   * Контрол получает готовые `id`, `aria-describedby` и `aria-invalid` —
   * связывать подпись, подсказку и ошибку руками не нужно.
   */
  readonly children: (props: FormFieldRenderProps) => ReactNode;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      {children({
        id,
        invalid: Boolean(error),
        'aria-describedby': describedBy,
        required,
      })}

      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
