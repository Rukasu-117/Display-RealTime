"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DisplayFields } from "@/components/admin/displays/display-fields";
import { SubmitButton } from "@/components/ui/form/submit-button";

interface DisplayFormProps {
  mode: "create" | "edit";
  displayId?: string;
  initialValues?: {
    name?: string;
    rotation?: number;
  };
}

export function DisplayForm({
  mode,
  displayId,
  initialValues,
}: DisplayFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [rotation, setRotation] = useState(initialValues?.rotation ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/display"
          : `/api/admin/display/${displayId}`;

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rotation }),
      });

      if (!response.ok) {
        throw new Error(mode === "create" ? "Erro ao criar" : "Erro ao salvar");
      }

      if (mode === "create") {
        await response.json();
      }

      router.push("/admin/displays");

      if (mode === "create") {
        router.refresh();
      }
    } catch (submitError) {
      setError(
        mode === "create"
          ? "Não foi possível criar o display"
          : "Não foi possível salvar as alterações"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <DisplayFields
        name={name}
        rotation={rotation}
        disabled={loading}
        nameHint={
          mode === "create"
            ? "Cadastre um nome fácil de reconhecer no painel."
            : undefined
        }
        rotationHint="A rotação será aplicada no player público deste display."
        onNameChange={setName}
        onRotationChange={setRotation}
      />

      <div className="flex justify-end">
        <SubmitButton
          loading={loading}
          loadingLabel={mode === "create" ? "Criando..." : "Salvando..."}
        >
          {mode === "create" ? "Criar Display" : "Salvar Alterações"}
        </SubmitButton>
      </div>
    </form>
  );
}
