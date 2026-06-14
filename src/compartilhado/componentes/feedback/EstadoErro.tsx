import { AlertCircle } from "lucide-react";
import { Botao } from "@/compartilhado/componentes/ui/Botao";

export function EstadoErro({
  mensagem = "Algo deu errado.",
  onTentarNovamente,
}: {
  mensagem?: string;
  onTentarNovamente?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center" role="alert">
      <AlertCircle className="h-10 w-10 text-danger" aria-hidden />
      <p className="max-w-md text-ink-soft">{mensagem}</p>
      {onTentarNovamente && (
        <Botao variante="secundario" onClick={onTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}
