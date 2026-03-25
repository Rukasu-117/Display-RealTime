import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <h1
          className="text-3xl font-semibold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          {title}
        </h1>

        {description ? (
          <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}
