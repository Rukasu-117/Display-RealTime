import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendWsEvent } from "@/lib/ws";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const contents = await prisma.content.findMany({
    where: { displayId: params.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(contents);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { type, filePath, duration } = body;

    if (!type || !filePath) {
      return NextResponse.json(
        { error: "type e filePath são obrigatórios" },
        { status: 400 }
      );
    }

    const last = await prisma.content.findFirst({
      where: { displayId: params.id },
      orderBy: { order: "desc" },
    });

    const content = await prisma.content.create({
      
      data: {
        displayId: params.id,
        type,
        filePath,
        duration: duration ?? null,
        order: last ? last.order + 1 : 1,
      },
      
    });

    sendWsEvent(params.id, "CONTENT_CREATED");

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar conteúdo" },
      { status: 500 }
    );
  }
}
