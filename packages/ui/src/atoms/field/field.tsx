import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import { cx } from '../../lib/cx';
import styles from './field.module.css';

/**
 * Атомы формы. Они уже умеют сообщать о невалидности через `aria-invalid`,
 * но пользоваться этим должен вызывающий код — см. задание S2-04.
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return <input className={cx(styles.control, className)} aria-invalid={invalid || undefined} {...rest} />;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly invalid?: boolean;
}

export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cx(styles.control, styles.textarea, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly invalid?: boolean;
}

export function Select({ invalid, className, children, ...rest }: SelectProps) {
  return (
    <select className={cx(styles.control, className)} aria-invalid={invalid || undefined} {...rest}>
      {children}
    </select>
  );
}

export function Checkbox({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={cx(styles.checkbox, className)} {...rest} />;
}

export function CheckboxRow({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.checkboxRow, className)} {...rest}>
      {children}
    </div>
  );
}

export function Label({ className, children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cx(styles.label, className)} {...rest}>
      {children}
    </label>
  );
}

export function FieldHint({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cx(styles.hint, className)} {...rest}>
      {children}
    </p>
  );
}

export function FieldError({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cx(styles.error, className)} {...rest}>
      {children}
    </p>
  );
}
