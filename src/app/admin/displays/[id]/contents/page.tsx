import Link from "next/link";
import { ContentPlaylist } from "@/components/admin/displays/content-playlist";
import { ContentUploadForm } from "@/components/admin/displays/content-upload-form";
import { DisplayIdentityCard } from "@/components/admin/displays/display-identity-card";
import { AdminPageShell } from "@/components/ui/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";

const navItems = [
  { href: "/admin/displays", label: "Displays", active: true },
];

export default async function DisplayContentsPage({
  params,
}: {
  params: { id: string };
}) {
  const display = await prisma.display.findUnique({
    where: { id: params.id },
    include: {
      contents: { orderBy: { order: "asc" } },
    },
  });

  if (!display) {
    return (
      <AdminPageShell
        navItems={navItems}
        brandSubtitle="Digital signage enterprise"
        pageTitle="Conteúdos do Display"
        pageSubtitle="O display solicitado não foi encontrado ou já foi removido."
      >
        <PageHeader
          title="Conteúdos do Display"
          description="O display solicitado não foi encontrado ou já foi removido."
        />
        <EmptyState
          title="Display não encontrado"
          description="Volte para a listagem de displays para escolher outro registro."
          action={
            <Link
              href="/admin/displays"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
            >
              Voltar para displays
            </Link>
          }
        />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      navItems={navItems}
      brandSubtitle="Digital signage enterprise"
      pageTitle="Conteúdos do Display"
      pageSubtitle="Gerencie mídias, ordem de exibição e tempos do display selecionado."
    >
      <PageHeader
        title="Conteúdos do Display"
        description="Organize a ordem de reprodução, ajuste o tempo de exibição e envie novas mídias para o display selecionado."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/displays/${display.id}`}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
            >
              Editar display
            </Link>
            <Link
              href={`/admin/displays/${display.id}/preview`}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[#0F1317] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]"
            >
              Abrir preview
            </Link>
          </div>
        }
      />

      <DisplayIdentityCard display={display} />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2
            className="text-lg font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            Enviar nova mídia
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            O conteúdo enviado entra na lista e dispara atualização no player deste display.
          </p>
        </div>

        <ContentUploadForm displayId={display.id} />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2
            className="text-lg font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            Ordem de apresentação
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Reordene os itens, ajuste a duração e remova mídias quando necessário.
          </p>
        </div>

        <ContentPlaylist contents={display.contents} displayId={display.id} />
      </section>
    </AdminPageShell>
  );
}
