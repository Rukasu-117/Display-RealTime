import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { displayId: string } }
) {
  const display = await prisma.display.findUnique({
    where: { id: params.displayId },
    include: {
      contents: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!display) {
    return NextResponse.json(
      { error: "Display não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(display, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
