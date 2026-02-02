"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DisplayForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/display", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rotation,
        }),
      });



      if (!res.ok) {
        throw new Error("Erro ao criar display");
      }

      await res.json();
      router.push("/admin/displays");
      router.refresh();
    } catch (err) {
      setError("Não foi possível criar o display");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1">Nome do Display</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1">Rotação</label>
        <select
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value={0}>0°</option>
          <option value={90}>90°</option>
          <option value={180}>180°</option>
          <option value={270}>270°</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Criando..." : "Criar Display"}
      </button>
    </form>
  );
}
