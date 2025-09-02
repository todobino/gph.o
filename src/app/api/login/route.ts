import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // This is a placeholder. User authentication is handled on the client-side
  // by the Firebase SDK in this application architecture.
  // See /src/app/login/page.tsx for the implementation.
  return NextResponse.json({ ok: true, message: "Login logic is client-side." });
}
