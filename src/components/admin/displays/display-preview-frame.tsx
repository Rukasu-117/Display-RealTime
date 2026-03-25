interface DisplayPreviewFrameProps {
  displayId: string;
  aspectRatio: string;
}

function toCssAspectRatio(aspectRatio: string) {
  return aspectRatio.replace(":", " / ");
}

export function DisplayPreviewFrame({
  displayId,
  aspectRatio,
}: DisplayPreviewFrameProps) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="space-y-1">
        <h2
          className="text-lg font-semibold text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          Preview incorporado
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Esta visualizacao carrega o player publico dentro do admin para
          revisar rotacao, ordem e duracao sem sair do fluxo de conteudos.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-black">
        <div
          className="mx-auto w-full max-w-6xl bg-black"
          style={{ aspectRatio: toCssAspectRatio(aspectRatio) }}
        >
          <iframe
            title="Preview do display"
            src={`/display/${displayId}`}
            className="h-full w-full bg-black"
          />
        </div>
      </div>
    </section>
  );
}
