import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Selo } from "../Selo";

describe("Selo", () => {
  it("exibe children", () => {
    render(<Selo>Confirmado</Selo>);
    expect(screen.getByText("Confirmado")).toBeInTheDocument();
  });
});
