/**
 * Placeholder MTD submission — replace with real HMRC MTD API POST when wired.
 * Preserves OAuth/token flow elsewhere; this only simulates the submission step.
 */
export async function handleSubmitToHMRC(): Promise<{ ok: true } | { ok: false; message: string }> {
  await new Promise((r) => setTimeout(r, 1600));
  return { ok: true };
}
