import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Icon({ name, className = "" }) {
return (
<span
className={`material-symbols-outlined ${className}`}
style={{
fontVariationSettings:
"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
}}
>
{name} </span>
);
}

export default function Navbar() {
const { user, logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
logout();
navigate("/login");
};

return ( <header className="flex items-center justify-between px-4 sticky top-0 z-40 ml-[240px] w-[calc(100%-240px)] h-14 bg-white border-b border-[#c5c5d7]">

```
  {/* Search */}
  <div className="flex items-center flex-1">
    <div className="relative w-full max-w-md">
      <Icon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#454654] text-[20px]"
      />

      <input
        type="text"
        placeholder="Search projects, tasks, or members..."
        className="w-full bg-[#eceef0] border-0 rounded-lg pl-10 pr-4 py-1.5 text-[14px] leading-[20px] outline-none focus:ring-2 focus:ring-[#2036bd] transition-all"
      />
    </div>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-4">

    <button className="text-[#454654] hover:text-[#191c1e] transition-colors bg-transparent border-0 cursor-pointer">
      <Icon name="notifications" />
    </button>

    <button className="text-[#454654] hover:text-[#191c1e] transition-colors bg-transparent border-0 cursor-pointer">
      <Icon name="help_outline" />
    </button>

    <div className="h-6 w-px bg-[#c5c5d7] mx-2" />

    {/* User Profile */}
    <div className="flex items-center gap-2">
      <div className="text-right">

        <p className="text-[12px] leading-[16px] tracking-[0.01em] font-bold text-[#191c1e]">
          {user?.name ?? "User"}
        </p>

        <span className="inline-flex items-center rounded bg-[#3e52d5] px-1.5 py-0.5 text-[10px] font-bold text-[#d7daff]">
          {user?.role?.toUpperCase() ?? "USER"}
        </span>

      </div>

      {user?.avatar && (
        <img
          src={user.avatar}
          alt="User Profile"
          className="w-8 h-8 rounded-full border border-[#c5c5d7]"
        />
      )}
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#454654] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors border border-[#c5c5d7] bg-transparent cursor-pointer"
    >
      <Icon
        name="logout"
        className="text-[18px]"
      />
      Logout
    </button>

  </div>
</header>

);
}
