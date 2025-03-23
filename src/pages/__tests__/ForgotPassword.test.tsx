import { render, screen, fireEvent } from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";
import { vi } from "vitest";

describe("ForgotPassword Page", () => {
  it("renders Forgot Password form", () => {
    render(<ForgotPassword />);
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
  });

  it("submits forgot password form", async () => {
    global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  ) as unknown as typeof fetch;

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Password reset email sent. Check your inbox.")
    ).toBeInTheDocument();
  });
});