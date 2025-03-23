import React, { useEffect, useState } from "react";
import {
  getSubscriptions,
  deleteSubscription,
  updateSubscription,
} from "../utils/Api";
import SubscriptionCard from "../components/SubscriptionCard";
import AddSubscriptionForm from "../components/AddSubscriptionForm";
import { IoAdd, IoClose, IoDownload } from "react-icons/io5";
import { exportToExcel } from "../utils/exportToExcel";
import Loader from "../components/Loader";

interface Subscription {
  _id: string;
  name: string;
  cost: number;
  billingFrequency: string;
  renewalDate: string;
  category: string;
  notes?: string;
}

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    const response = await getSubscriptions();
    const subscriptionData: Subscription[] = response.data;
    setSubscriptions(subscriptionData);

    const uniqueCategories = [
      ...new Set(subscriptionData.map((sub) => sub.category)),
    ];
    setCategories(uniqueCategories);
    setFilteredSubscriptions(subscriptionData);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSubscription(id);
    fetchSubscriptions();
  };

  const handleSave = async (updatedSubscription: any) => {
    await updateSubscription(updatedSubscription._id, updatedSubscription);
    fetchSubscriptions();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter((sub: any) => sub.category === category);
      setFilteredSubscriptions(filtered);
    }
  };

  const handleExportToExcel = () => {
    exportToExcel(subscriptions, "subscriptions");
  };

  const handleEditCard = (id: string | null) => {
    setEditingSubscriptionId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 lg:px-16">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            aria-label="Select category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportToExcel}
            className="text-green-600 hover:text-green-800 p-2 rounded-full focus:outline-none"
            aria-label="Export subscriptions to Excel"
          >
            <IoDownload size={24} />
          </button>
        </div>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
        <section>
          {filteredSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((subscription: any) => (
                <SubscriptionCard
                  key={subscription._id}
                  subscription={subscription}
                  onDelete={handleDelete}
                  onSave={handleSave}
                  isEditingCard={editingSubscriptionId === subscription._id}
                  onEditCard={handleEditCard}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500 text-lg">
                No subscriptions found in this category.
              </p>
            </div>
          )}
        </section>
      )}

      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add new subscription"
      >
        <IoAdd size={24} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <IoClose size={24} />
            </button>
            <AddSubscriptionForm
              onSuccess={() => {
                fetchSubscriptions();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
