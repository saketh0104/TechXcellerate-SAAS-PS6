import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { vi } from "vitest";

vi.mock("../pages/Dashboard", () => ({
  default: () => <div>Mocked Dashboard</div>,
}));

vi.mock("../pages/Analytics", () => ({
  default: () => <div>Mocked Analytics</div>,
}));

vi.mock("../pages/Login", () => ({
  default: ({ onLogin }: { onLogin: (token: string) => void }) => (
    <div>
      <button onClick={() => onLogin("test-token")}>Mocked Login</button>
    </div>
  ),
}));

vi.mock("../pages/Register", () => ({
  default: () => <div>Mocked Register</div>,
}));

vi.mock("../pages/ForgotPassword", () => ({
  default: () => <div>Mocked Forgot Password</div>,
}));

vi.mock("../pages/ResetPassword", () => ({
  default: () => <div>Mocked Reset Password</div>,
}));

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the public navigation for unauthenticated users", () => {
    render(
      <App Router={MemoryRouter} />
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("redirects to login when accessing private routes while unauthenticated", () => {
    render(
      <App Router={MemoryRouter} />
    );

    expect(screen.getByText("Mocked Login")).toBeInTheDocument();
  });

  it("renders authenticated navigation and routes after login", () => {
    render(
      <App Router={MemoryRouter} />
    );

    fireEvent.click(screen.getByText("Mocked Login"));

    expect(localStorage.getItem("token")).toBe("test-token");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("logs out the user and redirects to login", () => {
    localStorage.setItem("token", "test-token");

    render(
      <App Router={MemoryRouter} />
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByText("Mocked Login")).toBeInTheDocument();
  });
});