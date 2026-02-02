import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { sendWsEvent } from "@/lib/ws";

/**
 * PUT /api/admin/content/[contentId]
 * Atualiza conteúdo (ex: duração, ordem)
 */
export async function PUT(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const body = await req.json();
    const { duration, order } = body;

    const content = await prisma.content.update({
      where: { id: params.contentId },
      data: {
        duration: duration ?? undefined,
        order: order ?? undefined,
      },
    });

    // 🔥 avisa o display em tempo real
    sendWsEvent(content.displayId, "CONTENT_UPDATED");

    return NextResponse.json(content);
  } catch (error) {
    console.error("UPDATE CONTENT ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conteúdo" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content/[contentId]
 * Remove conteúdo + arquivo físico
 */
export async function DELETE(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.contentId },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo não encontrado" },
        { status: 404 }
      );
    }

    // Remove arquivo físico
    const absolutePath = path.join(
      process.cwd(),
      "public",
      content.filePath
    );

    try {
      await fs.unlink(absolutePath);
    } catch {
      // arquivo pode já ter sido removido
    }

    // Remove do banco
    await prisma.content.delete({
      where: { id: params.contentId },
    });

    // 🔥 avisa o display
    sendWsEvent(content.displayId, "CONTENT_DELETED");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE CONTENT ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao remover conteúdo" },
      { status: 500 }
    );
  }
}
