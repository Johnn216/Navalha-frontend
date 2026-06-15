import { describe, expect, it } from "vitest";
import { formatarData, formatarHora } from "../data-hora";

describe("formatarData", () => {
  it("formata ISO em dd/MM/yyyy", () => {
    expect(formatarData("2026-06-14T15:00:00.000Z")).toBe("14/06/2026");
  });
});

describe("formatarHora", () => {
  it("formata ISO em HH:mm", () => {
    expect(formatarHora("2026-06-14T15:00:00.000Z")).toBe("12:00");
  });
});
