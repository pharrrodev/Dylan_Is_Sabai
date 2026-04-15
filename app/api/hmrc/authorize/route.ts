import { randomBytes } from "crypto";
import { type NextRequest, NextResponse } from "next/server";

import {
  buildHmrcAuthorizeUrl,
  hmrcEndpoints,
  hmrcOAuthConfig,
  hmrcOAuthScope,
} from "@/lib/hmrc-oauth";

const STATE_COOKIE = "hmrc_oauth_state";
const COOKIE_MAX_AGE = 600;

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  const cfg = hmrcOAuthConfig();
  if (!cfg.ok) {
    const q = new URLSearchParams({
      hmrc: "missing_env",
      detail: cfg.missing.join(","),
    });
    return NextResponse.redirect(new URL(`/hmrc-auth?${q}`, origin));
  }

  const { authorize } = hmrcEndpoints();
  const state = randomBytes(24).toString("hex");
  const scope = hmrcOAuthScope();

  const url = buildHmrcAuthorizeUrl({
    authorizeBase: authorize,
    clientId: cfg.clientId,
    redirectUri: cfg.redirectUri,
    scope,
    state,
  });

  const res = NextResponse.redirect(url, 302);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return res;
}
