import React, { useState } from "react";
import { addSubscription } from "../utils/Api";

interface AddSubscriptionFormProps {
  onSuccess: () => void;
}

const AddSubscriptionForm = ({ onSuccess }: AddSubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    billingFrequency: "monthly",
    renewalDate: "",
    category: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, cost, billingFrequency, renewalDate, category, notes } = formData;

    if (!name || !cost || !billingFrequency || !renewalDate || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addSubscription({
        name,
        cost: parseFloat(cost),
        billingFrequency,
        renewalDate,
        category,
        notes,
      });
      onSuccess();
      setFormData({
        name: "",
        cost: "",
        billingFrequency: "monthly",
        renewalDate: "",
        category: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription. Please try again.");
    }
  };

  const renderInputField = (
    id: string,
    label: string,
    type: string,
    placeholder?: string,
    isRequired: boolean = true
  ) => (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={(formData as any)[id]} 
        onChange={handleInputChange}
        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={isRequired}
        autoComplete="off"
      />
    </div>
  );

  return (
    <div >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg"
        role="form"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Subscription
        </h2>

        {renderInputField("name", "Subscription Name", "text", "Slack, Zoom...")}
        {renderInputField("cost", "Cost (₹)", "number", "0")}
        
        <div className="mb-5">
          <label
            htmlFor="billingFrequency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Billing Frequency
          </label>
          <select
            id="billingFrequency"
            name="billingFrequency"
            value={formData.billingFrequency}
            onChange={handleInputChange}
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {renderInputField("renewalDate", "Renewal Date", "date")}
        {renderInputField(
          "category",
          "Category",
          "text",
          "Productivity, Communication..."
        )}

        <div className="mb-5">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Additional details"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Add Subscription
        </button>
      </form>
    </div>
  );
};

export default AddSubscriptionForm;