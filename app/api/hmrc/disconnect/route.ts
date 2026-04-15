import { type NextRequest, NextResponse } from "next/server";

const DEMO_FLAG_COOKIE = "hmrc_demo_connected";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const res = NextResponse.redirect(new URL("/hmrc-auth", origin));
  res.cookies.delete(DEMO_FLAG_COOKIE);
  return res;
}
