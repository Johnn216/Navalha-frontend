export type EventoTempoReal =
  | { type: "appointment_updated"; appointment_id: string; status: string }
  | { type: "whatsapp_message"; count: number }
  | { type: "waitlist_updated"; count: number }
  | { type: "payment_updated"; payment_id: string; status: string };

export function conectarTempoReal(
  unit_id: string,
  onEvento: (evento: EventoTempoReal) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ??
    "http://localhost:3001";
  const wsUrl = base.replace("http", "ws") + `/realtime?unit_id=${unit_id}`;

  let ws: WebSocket | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  if (process.env.NEXT_PUBLIC_USAR_MOCKS === "true") {
    timer = setInterval(() => {
      onEvento({ type: "whatsapp_message", count: 7 });
    }, 30000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }

  try {
    ws = new WebSocket(wsUrl);
    ws.onmessage = (ev) => {
      try {
        onEvento(JSON.parse(ev.data) as EventoTempoReal);
      } catch {
        /* ignore */
      }
    };
  } catch {
    /* fallback silencioso */
  }

  return () => {
    ws?.close();
    if (timer) clearInterval(timer);
  };
}
