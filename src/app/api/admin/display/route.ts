import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

/**
 * POST /api/admin/display
 * Cria um display
 */
export async function POST(req: Request) {
  console.log("🔥 POST /api/admin/display CHEGOU");

  try {
    const body = await req.json();
    console.log("📦 BODY RECEBIDO:", body);
    const { name, rotation, aspectRatio, contents } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome do display é obrigatório" },
        { status: 400 }
      );
    }

    const display = await prisma.display.create({
      data: {
        name,
        rotation: rotation ?? 0,
        aspectRatio: aspectRatio ?? "16:9",
      },
      
    });
          
    // 🔥 invalida cache da listagem
    revalidatePath("/admin/displays");

    // Conteúdos opcionais (podem ser criados depois)
    if (Array.isArray(contents) && contents.length > 0) {
      await prisma.content.createMany({
        data: contents.map((c: any, index: number) => ({
          displayId: display.id,
          type: c.type,
          filePath: c.filePath,
          order: c.order ?? index + 1,
          duration: c.duration ?? null,
        })),
      });
    }

    return NextResponse.json(display, { status: 201 });
  } catch (error) {
    console.error("CREATE DISPLAY ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao criar display" },
      { status: 500 }
    );
  }
}
