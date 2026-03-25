import { Button } from "@/components/ui/button";

interface ReorderControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

export function ReorderControls({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: ReorderControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" onClick={onMoveUp} disabled={disableUp}>
        Subir
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={onMoveDown}
        disabled={disableDown}
      >
        Descer
      </Button>
    </div>
  );
}
