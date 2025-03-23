import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-[-150px] w-[400px] h-[400px] bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-200px] w-[500px] h-[500px] bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Hero Content */}
      <div className="z-10 text-center px-6">
        {/* Logo */}
        <div className="animate-fadeIn animate-delay-500 mb-12">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-48 h-auto mx-auto transition-transform duration-500 ease-in-out transform hover:scale-110"
          />
        </div>

        {/* Headline */}
        <div className="animate-fadeIn animate-delay-1000 mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Take Charge of Your Subscriptions
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto mt-4">
            Simplify your life and manage all your SaaS subscriptions in one beautiful, easy-to-use platform.
          </p>
        </div>

        {/* Call to Action */}
        <div className="animate-fadeIn animate-delay-1500">
          <Link
            to="/login"
            className="bg-blue-600 text-white text-lg py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;