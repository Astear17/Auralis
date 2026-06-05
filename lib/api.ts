import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(error: unknown) {
  return NextResponse.json(
    { error: "Invalid request", details: error },
    { status: 400 },
  );
}

export function unavailable(message: string) {
  return NextResponse.json({ error: message }, { status: 503 });
}
