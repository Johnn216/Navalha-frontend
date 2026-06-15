import { describe, expect, it } from "vitest";
import { esquemaCadastro, esquemaEntrar } from "../esquemas";

describe("esquemaEntrar", () => {
  it("rejeita email inválido", () => {
    const result = esquemaEntrar.safeParse({ email: "foo", password: "123456" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha curta", () => {
    const result = esquemaEntrar.safeParse({ email: "a@b.com", password: "123" });
    expect(result.success).toBe(false);
  });

  it("aceita payload válido", () => {
    const result = esquemaEntrar.safeParse({
      email: "a@b.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });
});

describe("esquemaCadastro", () => {
  it("rejeita nome curto", () => {
    const result = esquemaCadastro.safeParse({
      name: "A",
      email: "a@b.com",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });
});
