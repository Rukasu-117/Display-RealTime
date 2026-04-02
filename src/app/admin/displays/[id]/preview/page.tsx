import Link from "next/link";
import { DisplayIdentityCard } from "@/components/admin/displays/display-identity-card";
import { DisplayPreviewFrame } from "@/components/admin/displays/display-preview-frame";
import { AdminPageShell } from "@/components/ui/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";

const navItems = [
  { href: "/admin/displays", label: "Displays", active: true },
];

export default async function DisplayPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const display = await prisma.display.findUnique({
    where: { id: params.id },
    include: {
      contents: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!display) {
    return (
      <AdminPageShell
        navItems={navItems}
        brandSubtitle="Digital signage enterprise"
        pageTitle="Preview do Display"
        pageSubtitle="O display solicitado não foi encontrado ou já foi removido."
      >
        <PageHeader
          title="Preview do Display"
          description="O display solicitado nao foi encontrado ou ja foi removido."
        />
        <EmptyState
          title="Display nao encontrado"
          description="Volte para a listagem ou para os conteudos para selecionar outro display."
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
      pageTitle="Preview do Display"
      pageSubtitle="Valide o player público em contexto administrativo antes da publicação final."
    >
      <PageHeader
        title="Preview do Display"
        description="Revise o player publico sem sair do admin e abra a versao em tela cheia quando precisar validar a experiencia final."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/displays/${display.id}/contents`}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
            >
              Voltar para conteudos
            </Link>
            <a
              href={`/display/${display.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[#0F1317] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]"
            >
              Abrir player em tela cheia
            </a>
          </div>
        }
      />

      <DisplayIdentityCard display={display} />

      <DisplayPreviewFrame
        displayId={display.id}
        aspectRatio={display.aspectRatio}
      />
    </AdminPageShell>
  );
}
