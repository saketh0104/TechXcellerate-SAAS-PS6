import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import Dashboard from "../Dashboard";
import * as Api from "../../utils/Api"; 
import { AxiosResponse, AxiosHeaders } from "axios"; 

describe("Dashboard Page", () => {
  const mockGetSubscriptions = vi.spyOn(Api, "getSubscriptions").mockResolvedValue({
    data: [
      {
        _id: "1",
        name: "Netflix",
        cost: 12.99,
        billingFrequency: "monthly",
        renewalDate: "2025-01-21",
        category: "Entertainment",
      },
      {
        _id: "2",
        name: "Spotify",
        cost: 9.99,
        billingFrequency: "monthly",
        renewalDate: "2025-02-01",
        category: "Music",
      },
    ],
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  } as AxiosResponse);

  it("renders the Dashboard with header", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
  });

  it("fetches and displays subscriptions", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Netflix")).toBeInTheDocument();
      expect(screen.getByText("Spotify")).toBeInTheDocument();
    });
  });

  it("filters subscriptions by category", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Netflix")).toBeInTheDocument();
      expect(screen.getByText("Spotify")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Entertainment" } });

    await waitFor(() => {
      expect(screen.getByText("Netflix")).toBeInTheDocument();
      expect(screen.queryByText("Spotify")).not.toBeInTheDocument();
    });
  });

  it("displays a message when no subscriptions are found", async () => {
    mockGetSubscriptions.mockResolvedValueOnce({ data: [], status: 200, statusText: "OK", headers: new AxiosHeaders(), 
    config: {
      headers: new AxiosHeaders(), 
        method: "get", 
        url: "/subscriptions", 
        params: {}, 
      }, });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("No subscriptions found in this category.")).toBeInTheDocument();
    });
  });
});