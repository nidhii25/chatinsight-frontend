import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Branding */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ChatScope
          </h1>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-700 font-medium hover:text-indigo-600"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="text-gray-700 font-medium hover:text-indigo-600"
          >
            Reports
          </button>
          <button
            onClick={logout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>

          <span className="text-gray-800 font-semibold">{user?.name}</span>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
