import { type NextRequest, NextResponse } from "next/server";

import {
  exchangeHmrcAuthorizationCode,
  hmrcEndpoints,
  hmrcOAuthConfig,
} from "@/lib/hmrc-oauth";

const STATE_COOKIE = "hmrc_oauth_state";
/** Demo: remember HMRC returned OK (no token in URL). */
const DEMO_FLAG_COOKIE = "hmrc_demo_connected";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const fail = (code: string, message?: string) => {
    const q = new URLSearchParams({ hmrc: code });
    if (message) q.set("msg", message.slice(0, 400));
    const res = NextResponse.redirect(new URL(`/hmrc-auth?${q}`, origin));
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  const error = request.nextUrl.searchParams.get("error");
  const errorDesc = request.nextUrl.searchParams.get("error_description");
  if (error) {
    return fail(
      "access_denied",
      errorDesc ?? error
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state) {
    return fail("invalid_callback", "Missing code or state");
  }

  const jar = request.cookies.get(STATE_COOKIE)?.value;
  if (!jar || jar !== state) {
    return fail("state_mismatch", "Start again from Connect HMRC");
  }

  const cfg = hmrcOAuthConfig();
  if (!cfg.ok) {
    return fail("missing_env", cfg.missing.join(","));
  }

  const { token } = hmrcEndpoints();

  try {
    await exchangeHmrcAuthorizationCode({
      tokenUrl: token,
      clientId: cfg.clientId,
      clientSecret: cfg.clientSecret,
      redirectUri: cfg.redirectUri,
      code,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Token exchange failed";
    return fail("token_error", msg);
  }

  const okUrl = new URL("/hmrc-auth", origin);
  okUrl.searchParams.set("hmrc", "connected");

  const res = NextResponse.redirect(okUrl);
  res.cookies.delete(STATE_COOKIE);
  res.cookies.set(DEMO_FLAG_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return res;
}
