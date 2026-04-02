import Link from "next/link";
import { DisplayForm } from "@/components/admin/displays/display-form";
import { DisplayIdentityCard } from "@/components/admin/displays/display-identity-card";
import { AdminPageShell } from "@/components/ui/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";

const navItems = [
  { href: "/admin/displays", label: "Displays", active: true },
];

export default async function EditDisplayPage({
  params,
}: {
  params: { id: string };
}) {
  const display = await prisma.display.findUnique({
    where: { id: params.id },
  });

  if (!display) {
    return (
      <AdminPageShell
        navItems={navItems}
        brandSubtitle="Digital signage enterprise"
        pageTitle="Editar Display"
        pageSubtitle="O display solicitado não foi encontrado ou já foi removido."
      >
        <PageHeader
          title="Editar Display"
          description="O display solicitado não foi encontrado ou já foi removido."
        />
        <EmptyState
          title="Display não encontrado"
          description="Confira o link acessado ou volte para a listagem para selecionar outro display."
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
      pageTitle="Editar Display"
      pageSubtitle="Atualize identidade, rotação e acessos operacionais do display selecionado."
    >
      <PageHeader
        title="Editar Display"
        description="Atualize o nome do display e a rotação aplicada no player público." 
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/displays/${display.id}/contents`}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
            >
              Gerenciar conteúdos
            </Link>

          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="max-w-3xl">
          <DisplayForm
            mode="edit"
            displayId={display.id}
            initialValues={{
              name: display.name,
              rotation: display.rotation,
            }}
          />
        </div>

        <DisplayIdentityCard display={display} />
      </div>
    </AdminPageShell>
  );
}
