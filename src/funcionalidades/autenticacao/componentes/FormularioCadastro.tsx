"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { cadastrar } from "@/compartilhado/lib/api/servicos/autenticacao.servico";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import Link from "next/link";
import { useRouter } from "next/navigation";

const esquema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
});

type Formulario = z.infer<typeof esquema>;

export function FormularioCadastro() {
  const { entrarComToken } = useSessao();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formulario>({ resolver: zodResolver(esquema) });

  const mutacao = useMutation({
    mutationFn: cadastrar,
    onSuccess: (tokens) => {
      entrarComToken(tokens.access_token, tokens.refresh_token);
      router.push("/onboarding");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => mutacao.mutate(d))}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <h1 className="font-serif text-3xl">
        Criar conta <span className="italic text-accent">Navalha</span>
      </h1>
      <Entrada rotulo="Nome" erro={errors.name?.message} {...register("name")} />
      <Entrada rotulo="E-mail" type="email" erro={errors.email?.message} {...register("email")} />
      <Entrada rotulo="Telefone" erro={errors.phone?.message} {...register("phone")} />
      <Entrada rotulo="Senha" type="password" erro={errors.password?.message} {...register("password")} />
      <Botao type="submit" disabled={mutacao.isPending}>
        {mutacao.isPending ? "Criando..." : "Começar trial · 14 dias"}
      </Botao>
      <Link href="/entrar" className="text-center text-sm text-accent hover:underline">
        Já tenho conta
      </Link>
    </form>
  );
}
