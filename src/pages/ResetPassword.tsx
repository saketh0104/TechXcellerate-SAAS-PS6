import { useState } from "react";
import { useParams } from "react-router-dom";

function ResetPassword({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://saas-subscription-manager.onrender.com/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        if (onNavigate) {
          onNavigate("/login"); 
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default ResetPassword;