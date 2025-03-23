import { render, screen, fireEvent } from "@testing-library/react";
import SubscriptionCard from "../SubscriptionCard";
import { vi } from "vitest";

describe("SubscriptionCard", () => {
  const mockSubscription = {
    _id: "1",
    name: "Netflix",
    cost: 12.99,
    billingFrequency: "monthly",
    renewalDate: "2025-01-01",
    category: "Entertainment",
    notes: "Watch movies and TV shows",
  };

  const onDeleteMock = vi.fn();
  const onSaveMock = vi.fn();
  const onEditCardMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders subscription details correctly", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onDelete={onDeleteMock}
        onSave={onSaveMock}
        isEditingCard={false}
        onEditCard={onEditCardMock}
      />
    );

    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Cost: ₹12.99/monthly")).toBeInTheDocument();
    expect(
      screen.getByText("Renewal Date: Wed Jan 01 2025")
    ).toBeInTheDocument();
    expect(screen.getByText("Category: Entertainment")).toBeInTheDocument();
  });

  it("opens and closes the notes modal", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onDelete={onDeleteMock}
        onSave={onSaveMock}
        isEditingCard={false}
        onEditCard={onEditCardMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Notes" }));
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText(mockSubscription.notes)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close Notes" }));
    expect(screen.queryByText("Notes")).not.toBeInTheDocument();
  });

  it("enters and exits edit mode", () => {
    let isEditingCard = false;
  
    const { rerender } = render(
      <SubscriptionCard
        subscription={mockSubscription}
        onDelete={onDeleteMock}
        onSave={onSaveMock}
        isEditingCard={isEditingCard}
        onEditCard={() => {
          isEditingCard = !isEditingCard;
          rerender(
            <SubscriptionCard
              subscription={mockSubscription}
              onDelete={onDeleteMock}
              onSave={onSaveMock}
              isEditingCard={isEditingCard}
              onEditCard={onEditCardMock}
            />
          );
        }}
      />
    );
  
    fireEvent.click(screen.getByRole("button", { name: "Edit Subscription" }));

    expect(screen.getByDisplayValue("Netflix")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12.99")).toBeInTheDocument();
  
    fireEvent.click(screen.getByRole("button", { name: "Cancel Edit" }));
    expect(screen.getByDisplayValue("Netflix")).toBeInTheDocument();
  });

  it("saves changes when in edit mode", () => {
    let isEditingCard = false;

    const { rerender } = render(
      <SubscriptionCard
        subscription={mockSubscription}
        onDelete={onDeleteMock}
        onSave={onSaveMock}
        isEditingCard={isEditingCard}
        onEditCard={() => {
          isEditingCard = !isEditingCard;
          rerender(
            <SubscriptionCard
              subscription={mockSubscription}
              onDelete={onDeleteMock}
              onSave={onSaveMock}
              isEditingCard={isEditingCard}
              onEditCard={onEditCardMock}
            />
          );
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Subscription" }));

    const nameInput = screen.getByDisplayValue("Netflix");
    fireEvent.change(nameInput, { target: { value: "Hulu" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(onSaveMock).toHaveBeenCalledWith({
      ...mockSubscription,
      name: "Hulu",
    });
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <SubscriptionCard
        subscription={mockSubscription}
        onDelete={onDeleteMock}
        onSave={onSaveMock}
        isEditingCard={false}
        onEditCard={onEditCardMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete Subscription" }));
    expect(onDeleteMock).toHaveBeenCalledWith(mockSubscription._id);
  });
});