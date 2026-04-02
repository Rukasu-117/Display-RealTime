import Link from "next/link";
import { AdminPageShell } from "@/components/ui/admin-page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DisplaysList } from "@/components/admin/displays/displays-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin/displays", label: "Displays", active: true },
];

export default async function DisplaysPage() {
  const displays = await prisma.display.findMany({
    include: {
      _count: {
        select: { contents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminPageShell
      navItems={navItems}
      brandSubtitle="Digital signage enterprise"
      pageTitle="Displays"
      pageSubtitle="Gerencie displays, playlists e previews em uma superfície administrativa segura e preparada para crescer."
      sidebarFooter={
        <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-xs leading-6 text-[var(--color-text-muted)] backdrop-blur-xl">
          Operação ativa. Os atalhos desta área atualizam o runtime público sem duplicar a lógica do player.
        </div>
      }
    >
      <PageHeader
        title="Displays"
        description="Gerencie os displays cadastrados, revise ações rápidas e abra o preview público em uma nova aba."
        actions={
          <Link
            href="/admin/displays/new"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[#0F1317] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]"
          >
            Novo Display
          </Link>
        }
      />

      <DisplaysList
        displays={displays.map((display) => ({
          id: display.id,
          name: display.name,
          rotation: display.rotation,
          aspectRatio: display.aspectRatio,
          contentsCount: display._count.contents,
        }))}
      />
    </AdminPageShell>
  );
}
