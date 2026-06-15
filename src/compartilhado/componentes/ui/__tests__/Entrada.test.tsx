import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Entrada } from "../Entrada";

describe("Entrada", () => {
  it("exibe rotulo", () => {
    render(<Entrada rotulo="E-mail" />);
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("exibe mensagem de erro", () => {
    render(<Entrada rotulo="Senha" erro="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });
});
