import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { vi } from "vitest";

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <Login onLogin={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("submits login form with valid data", async () => {
    const onLogin = vi.fn();

    global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve({ token: "mock-token" }),
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

    render(
      <BrowserRouter>
        <Login onLogin={onLogin} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(global.fetch).toHaveBeenCalledWith(
      "https://saas-subscription-manager.onrender.com/api/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    );

    await screen.findByRole("heading", { name: "Login" });

    expect(onLogin).toHaveBeenCalledWith("mock-token");
    expect(localStorage.getItem("token")).toBe("mock-token");
  });
});