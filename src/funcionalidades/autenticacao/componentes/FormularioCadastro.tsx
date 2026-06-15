"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { cadastrar } from "@/compartilhado/lib/api/servicos/autenticacao.servico";
import { useSessao } from "@/funcionalidades/autenticacao/hooks/useSessao";
import { esquemaCadastro, type FormularioCadastro } from "@/funcionalidades/autenticacao/esquemas";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FormularioCadastro() {
  const { entrarComToken } = useSessao();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioCadastro>({ resolver: zodResolver(esquemaCadastro) });

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
