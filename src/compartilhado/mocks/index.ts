export async function iniciarMocks() {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_USAR_MOCKS !== "true") return;

  const { worker } = await import("./browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}
