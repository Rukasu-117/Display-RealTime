"use client";

interface Content {
  id: string;
  type: string;
  filePath: string;
  duration?: number | null;
}

export default function ContentList({
  contents,
  displayId,
}: {
  contents: Content[];
  displayId: string;
}) {
  async function removeContent(id: string) {
    await fetch(`/api/admin/content/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  }

  async function updateDuration(id: string, duration: number) {
    await fetch(`/api/admin/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration }),
    });
    window.location.reload();
  }

  async function move(id: string, direction: "up" | "down") {
    const ids = contents.map((c) => c.id);
    const index = ids.indexOf(id);

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === ids.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];

    await fetch(`/api/admin/display/${displayId}/content/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: ids }),
    });

    window.location.reload();
  }

  return (
    <ul className="space-y-3">
      {contents.map((c) => (
        <li
          key={c.id}
          className="border p-3 rounded flex justify-between items-start gap-4"
        >
          <div>
            <strong>{c.type}</strong>
            <div className="text-sm opacity-70">{c.filePath}</div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const duration = Number(
                  (form.elements.namedItem("duration") as HTMLInputElement)
                    .value
                );
                updateDuration(c.id, duration);
              }}
              className="flex gap-2 mt-2"
            >
              <input
                type="number"
                name="duration"
                defaultValue={c.duration ?? 10000}
                className="w-24 bg-gray-800 p-1 rounded"
              />
              <button className="text-blue-400">Salvar</button>
            </form>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => move(c.id, "up")}>↑</button>
            <button onClick={() => move(c.id, "down")}>↓</button>
            <button
              onClick={() => removeContent(c.id)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
