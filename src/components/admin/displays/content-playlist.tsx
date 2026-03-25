"use client";

import type { Content } from "@/types/content";
import { ContentPlaylistItem } from "@/components/admin/displays/content-playlist-item";
import { EmptyState } from "@/components/ui/empty-state";

type PlaylistContent = Pick<
  Content,
  "id" | "type" | "filePath" | "duration"
>;

interface ContentPlaylistProps {
  contents: PlaylistContent[];
  displayId: string;
}

export function ContentPlaylist({
  contents,
  displayId,
}: ContentPlaylistProps) {
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
    const ids = contents.map((content) => content.id);
    const index = ids.indexOf(id);

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === ids.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];

    await fetch(`/api/admin/display/${displayId}/content/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: ids }),
    });

    window.location.reload();
  }

  if (contents.length === 0) {
    return (
      <EmptyState
        title="Nenhum conteúdo enviado"
        description="Envie uma imagem, vídeo ou PDF para iniciar a programação deste display."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {contents.map((content, index) => (
        <ContentPlaylistItem
          key={content.id}
          content={content}
          isFirst={index === 0}
          isLast={index === contents.length - 1}
          onMoveUp={() => move(content.id, "up")}
          onMoveDown={() => move(content.id, "down")}
          onRemove={() => removeContent(content.id)}
          onDurationSave={(duration) => updateDuration(content.id, duration)}
        />
      ))}
    </ul>
  );
}
