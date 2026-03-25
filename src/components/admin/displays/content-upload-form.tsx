"use client";

import { useState } from "react";
import type { ContentType } from "@/types/content";
import { SelectField } from "@/components/ui/form/select-field";
import { SubmitButton } from "@/components/ui/form/submit-button";

interface ContentUploadFormProps {
  displayId: string;
}

export function ContentUploadForm({
  displayId,
}: ContentUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<ContentType>("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("displayId", displayId);

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Erro no upload");
      }

      const uploadData = await uploadResponse.json();

      const createResponse = await fetch(`/api/admin/display/${displayId}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          filePath: uploadData.filePath,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Erro ao criar conteúdo");
      }

      window.location.reload();
    } catch (submitError) {
      setError("Não foi possível adicionar o conteúdo");
      setLoading(false);
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SelectField
          label="Tipo de mídia"
          value={type}
          onChange={(event) => setType(event.target.value as ContentType)}
          disabled={loading}
        >
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
          <option value="pdf">PDF</option>
        </SelectField>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">
            Arquivo
          </label>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full rounded-md border border-[var(--color-border)] bg-[#10161C] px-4 py-3 text-sm text-[var(--color-text)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-accent)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#0F1317] hover:file:bg-[var(--color-accent-hover)]"
            disabled={loading}
            required
          />
          <p className="text-xs text-[var(--color-text-muted)]">
            Aceita imagens, vídeos e PDFs.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton loading={loading} loadingLabel="Enviando...">
          Adicionar Conteúdo
        </SubmitButton>
      </div>
    </form>
  );
}
