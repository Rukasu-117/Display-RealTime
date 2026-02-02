import { prisma } from "@/lib/prisma";
import ContentForm from "./ContentForm";
import ContentList from "./ContentList";

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

  if (!display) return <div>Display não encontrado</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl">
        Conteúdos — {display.name}
      </h1>

      <ContentForm displayId={display.id} />
      <ContentList
        contents={display.contents}
        displayId={display.id}
      />
    </div>
  );
}
