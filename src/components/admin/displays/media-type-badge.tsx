import type { ContentType } from "@/types/content";

interface MediaTypeBadgeProps {
  type: ContentType | string;
}

const labels: Record<string, string> = {
  image: "Imagem",
  video: "Vídeo",
  pdf: "PDF",
};

const colors: Record<string, string> = {
  image: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  video: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  pdf: "border-amber-500/30 bg-amber-500/10 text-amber-200",
};

export function MediaTypeBadge({ type }: MediaTypeBadgeProps) {
  const colorClass = colors[type] ?? "border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-soft)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${colorClass}`}
    >
      {labels[type] ?? type}
    </span>
  );
}
