import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { getSubscriptions } from "../utils/Api";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isMonthly, setIsMonthly] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const response = await getSubscriptions();
    setSubscriptions(response.data);
  };

  const totalSpend = subscriptions.reduce((sum: number, sub: any) => {
    const cost = isMonthly
      ? sub.billingFrequency === "monthly"
        ? sub.cost
        : sub.cost / 12
      : sub.billingFrequency === "annual"
      ? sub.cost
      : sub.cost * 12;
    return sum + cost;
  }, 0);

  const categories = subscriptions.reduce((acc: { [key: string]: number }, sub: any) => {
    const cost = isMonthly
      ? sub.billingFrequency === "monthly"
        ? sub.cost
        : sub.cost / 12
      : sub.billingFrequency === "annual"
      ? sub.cost
      : sub.cost * 12;
    acc[sub.category] = (acc[sub.category] || 0) + cost;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: `Spending by Category (₹) - ${isMonthly ? "Monthly" : "Annual"}`,
        data: Object.values(categories),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Analytics</h1>

      {/* Toggle for Monthly/Annual View */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <button
          className={`p-3 rounded-full ${
            isMonthly ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setIsMonthly(true)}
          aria-label="Monthly View"
        >
          <IoCalendarOutline size={24} />
        </button>
        <button
          className={`p-3 rounded-full ${
            !isMonthly ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setIsMonthly(false)}
          aria-label="Annual View"
        >
          <IoTimeOutline size={24} />
        </button>
      </div>

      {/* Total Spend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Total Spend ({isMonthly ? "Monthly" : "Annual"}): ₹{totalSpend.toFixed(2)}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Spending by Category ({isMonthly ? "Monthly" : "Annual"})
          </h2>
          <div className="w-full max-w-lg">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Category Distribution</h2>
          <div className="w-full max-w-sm">
            <Pie data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;