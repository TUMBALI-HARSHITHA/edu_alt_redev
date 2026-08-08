import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../NotFound";
describe("NotFound", () => {
  it("renders 404 heading", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeDefined();
    expect(screen.getByText("Page not found")).toBeDefined();
    expect(screen.getByText("Back to Home")).toBeDefined();
  });
  it("has a link back to home", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/");
  });
});
