"use client";

import { useState } from "react";

export default function ContentForm({ displayId }: { displayId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("image");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    // 1️⃣ Upload do arquivo
    const formData = new FormData();
    formData.append("file", file);
    formData.append("displayId", displayId);

    const uploadRes = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    // 2️⃣ Criar conteúdo no banco
    await fetch(`/api/admin/display/${displayId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        filePath: uploadData.filePath,
      }),
    });

    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="bg-gray-800 p-2 rounded"
      >
        <option value="image">Imagem</option>
        <option value="video">Vídeo</option>
        <option value="pdf">PDF</option>
      </select>

      <input
        type="file"
        accept="image/*,video/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
        required
      />

      <button
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Adicionar Conteúdo"}
      </button>
    </form>
  );
}
