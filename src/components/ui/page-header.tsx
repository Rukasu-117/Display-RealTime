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
    <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-5 shadow-[0_16px_36px_rgba(4,10,18,0.15)] backdrop-blur-xl md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Workspace
        </p>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          {title}
        </h2>

        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}
