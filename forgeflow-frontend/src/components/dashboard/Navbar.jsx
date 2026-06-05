import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-3 py-2 w-72"
      />

      <div className="flex items-center gap-4">

        <button>
          🔔
        </button>

        <button>
          ❓
        </button>

        <div className="font-semibold">
          Admin
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;