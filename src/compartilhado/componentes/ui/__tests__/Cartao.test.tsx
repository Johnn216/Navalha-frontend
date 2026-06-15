import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cartao } from "../Cartao";

describe("Cartao", () => {
  it("renderiza titulo e children", () => {
    render(
      <Cartao titulo="Resumo">
        <p>Conteúdo do cartão</p>
      </Cartao>
    );
    expect(screen.getByRole("heading", { name: "Resumo" })).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do cartão")).toBeInTheDocument();
  });
});
