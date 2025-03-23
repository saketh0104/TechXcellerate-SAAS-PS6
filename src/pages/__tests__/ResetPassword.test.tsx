import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "../ResetPassword";
import { vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ token: "mock-token" }),
  };
});

describe("ResetPassword", () => {
  it("submits new password and redirects on success", async () => {
    global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      redirected: false,
      type: "default",
      url: "http://localhost",
      clone: () => this,
      body: null,
      bodyUsed: false,
      text: async () => "",
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      json: async () => ({ message: "Password reset successfully" }),
    })
  ) as unknown as typeof fetch;

    const mockNavigate = vi.fn();
    render(<ResetPassword onNavigate={mockNavigate} />);

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://saas-subscription-manager.onrender.com/api/reset-password/mock-token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "newpassword123" }),
        })
      )
    );

    await waitFor(() =>
      expect(screen.getByText("Password reset successfully. Redirecting to login...")).toBeInTheDocument()
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows error message when reset fails", async () => {
    global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: () => Promise.resolve({ error: "Invalid token" }),
      headers: new Headers(),
      redirected: false,
      type: "default",
      url: "http://localhost",
      clone: () => this,
      body: null,
      bodyUsed: false,
      text: async () => "",
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    })
  ) as unknown as typeof fetch;

    render(<ResetPassword />);

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://saas-subscription-manager.onrender.com/api/reset-password/mock-token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "newpassword123" }),
        })
      )
    );

    await waitFor(() => expect(screen.getByText("Invalid token")).toBeInTheDocument());
  });
});