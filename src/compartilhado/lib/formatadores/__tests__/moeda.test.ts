import { describe, expect, it } from "vitest";
import { formatarBRL, formatarBRLCompacto } from "../moeda";

describe("formatarBRL", () => {
  it("formata zero", () => {
    expect(formatarBRL(0)).toBe("R$\u00a00,00");
  });

  it("formata centavos em reais", () => {
    expect(formatarBRL(1500)).toBe("R$\u00a015,00");
  });

  it("formata valor negativo", () => {
    expect(formatarBRL(-500)).toBe("-R$\u00a05,00");
  });
});

describe("formatarBRLCompacto", () => {
  it("formata valores grandes em k", () => {
    expect(formatarBRLCompacto(150000)).toBe("R$ 1,5k");
  });
});
