import { cookies } from "next/headers";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  EyeOff,
  Info,
  ShieldCheck,
} from "lucide-react";
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
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden overscroll-none bg-[#131313]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-20"
        aria-hidden
      >
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] bg-[#e0ccab]/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] bg-[#bfcdff]/5 blur-[120px]" />
      </div>

      <div className="shrink-0 px-4 pt-3 sm:px-8 sm:pt-4">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#d0c5af] transition-colors hover:text-[#e0ccab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e0ccab]"
        >
          <ArrowLeft className="size-5" strokeWidth={1.25} />
          Back to summary
        </Link>
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
        {hmrc === "missing_env" ? (
          <div
            className="mb-3 w-full max-w-xl shrink-0 border border-[#ffb4ab]/30 bg-[#1c1b1b] px-3 py-2 font-sans text-xs text-[#ffb4ab]"
            role="alert"
          >
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest">
              Configuration
            </p>
            <p className="mt-2 text-xs text-[#d0c5af]">
              Add to <code className="text-[#e0ccab]">.env.local</code> then
              restart dev:
            </p>
            <p className="mt-2 break-all text-xs text-[#e5e2e1]">
              {detail || "HMRC_CLIENT_ID, HMRC_CLIENT_SECRET, HMRC_REDIRECT_URI"}
            </p>
          </div>
        ) : null}

        {(hmrc === "token_error" ||
          hmrc === "access_denied" ||
          hmrc === "state_mismatch" ||
          hmrc === "invalid_callback") && (
          <div
            className="mb-3 w-full max-w-xl shrink-0 border border-[#ffb4ab]/30 bg-[#1c1b1b] px-3 py-2 text-xs"
            role="alert"
          >
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#ffb4ab]">
              Connection issue
            </p>
            <p className="mt-2 text-xs text-[#d0c5af]">
              {msg ||
                "Try Connect again. Confirm scopes and redirect URI in HMRC Developer Hub."}
            </p>
          </div>
        )}

        {showConnected ? (
          <div className="mb-3 w-full max-w-xl shrink-0 border border-[#e0ccab]/20 bg-[#142818]/40 px-3 py-2">
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e0ccab]">
              Connected
            </p>
            <p className="mt-2 text-xs text-[#d0c5af]">
              HMRC issued an access token (demo session). MTD Income Tax calls run
              from the server next.
            </p>
            <Link
              href="/api/hmrc/disconnect"
              className="mt-3 inline-block font-sans text-[10px] font-bold uppercase tracking-widest text-[#e0ccab] hover:underline"
            >
              Clear demo session
            </Link>
          </div>
        ) : null}

        <div className="relative w-full max-w-xl shrink-0 overflow-hidden border border-[#4d4635]/15 bg-[#1c1b1b] p-5 sm:p-6">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#e0ccab]/25 to-transparent" />
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 border border-[#4d4635]/10 bg-[#353534] p-3">
              <Building2
                className="size-10 text-[#e0ccab] sm:size-11"
                strokeWidth={1.15}
                aria-hidden
              />
            </div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-[#e5e2e1] sm:text-2xl">
              Connect HMRC account
            </h1>
            <p className="mt-2 max-w-md font-sans text-xs leading-relaxed text-[#d0c5af] sm:text-sm">
              Authorize{" "}
              <span className="font-medium text-[#e5e2e1]">SabaiTax UK</span> to
              sync Making Tax Digital Income Tax data via Government Gateway.
              Sandbox or live is controlled by your environment.
            </p>

            <div className="mb-5 mt-4 grid w-full grid-cols-1 gap-2 text-left sm:grid-cols-2 sm:gap-3">
              <div className="border border-[#4d4635]/10 bg-[#0e0e0e] p-3">
                <div className="mb-2 flex items-center gap-3">
                  <ShieldCheck
                    className="size-[18px] shrink-0 text-[#bfcdff]"
                    strokeWidth={1.25}
                  />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e5e2e1]">
                    Secure protocol
                  </span>
                </div>
                <p className="font-sans text-[11px] leading-normal text-[#d0c5af]">
                  OAuth 2.0 encrypted connection via Government Gateway.
                </p>
              </div>
              <div className="border border-[#4d4635]/10 bg-[#0e0e0e] p-3">
                <div className="mb-2 flex items-center gap-3">
                  <EyeOff
                    className="size-[18px] shrink-0 text-[#bfcdff]"
                    strokeWidth={1.25}
                  />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e5e2e1]">
                    No password storage
                  </span>
                </div>
                <p className="font-sans text-[11px] leading-normal text-[#d0c5af]">
                  SabaiTax UK never stores your Government Gateway password.
                </p>
              </div>
            </div>

            <a
              href="/api/hmrc/authorize"
              className="mb-3 flex w-full min-h-11 items-center justify-center gap-2 bg-[#e0ccab] px-4 py-3 font-sans text-xs font-bold uppercase tracking-widest text-[#3a2f18] transition-all hover:bg-[#c3b191] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0ccab]"
            >
              <span>Connect to HMRC</span>
              <ExternalLink className="size-[18px]" strokeWidth={1.5} />
            </a>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#99907c]/80">
              You will be redirected to the official GOV.UK sign-in.
            </p>
          </div>
        </div>

        <div className="mt-2 w-full max-w-xl shrink-0 px-1">
          <div className="flex items-start gap-4">
            <Info
              className="size-5 shrink-0 text-[#99907c]"
              strokeWidth={1.25}
            />
            <div>
              <h3 className="mb-1 font-sans text-xs font-bold uppercase tracking-widest text-[#e5e2e1]">
                Authorization details
              </h3>
              <p className="font-sans text-xs leading-relaxed text-[#d0c5af]">
                Access can last up to 18 months unless revoked. Disconnect from
                this screen when you need a clean demo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="pointer-events-none shrink-0 py-2 text-center sm:py-3">
        <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#99907c]/40">
          SabaiTax UK • Intelligence command
        </span>
      </footer>
    </div>
  );
}
