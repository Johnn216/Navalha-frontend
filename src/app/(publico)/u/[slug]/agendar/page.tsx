import { FluxoAgendamentoPublico } from "@/funcionalidades/agendamento-publico";

export default async function AgendarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FluxoAgendamentoPublico slug={slug} />;
}
