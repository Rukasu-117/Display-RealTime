import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Building2, PanelLeftOpen, ShieldCheck } from "lucide-react";
import { AdminTopbar } from "@/components/ui/admin-topbar";
import { authOptions } from "@/lib/auth/config";

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
  pageTitle?: string;
  pageSubtitle?: string;
  topbarContent?: ReactNode;
  sidebarFooter?: ReactNode;
  contentClassName?: string;
}

export async function AdminPageShell({
  children,
  navItems = [],
  brandTitle = "Riopae Nexus",
  brandSubtitle,
  pageTitle,
  pageSubtitle,
  topbarContent,
  sidebarFooter,
  contentClassName,
}: AdminPageShellProps) {
  const session = await getServerSession(authOptions);
  const user = {
    name: session?.user?.name || "Usuário administrativo",
    email: session?.user?.email || null,
  };

  const contentClasses = [
    "flex min-h-screen flex-1 flex-col gap-6 px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(33,66,110,0.28),transparent_30%),linear-gradient(180deg,#060D18_0%,#0C1522_100%)] text-[var(--color-text)] lg:flex">
      <aside className="glass-sidebar flex w-full flex-col border-b border-[rgba(255,255,255,0.08)] px-5 py-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF922F_0%,#F36F12_100%)] text-white shadow-[0_12px_28px_rgba(243,111,18,0.22)]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/admin/displays"
                      className="block text-base font-semibold text-white"
                      style={{ fontFamily: "var(--font-heading), sans-serif" }}
                    >
                      {brandTitle}
                    </Link>
                    {brandSubtitle ? (
                      <p className="text-xs text-[var(--color-text-muted)]">{brandSubtitle}</p>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,146,47,0.16)] bg-[rgba(255,146,47,0.08)] px-3 py-1 text-[11px] font-medium text-[#FFC18A]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Ambiente autenticado via LDAP
                  </div>
                  <p className="max-w-xs text-xs leading-6 text-[var(--color-text-muted)]">
                    Gerencie displays e conteúdos com uma superfície operacional segura e preparada para expansão futura.
                  </p>
                </div>
              </div>
              <div className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-muted)] lg:flex">
                <PanelLeftOpen className="h-4 w-4" />
              </div>
            </div>
          </div>

          {navItems.length > 0 ? (
            <nav className="space-y-3">
              <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Navegação
              </div>
              <div className="space-y-2 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3 backdrop-blur-xl">
            {navItems.map((item) => {
              const itemClasses = [
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                item.active
                  ? "bg-[linear-gradient(90deg,rgba(255,146,47,0.18)_0%,rgba(255,146,47,0.06)_100%)] text-white ring-1 ring-[rgba(255,146,47,0.18)]"
                  : "text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white",
              ].join(" ");

              return (
                <Link key={item.href} href={item.href} className={itemClasses}>
                  <PanelLeftOpen className={`h-4 w-4 ${item.active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`} />
                  {item.label}
                </Link>
              );
            })}
              </div>
            </nav>
          ) : null}
        </div>

        {sidebarFooter ? <div className="mt-auto pt-8">{sidebarFooter}</div> : null}
      </aside>

      <main className={contentClasses}>
        <AdminTopbar title={pageTitle} subtitle={pageSubtitle} user={user}>
          {topbarContent}
        </AdminTopbar>
        <div className="relative z-0 flex flex-1 flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
