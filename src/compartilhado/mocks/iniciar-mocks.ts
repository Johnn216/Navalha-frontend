export async function iniciarMocks() {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_USAR_MOCKS !== "true") return;

  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("@/compartilhado/mocks/handlers");

  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
}
