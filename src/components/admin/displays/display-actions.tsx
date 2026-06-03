"use client";

import Link from "next/link";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DisplayActionsProps {
  displayId: string;
}

export function DisplayActions({ displayId }: DisplayActionsProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  async function removeDisplay() {
    await fetch(`/api/admin/display/${displayId}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  async function syncDisplay() {
    try {
      setIsSyncing(true);

      const response = await fetch(`/api/admin/display/${displayId}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delayMs: 3000 }),
      });

      if (!response.ok) {
        throw new Error("Falha ao sincronizar o display");
      }
    } catch (error) {
      console.error(error);
      window.alert("Nao foi possivel sincronizar este display.");
    } finally {
      window.setTimeout(() => {
        setIsSyncing(false);
      }, 3200);
    }
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

      <Button
        size="sm"
        variant="secondary"
        onClick={syncDisplay}
        disabled={isSyncing}
      >
        {isSyncing ? "Sincronizando..." : "Sincronizar displays"}
      </Button>

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
