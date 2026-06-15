import { describe, expect, it } from "vitest";
import { pode } from "../permissoes";

describe("pode", () => {
  it("permite barbeiro ver comissão", () => {
    expect(pode({ role: "BARBER" }, "ver_comissao")).toBe(true);
  });

  it("nega quando usuário é null", () => {
    expect(pode(null, "ver_agenda")).toBe(false);
  });
});
