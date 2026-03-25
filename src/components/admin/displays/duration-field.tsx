"use client";

import { Button } from "@/components/ui/button";

interface DurationFieldProps {
  defaultValue: number;
  onSubmit: (duration: number) => void;
}

export function DurationField({
  defaultValue,
  onSubmit,
}: DurationFieldProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const duration = Number(
          (form.elements.namedItem("duration") as HTMLInputElement).value
        );

        onSubmit(duration);
      }}
      className="mt-3 flex flex-wrap items-center gap-2"
    >
      <input
        type="number"
        name="duration"
        defaultValue={defaultValue}
        className="w-28 rounded-md border border-[var(--color-border)] bg-[#10161C] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
      />
      <Button size="sm" variant="ghost" type="submit">
        Salvar
      </Button>
    </form>
  );
}
