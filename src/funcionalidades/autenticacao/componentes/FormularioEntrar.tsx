"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { entrar } from "@/compartilhado/lib/api/servicos/autenticacao.servico";
import { obterMe } from "@/compartilhado/lib/api/servicos/autenticacao.servico";
import {
  useRedirecionarPosLogin,
  useSessao,
} from "@/funcionalidades/autenticacao/hooks/useSessao";
import { esquemaEntrar, type FormularioEntrar } from "@/funcionalidades/autenticacao/esquemas";
import { Entrada } from "@/compartilhado/componentes/ui/Entrada";
import { Botao } from "@/compartilhado/componentes/ui/Botao";
import Link from "next/link";

export function FormularioEntrar() {
  const { entrarComToken } = useSessao();
  const redirecionar = useRedirecionarPosLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioEntrar>({ resolver: zodResolver(esquemaEntrar) });

  const mutacao = useMutation({
    mutationFn: entrar,
    onSuccess: async (tokens) => {
      entrarComToken(tokens.access_token, tokens.refresh_token);
      const me = await obterMe();
      redirecionar(me.role);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => mutacao.mutate(d))}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <h1 className="font-serif text-3xl">
        Entrar na <span className="italic text-accent">Navalha</span>
      </h1>
      <Entrada rotulo="E-mail" type="email" erro={errors.email?.message} {...register("email")} />
      <Entrada rotulo="Senha" type="password" erro={errors.password?.message} {...register("password")} />
      {mutacao.isError && (
        <p className="text-sm text-danger">E-mail ou senha incorretos.</p>
      )}
      <Botao type="submit" disabled={mutacao.isPending}>
        {mutacao.isPending ? "Entrando..." : "Entrar"}
      </Botao>
      <p className="text-center text-sm text-ink-soft">
        Demo: dono@navalha.com / demo123
      </p>
      <Link href="/cadastro" className="text-center text-sm text-accent hover:underline">
        Criar conta
      </Link>
    </form>
  );
}
