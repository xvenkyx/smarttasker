import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const name = payload?.name || "User";
  const role = payload?.role || "";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center gap-4">
        {/* <img src="/logo.png" alt="SmartTasker" className="h-8" /> */}
        <Link to="/" className="font-bold text-lg">SmartTasker</Link>
        <Link to="/tasks" className="hover:underline">My Tasks</Link>
        {role === "lead" && (
          <Link to="/assign-task" className="hover:underline">
            Assign Task
          </Link>
        )}
        {role === "admin" && (
          <Link to="/admin/dashboard" className="hover:underline">
            Admin Dashboard
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm">👤 {name} ({role})</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
