import Link from "next/link";
import { DisplayForm } from "@/components/admin/displays/display-form";
import { AdminPageShell } from "@/components/ui/admin-page-shell";
import { PageHeader } from "@/components/ui/page-header";

const navItems = [
  { href: "/admin/displays", label: "Displays", active: true },
];

export default function NewDisplayPage() {
  return (
    <AdminPageShell
      navItems={navItems}
      brandSubtitle="Digital signage enterprise"
      pageTitle="Novo Display"
      pageSubtitle="Crie um novo ponto de exibição e defina a configuração inicial do player administrativo."
    >
      <PageHeader
        title="Novo Display"
        description="Cadastre um novo display com nome amigável e rotação inicial para facilitar a operação do player."
        actions={
          <Link
            href="/admin/displays"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[#3B4552] hover:bg-[#29323C]"
          >
            Voltar para listagem
          </Link>
        }
      />

      <div className="max-w-3xl">
        <DisplayForm mode="create" />
      </div>
    </AdminPageShell>
  );
}
