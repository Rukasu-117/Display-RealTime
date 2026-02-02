import { prisma } from "@/lib/prisma";
import EditDisplayForm from "./EditDisplayForm";

export default async function EditDisplayPage({
  params,
}: {
  params: { id: string };
}) {
  const display = await prisma.display.findUnique({
    where: { id: params.id },
  });

  if (!display) {
    return <div className="p-6">Display não encontrado</div>;
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl">Editar Display</h1>

      <div className="text-sm opacity-70">
        <strong>ID público:</strong>
        <div className="break-all">{display.id}</div>
      </div>

      <EditDisplayForm display={display} />
    </div>
  );
}
