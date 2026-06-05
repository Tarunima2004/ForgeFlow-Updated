import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";

function Dashboard() {

  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        User Dashboard
      </h1>

      <p className="mt-4">
        Welcome {user?.name}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>

    </div>
  );
}

export default Dashboard;