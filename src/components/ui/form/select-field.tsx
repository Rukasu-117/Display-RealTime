import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const selectId = id ?? props.name ?? label;
  const selectClasses = [
    "w-full rounded-md border bg-[#10161C] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors",
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
        htmlFor={selectId}
        className="block text-sm font-medium text-[var(--color-text-muted)]"
      >
        {label}
      </label>

      <select id={selectId} className={selectClasses} {...props}>
        {children}
      </select>

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
