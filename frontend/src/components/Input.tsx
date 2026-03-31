import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({ label, error, className = "", ...rest }: Props) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <input className={`form-control ${className}`.trim()} {...rest} />
      {error ? <span className="form-error">{error}</span> : null}
    </label>
  );
}
