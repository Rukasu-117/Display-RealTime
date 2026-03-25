"use client";

import type { Content } from "@/types/content";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DurationField } from "@/components/admin/displays/duration-field";
import { MediaTypeBadge } from "@/components/admin/displays/media-type-badge";
import { ReorderControls } from "@/components/admin/displays/reorder-controls";

type PlaylistContentItem = Pick<
  Content,
  "id" | "type" | "filePath" | "duration"
>;

interface ContentPlaylistItemProps {
  content: PlaylistContentItem;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => Promise<void>;
  onDurationSave: (duration: number) => Promise<void> | void;
}

export function ContentPlaylistItem({
  content,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDurationSave,
}: ContentPlaylistItemProps) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <MediaTypeBadge type={content.type} />
          <p
            className="text-sm font-medium text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            {content.type}
          </p>
        </div>

        <p className="mt-2 break-all text-sm text-[var(--color-text-muted)]">
          {content.filePath}
        </p>

        <DurationField
          defaultValue={content.duration ?? 10000}
          onSubmit={onDurationSave}
        />
      </div>

      <div className="flex flex-col gap-2 lg:items-end">
        <ReorderControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          disableUp={isFirst}
          disableDown={isLast}
        />

        <ConfirmActionButton
          size="sm"
          confirmMessage="Tem certeza que deseja remover este conteúdo?"
          onConfirm={onRemove}
        >
          Remover
        </ConfirmActionButton>
      </div>
    </li>
  );
}
