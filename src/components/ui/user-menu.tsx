"use client";

import { useMemo, useState } from "react";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";

interface UserMenuProps {
  name: string;
  email?: string | null;
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [name]);

  return (
    <div className="relative z-40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,18,32,0.78)] px-3 py-2 text-left text-sm text-[var(--color-text)] shadow-[0_16px_32px_rgba(4,10,18,0.2)] transition hover:border-[rgba(255,138,31,0.28)] hover:bg-[rgba(15,24,40,0.92)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#FF922F_0%,#F36F12_100%)] text-xs font-semibold text-white shadow-[0_10px_20px_rgba(243,111,18,0.22)]">
          {initials || "AD"}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {email || "Acesso administrativo"}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[var(--color-text-muted)] transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-[80] mt-3 w-72 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(13,19,31,0.97)] shadow-[0_24px_48px_rgba(2,8,18,0.45)] backdrop-blur-xl">
          <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-4">
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-8 w-8 text-[var(--color-accent)]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{name}</p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {email || "Usuário LDAP autenticado"}
                </p>
              </div>
            </div>
          </div>
          <a
            href="/api/auth/logout"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#FFD7C2] transition hover:bg-[rgba(92,28,18,0.32)]"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </a>
        </div>
      ) : null}
    </div>
  );
}
