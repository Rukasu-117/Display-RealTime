import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const displayId = formData.get("displayId") as string;

    if (!file || !displayId) {
      return NextResponse.json(
        { error: "Arquivo ou displayId ausente" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      displayId
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const fileSystemPath = path.join(uploadDir, filename);

    await fs.writeFile(fileSystemPath, buffer); 

    return NextResponse.json({
      filePath: `/api/file/${displayId}/${filename}`,
      type: file.type,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Erro no upload" },
      { status: 500 }
    );
  }
}
