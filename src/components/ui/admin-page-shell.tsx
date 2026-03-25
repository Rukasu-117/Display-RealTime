import type { ReactNode } from "react";
import Link from "next/link";

export interface AdminNavItem {
  href: string;
  label: string;
  active?: boolean;
}

interface AdminPageShellProps {
  children: ReactNode;
  navItems?: AdminNavItem[];
  brandTitle?: string;
  brandSubtitle?: string;
  sidebarFooter?: ReactNode;
  contentClassName?: string;
}

export function AdminPageShell({
  children,
  navItems = [],
  brandTitle = "Display Demo",
  brandSubtitle,
  sidebarFooter,
  contentClassName,
}: AdminPageShellProps) {
  const contentClasses = [
    "flex min-h-screen flex-1 flex-col gap-8 px-6 py-8 md:px-10 md:py-10 lg:px-12",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)] lg:flex">
      <aside className="flex w-full flex-col border-b border-[var(--color-border)] bg-[var(--color-sidebar)] px-5 py-6 lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="space-y-1">
          <Link
            href="/admin/displays"
            className="block text-sm font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            {brandTitle}
          </Link>

          {brandSubtitle ? (
            <p className="text-xs text-[var(--color-text-muted)]">
              {brandSubtitle}
            </p>
          ) : null}
        </div>

        {navItems.length > 0 ? (
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => {
              const itemClasses = [
                "rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-[rgba(255,138,31,0.14)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
              ].join(" ");

              return (
                <Link key={item.href} href={item.href} className={itemClasses}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {sidebarFooter ? <div className="mt-auto pt-8">{sidebarFooter}</div> : null}
      </aside>

      <main className={contentClasses}>{children}</main>
    </div>
  );
}
