import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { displayId, event, payload } = await req.json();

  // @ts-ignore
  global.broadcast?.(displayId, {
    event,
    payload,
  });

  return NextResponse.json({ ok: true });
}
