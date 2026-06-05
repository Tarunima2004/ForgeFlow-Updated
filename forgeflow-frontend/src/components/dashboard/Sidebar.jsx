import { NavLink } from "react-router-dom";


function Icon({ name, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings:
          "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

const LOGO_SRC =
   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAEuklEQVR4AezcT2wUZRQA8Pe+3W6VvxIgLW0xMREwckEvxKBJ1WyhKLN60JMHTYxHE00PaEI00QsxmujNGKOJnrjYXUjWQttw0YimSDS96UHcKSBiyr+VLe083tulS5cuM7P77TAzzLeZb2fnm/e+nfebb2c3k6YKWnhYWduysqVvrKx9Mjdkn85lS2VeU5ybNWRftbL2X7yesrg2rmVfCyTgCfjck7PreNCPcln7MiLkEfEVRHiM32QzIN7P61gvCLCC63mQ148j18bFFHLZ0qzULLXztutyR8CXHqWMlS29nVpx5U8eYQQQVvE6GQviWi50RGrPDZXeEgvebro0BbR2nV9d6beLfEY+RsB1TTMT0FmrHT+pDMwcEpNmJS8DfPHZ0lZYOfcLIj7TLCGJfQiQY5OfraftbbfX3wDIeOsXFBzhhGWBtycmbZtNHsE0FPYNzmxYWnsdcHCQ0k4KD/PM27I0wLxeIoCwFbtoVKwWe+uAazNnRrjzCW5mcRFAhF03rapRVUCZlgT0brXHPHkKsNU7w8NnNkpgFVB1OR/yZ3y1dJjmLcBWazLzCx9IpBoevrCGf+O9Jhum+RcghFfFTqUXKvxzBTP+U02kCCBgt9gpRc4e6UhQ61ipYifXwB0dGzF5A+1gQOxNXt2dqhh7FSEZwDY9xU7JxbDN/MSniR1/hBPvoAVgALX4wPuOtOb493x64DNwdKwPwmxBn8HAAYMuIOzxDaDmGTCABlBTQDM9JjNQs8oA0w2gJq4BjDvgC7tnIMim6eOZbmagJ5F7gAF09/HcawA9idwDDKC7j+deA+hJ5B5gAN19PPcaQE8i94DQATt9r9C93M7vDR2w8yXd3RGDA7y7dYT2bgZQk94AGkBNAc10MwMNoKaAZnroM7DT9wI1PVpODx2w5SOOWIIB1DwhBjDugNt3roSX3+zx3SRes+aOpoc+A6dPXIXpE1d8F7V95yqIEmLogCI3HWPEBkApJqwWV8TIAMqJiyNipADjiBg5wLghRhIwToiRBYwLYqQB44AYecCoI8YCMMqIgQN63e8THL9Nfice+uwc+G0S73fsduMCB2z3wOKSZwA1z1TiATX9QBFQRXeQpOaLnULCs0kF0K1b7PgjTAawbUk6y4BwCsyjXYFTykH1fbvZSc8jR42q+VT3pFwMk47Rev00Z89umlDF4vpLSPA1mEdrAgRfTU3hdbkGAjld7xHRtdZGSG60WM2lUwdEoApYmOg5xxufczOLDwEE/LRY3HReQquA8gLK3Qf4Wvhb9bV5uqMAz76fLl7ve38xoA5Y+GHjZWf+vr0AVFrcadaNAgT0R8qB548fx/rlrg4ooUcmN9jgpPcSwCXZNu2WABH8q+a79nw3MXDhVi9AA6DsyI/3/l5B5yF+/SO3KC5hHNN4RTnbRid75L+6N7z/MkDZOza2+b/80b6nHIDXWV6+YKQ7eY3gH3LwDbbYLSbNAJoC1gLROXy0/0soZ7YAwUFu/v8CqDZAfJ+JLnK9B6mcObgw3vcFAPJcgqYPF8BavHy55I/17+cm/+XX4m+hb/kaeZJn5mlel2tRMX4m+p+P/m+u59dqbQS5/LGBB7je/VI773NdbgAAAP//xzjIFgAAAAZJREFUAwBG0JhNNGFkgAAAAABJRU5ErkJggg==";

const NAV_LINKS = [
  {
    to: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    to: "/projects",
    icon: "folder_open",
    label: "Projects",
  },
  {
    to: "/issues",
    icon: "bug_report",
    label: "Issues",
  },
  {
    to: "/users",
    icon: "group",
    label: "Users",
  },
  {
    to: "/activity",
    icon: "history",
    label: "Activity",
  },
  {
    to: "/analytics",
    icon: "analytics",
    label: "Analytics",
  },
  {
    to: "/ai-planner",
    icon: "auto_awesome",
    label: "AI Planner",
  },
];

export default function Sidebar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-[0.75rem]
     transition-colors duration-100 text-[14px] leading-[20px]
     ${
       isActive
         ? "bg-[#d0e1fb] text-[#54647a] font-medium"
         : "text-[#454654] hover:bg-[#e6e8ea]"
     }`;

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#f7f9fb] border-r border-[#c5c5d7] flex flex-col gap-2 p-4 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={LOGO_SRC}
          alt="ForgeFlow Logo"
          className="w-10 h-10 object-contain"
        />

        <div>
          <h1 className="text-[18px] leading-[26px] font-semibold text-[#191c1e]">
            ForgeFlow
          </h1>

          <p className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold text-[#454654] opacity-70">
            Enterprise Tier
          </p>
        </div>
      </div>

      {/* New Issue Button */}
      <button className="w-full bg-[#2036bd] text-white py-2 px-4 rounded-[0.75rem] text-[12px] leading-[16px] tracking-[0.01em] font-medium flex items-center justify-center gap-2 mb-2 hover:brightness-110 active:scale-[0.98] transition-all border-0 cursor-pointer">
        <Icon name="add" className="text-[20px]" />
        New Issue
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_LINKS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={navLinkClass}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-[0.75rem] transition-colors duration-100 text-[14px] leading-[20px] mt-4 ${
              isActive
                ? "bg-[#d0e1fb] text-[#54647a] font-medium"
                : "text-[#454654] hover:bg-[#e6e8ea]"
            }`
          }
        >
          <Icon name="settings" />
          <span>Settings</span>
        </NavLink>
      </nav>

    </aside>
  );
}