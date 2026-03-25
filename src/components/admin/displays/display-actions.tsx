"use client";

import Link from "next/link";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";

interface DisplayActionsProps {
  displayId: string;
}

export function DisplayActions({ displayId }: DisplayActionsProps) {
  async function removeDisplay() {
    await fetch(`/api/admin/display/${displayId}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/displays/${displayId}`}
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
      >
        Editar
      </Link>

      <Link
        href={`/admin/displays/${displayId}/contents`}
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
      >
        Conteúdos
      </Link>

      <a
        href={`/display/${displayId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
      >
        Visualizar
      </a>

      <ConfirmActionButton
        size="sm"
        confirmMessage="Tem certeza que deseja remover este display?"
        onConfirm={removeDisplay}
      >
        Remover
      </ConfirmActionButton>
    </div>
  );
}
