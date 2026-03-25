import type { Display } from "@/types/display";
import { DisplayListItem } from "@/components/admin/displays/display-list-item";
import { EmptyState } from "@/components/ui/empty-state";

type DisplaySummary = Pick<
  Display,
  "id" | "name" | "rotation"
> & {
  aspectRatio?: string;
  contentsCount?: number;
};

interface DisplaysListProps {
  displays: DisplaySummary[];
}

export function DisplaysList({ displays }: DisplaysListProps) {
  if (displays.length === 0) {
    return (
      <EmptyState
        title="Nenhum display cadastrado"
        description="Crie o primeiro display para começar a organizar conteúdos e abrir previews públicos."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {displays.map((display) => (
        <DisplayListItem key={display.id} display={display} />
      ))}
    </ul>
  );
}
