import type { ReactNode } from "react";
import { Clock3, LayoutGrid } from "lucide-react";
import { UserMenu } from "@/components/ui/user-menu";

interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  user: {
    name: string;
    email?: string | null;
  };
  children?: ReactNode;
}

export function AdminTopbar({ title, subtitle, user, children }: AdminTopbarProps) {
  return (
    <div className="relative z-30 isolate flex flex-col gap-4 rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(10,18,32,0.92)_0%,rgba(13,22,38,0.88)_100%)] px-5 py-4 shadow-[0_24px_48px_rgba(4,10,18,0.22)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--color-accent)] lg:flex">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Administração
          </p>
          {title ? (
            <h1
              className="text-2xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
            >
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {children}
        <div className="hidden items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[var(--color-text-muted)] xl:flex">
          <Clock3 className="h-4 w-4" />
          <span className="text-xs">Sessão administrativa protegida</span>
        </div>
        <UserMenu name={user.name} email={user.email} />
      </div>
    </div>
  );
}
