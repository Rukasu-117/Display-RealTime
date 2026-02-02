import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DisplayList from "./DisplayList";
export const dynamic = "force-dynamic";

export default async function DisplaysPage() {
  const displays = await prisma.display.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Displays</h1>

      <Link
        href="/admin/displays/new"
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Novo Display
      </Link>

      <DisplayList displays={displays} />
    </div>
  );
}
