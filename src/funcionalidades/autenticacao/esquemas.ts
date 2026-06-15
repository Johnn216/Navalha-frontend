import { z } from "zod";

export const esquemaEntrar = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const esquemaCadastro = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
});

export type FormularioEntrar = z.infer<typeof esquemaEntrar>;
export type FormularioCadastro = z.infer<typeof esquemaCadastro>;
