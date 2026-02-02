import { prisma } from "@/lib/prisma";
import DisplayClient from "./DisplayClient";

interface PageProps {
  params: {
    displayId: string;
  };
}

export default async function DisplayPage({ params }: PageProps) {
  const display = await prisma.display.findUnique({
    where: { id: params.displayId },
    include: {
      contents: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!display) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Display não encontrado
      </div>
    );
  }

  return <DisplayClient display={display} />;
}
