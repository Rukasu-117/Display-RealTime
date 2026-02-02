import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendWsEvent } from "@/lib/ws";

/**
 * PATCH /api/admin/display/[id]/content/reorder
 * Reordena a playlist do display
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds inválido" },
        { status: 400 }
      );
    }

    // Atualiza a ordem no banco
    await Promise.all(
      orderedIds.map((contentId: string, index: number) =>
        prisma.content.update({
          where: { id: contentId },
          data: { order: index + 1 },
        })
      )
    );

    // 🔥 avisa o display em tempo real
    sendWsEvent(params.id, "CONTENT_REORDERED");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REORDER ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao reordenar conteúdos" },
      { status: 500 }
    );
  }
}
