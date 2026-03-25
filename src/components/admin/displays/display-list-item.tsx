import type { Display } from "@/types/display";
import { DisplayActions } from "@/components/admin/displays/display-actions";

type DisplayListRow = Pick<
  Display,
  "id" | "name" | "rotation"
> & {
  aspectRatio?: string;
  contentsCount?: number;
};

interface DisplayListItemProps {
  display: DisplayListRow;
}

export function DisplayListItem({ display }: DisplayListItemProps) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <h3
          className="text-base font-medium text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          {display.name}
        </h3>
        <p className="break-all text-sm text-[var(--color-text-muted)]">
          {display.id}
        </p>
        <p className="text-xs text-[var(--color-text-soft)]">
          Rotação: {display.rotation}°
          {display.aspectRatio ? `  |  Aspecto: ${display.aspectRatio}` : ""}
          {typeof display.contentsCount === "number"
            ? `  |  Conteúdos: ${display.contentsCount}`
            : ""}
        </p>
      </div>

      <DisplayActions displayId={display.id} />
    </li>
  );
}
