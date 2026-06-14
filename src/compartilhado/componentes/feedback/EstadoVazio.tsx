import { Inbox } from "lucide-react";

export function EstadoVazio({
  titulo = "Nada por aqui",
  descricao,
}: {
  titulo?: string;
  descricao?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Inbox className="h-10 w-10 text-ink-mute" aria-hidden />
      <p className="font-serif text-xl text-ink">{titulo}</p>
      {descricao && <p className="max-w-sm text-sm text-ink-soft">{descricao}</p>}
    </div>
  );
}
