import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Botao } from "../Botao";

describe("Botao", () => {
  it("renderiza children", () => {
    render(<Botao>Salvar</Botao>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("dispara onClick quando clicado", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Botao onClick={onClick}>Clique</Botao>);
    await user.click(screen.getByRole("button", { name: "Clique" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
