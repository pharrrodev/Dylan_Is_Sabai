/**
 * HMRC user-restricted OAuth (authorization code).
 * Sandbox vs production: https://developer.service.hmrc.gov.uk/api-documentation/docs/authorisation/user-restricted-endpoints
 */
export type HmrcOAuthEnv = "sandbox" | "production";

const ENDPOINTS: Record<
  HmrcOAuthEnv,
  { authorize: string; token: string }
> = {
  sandbox: {
    authorize: "https://test-www.tax.service.gov.uk/oauth/authorize",
    token: "https://test-api.service.hmrc.gov.uk/oauth/token",
  },
  production: {
    authorize: "https://www.tax.service.gov.uk/oauth/authorize",
    token: "https://api.service.hmrc.gov.uk/oauth/token",
  },
};

export function hmrcOAuthEnv(): HmrcOAuthEnv {
  const v = process.env.HMRC_OAUTH_ENV?.toLowerCase();
  return v === "production" ? "production" : "sandbox";
}

export function hmrcEndpoints() {
  const env = hmrcOAuthEnv();
  const base = ENDPOINTS[env];
  return {
    env,
    authorize: process.env.HMRC_AUTHORIZE_URL ?? base.authorize,
    token: process.env.HMRC_TOKEN_URL ?? base.token,
  };
}

/** Default scopes for MTD Income Tax / Self Assessment style APIs — adjust in HMRC Developer Hub subscriptions. */
export function hmrcOAuthScope(): string {
  return (
    process.env.HMRC_OAUTH_SCOPE?.trim() ??
    "read:self-assessment write:self-assessment"
  );
}

export function hmrcOAuthConfig(): {
  ok: true;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
} | { ok: false; missing: string[] } {
  const clientId = process.env.HMRC_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.HMRC_CLIENT_SECRET?.trim() ?? "";
  const redirectUri = process.env.HMRC_REDIRECT_URI?.trim() ?? "";
  const missing: string[] = [];
  if (!clientId) missing.push("HMRC_CLIENT_ID");
  if (!clientSecret) missing.push("HMRC_CLIENT_SECRET");
  if (!redirectUri) missing.push("HMRC_REDIRECT_URI");
  if (missing.length) return { ok: false, missing };
  return { ok: true, clientId, clientSecret, redirectUri };
}

export function buildHmrcAuthorizeUrl(params: {
  authorizeBase: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
}): string {
  const u = new URL(params.authorizeBase);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", params.clientId);
  u.searchParams.set("redirect_uri", params.redirectUri);
  u.searchParams.set("scope", params.scope);
  u.searchParams.set("state", params.state);
  return u.toString();
}

export async function exchangeHmrcAuthorizationCode(params: {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}): Promise<{
  ok: true;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
}> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    code: params.code,
  });

  const res = await fetch(params.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  const json: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      typeof json === "object" &&
      json !== null &&
      "error_description" in json &&
      typeof (json as { error_description?: string }).error_description ===
        "string"
        ? (json as { error_description: string }).error_description
        : typeof json === "object" &&
            json !== null &&
            "error" in json &&
            typeof (json as { error?: string }).error === "string"
          ? (json as { error: string }).error
          : `Token exchange failed (${res.status})`;
    throw new Error(msg);
  }

  if (
    typeof json !== "object" ||
    json === null ||
    typeof (json as { access_token?: string }).access_token !== "string"
  ) {
    throw new Error("Invalid token response from HMRC");
  }

  const o = json as {
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
  };
  return {
    ok: true,
    access_token: o.access_token,
    expires_in: o.expires_in,
    refresh_token: o.refresh_token,
    token_type: o.token_type,
    scope: o.scope,
  };
}
