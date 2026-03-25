import type { Display } from "@/types/display";

type DisplayIdentity = Pick<
  Display,
  "id" | "name" | "rotation" | "aspectRatio" | "updatedAt"
>;

interface DisplayIdentityCardProps {
  display: DisplayIdentity;
}

export function DisplayIdentityCard({
  display,
}: DisplayIdentityCardProps) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Display
          </p>
          <h2
            className="text-xl font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            {display.name}
          </h2>
          <p className="max-w-2xl break-all text-sm text-[var(--color-text-muted)]">
            ID público: {display.id}
          </p>
        </div>

        <div className="grid gap-4 text-sm text-[var(--color-text-soft)] md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Rotação
            </p>
            <p>{display.rotation}°</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Aspect Ratio
            </p>
            <p>{display.aspectRatio}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Atualizado em
            </p>
            <p>{new Date(display.updatedAt).toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
