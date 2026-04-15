import { cookies } from "next/headers";
import { ExternalLink, Power, RefreshCw } from "lucide-react";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HmrcAuthPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const hmrc = typeof sp.hmrc === "string" ? sp.hmrc : "";
  const msg = typeof sp.msg === "string" ? sp.msg : "";
  const detail = typeof sp.detail === "string" ? sp.detail : "";

  const jar = await cookies();
  const sessionConnected = jar.get("hmrc_demo_connected")?.value === "1";
  const showConnected = hmrc === "connected" || sessionConnected;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#0E0E0E]">
      <header className="shrink-0 bg-[#1B1B1B] px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="editorial-headline text-xl font-semibold text-[#FFFFFF] sm:text-2xl">
          HMRC Auth
        </h1>
        <p className="mt-1 max-w-2xl font-sans text-xs leading-snug text-[#c6c6c6] sm:text-sm">
          Income Tax MTD — connect on the real Government Gateway screen, then
          return here. Demo-ready; tokens stay on the server.
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-3 py-3 sm:gap-6 sm:px-6 sm:py-4">
        {hmrc === "missing_env" ? (
          <div
            className="w-full max-w-lg bg-[#1B1B1B] px-4 py-3 font-sans text-sm text-[#f87171] shadow-[inset_0_0_0_0.5px_rgba(248,113,113,0.35)]"
            role="alert"
          >
            <p className="catalog-label text-[#f87171]">Configuration</p>
            <p className="mt-2 text-[#c6c6c6]">
              Add these to{" "}
              <code className="text-[#e9c349]">.env.local</code> then restart{" "}
              <code className="text-[#e9c349]">npm run dev</code>:
            </p>
            <p className="mt-2 break-all text-xs text-[#FFFFFF]">
              {detail || "HMRC_CLIENT_ID, HMRC_CLIENT_SECRET, HMRC_REDIRECT_URI"}
            </p>
            <p className="mt-2 text-xs text-[#c6c6c6]">
              Redirect URI in HMRC Developer Hub must match exactly (e.g.{" "}
              <code className="text-[#e9c349]">
                http://localhost:3000/api/hmrc/callback
              </code>
              ).
            </p>
          </div>
        ) : null}

        {hmrc === "token_error" || hmrc === "access_denied" || hmrc === "state_mismatch" || hmrc === "invalid_callback" ? (
          <div
            className="w-full max-w-lg bg-[#1B1B1B] px-4 py-3 font-sans text-sm shadow-[inset_0_0_0_0.5px_rgba(248,113,113,0.35)]"
            role="alert"
          >
            <p className="catalog-label text-[#f87171]">Connection issue</p>
            <p className="mt-2 text-[#c6c6c6]">
              {msg || "Try Connect again. If scopes fail, check your app is subscribed to the right APIs in HMRC Developer Hub."}
            </p>
          </div>
        ) : null}

        {showConnected ? (
          <div className="w-full max-w-lg bg-[#142818] px-4 py-3 font-sans text-sm shadow-[inset_0_0_0_0.5px_rgba(74,222,128,0.35)]">
            <p className="catalog-label text-[#4ade80]">Connected</p>
            <p className="mt-2 text-[#c6c6c6]">
              HMRC returned an access token (stored for this session demo). You
              can call MTD Income Tax APIs from the server next.
            </p>
            <Link
              href="/api/hmrc/disconnect"
              className="catalog-label mt-3 inline-block text-[#e9c349] hover:underline"
            >
              Clear demo session
            </Link>
          </div>
        ) : null}

        <section
          className="hero-noir-card w-full max-w-lg px-6 py-8 text-center sm:px-10 sm:py-10"
          aria-labelledby="hmrc-module-heading"
        >
          <div className="relative z-[1] flex flex-col items-center">
            <div
              className="flex size-16 items-center justify-center sm:size-20"
              aria-hidden
            >
              <div className="flex size-full items-center justify-center shadow-[0_0_48px_rgba(233,195,73,0.55),0_0_80px_rgba(233,195,73,0.25)]">
                <Power
                  className="size-10 text-[#e9c349] sm:size-12"
                  strokeWidth={1.25}
                />
              </div>
            </div>

            <h2
              id="hmrc-module-heading"
              className="editorial-serif-headline mt-6 text-xl tracking-[0.06em] text-[#FFFFFF] sm:text-2xl"
            >
              HMRC Auth Module
            </h2>

            <p className="mt-3 font-sans text-xs leading-relaxed text-[#c6c6c6] sm:text-sm">
              Opens the official HM Revenue & Customs sign-in (sandbox or
              production, from your env). After you approve, you land back here
              with a server-side token — no passwords stored in DIS.
            </p>

            <div className="mt-6 w-full bg-[#0E0E0E] px-4 py-3 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.06)]">
              <p className="font-sans text-xs text-[#c6c6c6] sm:text-sm">
                {showConnected
                  ? "Session active. Use Clear demo session to try again."
                  : "Configure .env.local, then use Connect to HMRC to run the OAuth flow."}
              </p>
            </div>

            <a
              href="/api/hmrc/authorize"
              className="catalog-label mt-6 flex w-full min-h-12 items-center justify-center gap-2 bg-gradient-to-r from-[#1a1208] via-[#3d2f0a] to-[#e9c349] px-4 py-3 text-[#FFFFFF] shadow-[0_0_32px_rgba(233,195,73,0.35)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c349]"
            >
              <ExternalLink className="size-4 shrink-0" strokeWidth={1.5} />
              Connect to HMRC
            </a>

            <p className="mt-3 font-sans text-[10px] text-[#8a8a8a] sm:text-xs">
              Same flow as Pulse — sends you to Government Gateway, then{" "}
              <code className="text-[#c6c6c6]">/api/hmrc/callback</code>.
            </p>

            <a
              href="/api/hmrc/authorize"
              className="catalog-label mt-4 inline-flex min-h-10 items-center gap-2 text-[#c6c6c6] hover:text-[#e9c349]"
            >
              <RefreshCw className="size-4" strokeWidth={1.5} />
              Retry OAuth
            </a>
          </div>
        </section>

        <section
          className="w-full max-w-lg px-1 text-center"
          aria-labelledby="submit-hmrc-heading"
        >
          <h2
            id="submit-hmrc-heading"
            className="catalog-label text-[#e9c349]"
          >
            Submit to HMRC
          </h2>
          <p className="mt-2 font-sans text-xs text-[#c6c6c6] sm:text-sm">
            Quarterly updates and final declaration will call MTD endpoints from
            the server using your token — not wired in this demo build.
          </p>
          <button
            type="button"
            disabled
            className="catalog-label mt-4 min-h-12 w-full cursor-not-allowed bg-[#FFFFFF]/40 px-4 py-3 text-[#0E0E0E]"
          >
            Submit to HMRC (next)
          </button>
        </section>
      </main>
    </div>
  );
}
