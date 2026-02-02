import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { sendWsEvent } from "@/lib/ws";
import { revalidatePath } from "next/cache";


/**
 * PUT /api/admin/display/[id]
 * Atualiza nome e rotação do display
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, rotation } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

      const display = await prisma.display.update({
        where: { id: params.id },
        data: {
          name,
          rotation: rotation ?? 0,
        },
      });

      // 🔥 AVISA O DISPLAY
      sendWsEvent(display.id, "DISPLAY_UPDATED");

      return NextResponse.json(display);
  } catch (error) {
    console.error("UPDATE DISPLAY ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar display" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/display/[id]
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Remove display do banco (cascade remove contents)
    await prisma.display.delete({
      where: { id: params.id },
    });
  
    // 🔥 invalida cache da listagem
    revalidatePath("/admin/displays");

    sendWsEvent(params.id, "CONTENT_DELETED");

    // Remove pasta de uploads do display
    const dir = path.join(
      process.cwd(),
      "public",
      "uploads",
      params.id
    );

    await fs.rm(dir, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE DISPLAY ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao remover display" },
      { status: 500 }
    );
  }
}
