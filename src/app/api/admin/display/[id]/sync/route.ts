import { NextResponse } from "next/server";
import { sendWsEvent } from "@/lib/ws";

const DEFAULT_DELAY_MS = 3000;

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedDelay = Number(body?.delayMs);
    const delayMs = Number.isFinite(requestedDelay)
      ? Math.max(0, requestedDelay)
      : DEFAULT_DELAY_MS;
    const startAt = Date.now() + delayMs;

    sendWsEvent(params.id, "DISPLAY_SYNC_REQUESTED", {
      startAt,
      restartFromIndex: 0,
    });

    return NextResponse.json({ ok: true, delayMs, startAt });
  } catch (error) {
    console.error("DISPLAY SYNC ERROR:", error);

    return NextResponse.json(
      { error: "Erro ao sincronizar display" },
      { status: 500 }
    );
  }
}
