"use client";

import Link from "next/link";

interface Display {
  id: string;
  name: string;
}

export default function DisplayList({ displays }: { displays: Display[] }) {
  async function removeDisplay(id: string) {
    const confirm = window.confirm(
      "Tem certeza que deseja remover este display?"
    );
    if (!confirm) return;

    await fetch(`/api/admin/display/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <ul className="mt-4 space-y-2">
      {displays.map((d) => (
        <li
          key={d.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <strong>{d.name}</strong>
            <div className="text-sm opacity-70">{d.id}</div>
          </div>

          <div className="flex gap-4">
            {/* Editar Display */}
            <Link
              href={`/admin/displays/${d.id}`}
              className="text-blue-400"
            >
              Editar
            </Link>

            {/* Gerenciar Conteúdos */}
            <Link
              href={`/admin/displays/${d.id}/contents`}
              className="text-green-400"
            >
              Conteúdos
            </Link>

            {/* Remover */}
            <button
              onClick={() => removeDisplay(d.id)}
              className="text-red-500"
            >
              Remover
            </button>

            <a
              href={`/display/${d.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400"
            >
              Visualizar
            </a>


          </div>
        </li>
      ))}
    </ul>
  );
}
