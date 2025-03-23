import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Analytics from "../Analytics";
import { getSubscriptions } from "../../utils/Api";
import { vi } from 'vitest';

vi.mock("../../utils/Api", () => ({
  getSubscriptions: vi.fn(),
}));

vi.mock("react-chartjs-2", () => ({
  Bar: () => <div>Mocked Bar Chart</div>,
  Pie: () => <div>Mocked Pie Chart</div>,
}));

const mockSubscriptions = [
  { id: 1, name: "Netflix", cost: 10, billingFrequency: "monthly", category: "Entertainment" },
  { id: 2, name: "Amazon Prime", cost: 120, billingFrequency: "annual", category: "Shopping" },
  { id: 3, name: "Spotify", cost: 5, billingFrequency: "monthly", category: "Music" },
];

describe("Analytics Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getSubscriptions as jest.Mock).mockResolvedValue({ data: mockSubscriptions });
  });

  it("renders the Analytics component", async () => {
    render(<Analytics />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();

    await waitFor(() => expect(getSubscriptions).toHaveBeenCalledTimes(1));
  });

  it("displays monthly total spend correctly", async () => {
    render(<Analytics />);
    await waitFor(() => expect(getSubscriptions).toHaveBeenCalledTimes(1));
  
    const totalSpend = screen.getByText((_, element) => {
      if (!element) return false;
      const hasText = element.textContent?.includes("Total Spend (Monthly): ₹25.00");
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !child.textContent?.includes("Total Spend (Monthly): ₹25.00")
      );
      return !!hasText && childrenDontHaveText;
    });
    expect(totalSpend).toBeInTheDocument();
  });

  it("displays annual total spend correctly when toggled", async () => {
    render(<Analytics />);
    await waitFor(() => expect(getSubscriptions).toHaveBeenCalledTimes(1));
  
    const annualButton = screen.getByLabelText("Annual View");
    fireEvent.click(annualButton);
  
    const totalSpend = screen.getByText((_, element) => {
      if (!element) return false;
      const hasText:any = element.textContent?.includes("Total Spend (Annual): ₹300.00");
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !child.textContent?.includes("Total Spend (Annual): ₹300.00")
      );
      return !!hasText && childrenDontHaveText;
    });
    expect(totalSpend).toBeInTheDocument();
  });

  it("renders bar and pie charts correctly", async () => {
    render(<Analytics />);
    await waitFor(() => expect(getSubscriptions).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Mocked Bar Chart")).toBeInTheDocument();
    expect(screen.getByText("Mocked Pie Chart")).toBeInTheDocument();
  });

  it("updates charts when toggling between monthly and annual views", async () => {
    render(<Analytics />);
    await waitFor(() => expect(getSubscriptions).toHaveBeenCalledTimes(1));

    const monthlyButton = screen.getByLabelText("Monthly View");
    const annualButton = screen.getByLabelText("Annual View");

    fireEvent.click(annualButton);
    expect(screen.getByText("Mocked Bar Chart")).toBeInTheDocument();

    fireEvent.click(monthlyButton);
    expect(screen.getByText("Mocked Pie Chart")).toBeInTheDocument();
  });
});