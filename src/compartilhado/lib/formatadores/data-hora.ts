import { format, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { FUSO_HORARIO_PADRAO } from "@/compartilhado/lib/constantes";

export function formatarData(iso: string): string {
  return formatInTimeZone(parseISO(iso), FUSO_HORARIO_PADRAO, "dd/MM/yyyy", {
    locale: ptBR,
  });
}

export function formatarHora(iso: string): string {
  return formatInTimeZone(parseISO(iso), FUSO_HORARIO_PADRAO, "HH:mm", {
    locale: ptBR,
  });
}

export function formatarDataHora(iso: string): string {
  return formatInTimeZone(
    parseISO(iso),
    FUSO_HORARIO_PADRAO,
    "dd/MM/yyyy · HH:mm",
    { locale: ptBR }
  );
}

export function formatarDataCurta(data: Date): string {
  return format(data, "dd/MM", { locale: ptBR });
}

export function paraFusoLocal(iso: string): Date {
  return toZonedTime(parseISO(iso), FUSO_HORARIO_PADRAO);
}
