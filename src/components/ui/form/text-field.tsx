import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name ?? label;
  const inputClasses = [
    "w-full rounded-md border bg-[#10161C] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)]",
    error
      ? "border-red-500 focus:border-red-400"
      : "border-[var(--color-border)] focus:border-[var(--color-accent)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--color-text-muted)]"
      >
        {label}
      </label>

      <input id={inputId} className={inputClasses} {...props} />

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
