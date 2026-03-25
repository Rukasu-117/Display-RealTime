import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
        <h2
          className="text-2xl font-semibold text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          {title}
        </h2>

        {description ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}

        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
