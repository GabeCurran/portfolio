import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/img/jarvis.png", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), 308);
}
