import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddSubscriptionForm from "../AddSubscriptionForm";
import * as Api from "../../utils/Api";
import { vi } from "vitest";

vi.mock("../../utils/Api", () => ({
  addSubscription: vi.fn(),
}));

describe("AddSubscriptionForm", () => {
  const mockAddSubscription = Api.addSubscription as jest.Mock;

  beforeEach(() => {
    mockAddSubscription.mockClear();
  });

  it("renders the form correctly", () => {
    render(<AddSubscriptionForm onSuccess={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Add Subscription" })).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    const onSuccess = vi.fn();
    render(<AddSubscriptionForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Subscription Name"), {
      target: { value: "Netflix" },
    });
    fireEvent.change(screen.getByLabelText("Cost (₹)"), {
      target: { value: "12.99" },
    });
    fireEvent.change(screen.getByLabelText("Billing Frequency"), {
      target: { value: "monthly" },
    });
    fireEvent.change(screen.getByLabelText("Renewal Date"), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Entertainment" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Subscription" }));

    await waitFor(() => {
      expect(mockAddSubscription).toHaveBeenCalledTimes(1);
      expect(mockAddSubscription).toHaveBeenCalledWith({
        name: "Netflix",
        cost: 12.99,
        billingFrequency: "monthly",
        renewalDate: "2025-01-01",
        category: "Entertainment",
        notes: "",
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});