// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboard.jsx
// Production-ready ForgeFlow dashboard component.
//
// Required dependencies (add to your project if not already present):
//   npm install react-router-dom
//
// Required in your project's index.html (or index.css / global CSS):
//   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" />
//   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
//
// Required in your global CSS (index.css / App.css):
//   .material-symbols-outlined {
//     font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//   }
//
// Required tailwind.config.js additions — merge into your existing config:
//   See the comment block at the bottom of this file.
//
// Required routes in your router (e.g. App.jsx):
//   <Route path="/dashboard"   element={<AdminDashboard />} />
//   <Route path="/projects"    element={<Projects />} />
//   <Route path="/issues"      element={<Issues />} />
//   <Route path="/users"       element={<Users />} />
//   <Route path="/activity"    element={<Activity />} />
//   <Route path="/analytics"   element={<Analytics />} />
//   <Route path="/ai-planner"  element={<AIPlanner />} />
//   <Route path="/settings"    element={<Settings />} />
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path to your AuthContext

// ─── Logo (base64 inline so no extra asset file is needed) ───────────────────
const LOGO_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAEuklEQVR4AezcT2wUZRQA8Pe+3W6VvxIgLW0xMREwckEvxKBJ1WyhKLN60JMHTYxHE00PaEI00QsxmujNGKOJnrjYXUjWQttw0YimSDS96UHcKSBiyr+VLe083tulS5cuM7P77TAzzLeZb2fnm/e+nfebb2c3k6YKWnhYWduysqVvrKx9Mjdkn85lS2VeU5ybNWRftbL2X7yesrg2rmVfCyTgCfjck7PreNCPcln7MiLkEfEVRHiM32QzIN7P61gvCLCC63mQ148j18bFFHLZ0qzULLXztutyR8CXHqWMlS29nVpx5U8eYQQQVvE6GQviWi50RGrPDZXeEgvebro0BbR2nV9d6beLfEY+RsB1TTMT0FmrHT+pDMwcEpNmJS8DfPHZ0lZYOfcLIj7TLCGJfQiQY5OfraftbbfX3wDIeOsXFBzhhGWBtycmbZtNHsE0FPYNzmxYWnsdcHCQ0k4KD/PM27I0wLxeIoCwFbtoVKwWe+uAazNnRrjzCW5mcRFAhF03rapRVUCZlgT0brXHPHkKsNU7w8NnNkpgFVB1OR/yZ3y1dJjmLcBWazLzCx9IpBoevrCGf+O9Jhum+RcghFfFTqUXKvxzBTP+U02kCCBgt9gpRc4e6UhQ61ipYifXwB0dGzF5A+1gQOxNXt2dqhh7FSEZwDY9xU7JxbDN/MSniR1/hBPvoAVgALX4wPuOtOb493x64DNwdKwPwmxBn8HAAYMuIOzxDaDmGTCABlBTQDM9JjNQs8oA0w2gJq4BjDvgC7tnIMim6eOZbmagJ5F7gAF09/HcawA9idwDDKC7j+deA+hJ5B5gAN19PPcaQE8i94DQATt9r9C93M7vDR2w8yXd3RGDA7y7dYT2bgZQk94AGkBNAc10MwMNoKaAZnroM7DT9wI1PVpODx2w5SOOWIIB1DwhBjDugNt3roSX3+zx3SRes+aOpoc+A6dPXIXpE1d8F7V95yqIEmLogCI3HWPEBkApJqwWV8TIAMqJiyNipADjiBg5wLghRhIwToiRBYwLYqQB44AYecCoI8YCMMqIgQN63e8THL9Nfice+uwc+G0S73fsduMCB2z3wOKSZwA1z1TiATX9QBFQRXeQpOaLnULCs0kF0K1b7PgjTAawbUk6y4BwCsyjXYFTykH1fbvZSc8jR42q+VT3pFwMk47Rev00Z89umlDF4vpLSPA1mEdrAgRfTU3hdbkGAjld7xHRtdZGSG60WM2lUwdEoApYmOg5xxufczOLDwEE/LRY3HReQquA8gLK3Qf4Wvhb9bV5uqMAz76fLl7ve38xoA5Y+GHjZWf+vr0AVFrcadaNAgT0R8qB548fx/rlrg4ooUcmN9jgpPcSwCXZNu2WABH8q+a79nw3MXDhVi9AA6DsyI/3/l5B5yF+/SO3KC5hHNN4RTnbRid75L+6N7z/MkDZOza2+b/80b6nHIDXWV6+YKQ7eY3gH3LwDbbYLSbNAJoC1gLROXy0/0soZ7YAwUFu/v8CqDZAfJ+JLnK9B6mcObgw3vcFAPJcgqYPF8BavHy55I/17+cm/+XX4m+hb/kaeZJn5mlel2tRMX4m+p+P/m+u59dqbQS5/LGBB7je/VI773NdbgAAAP//xzjIFgAAAAZJREFUAwBG0JhNNGFkgAAAAABJRU5ErkJggg==";

// ─── Static data arrays (replace with API state once backend is ready) ────────

const STATS_DATA = [
  {
    id: "total-projects",
    icon: "folder",
    iconColor: "text-[#2036bd]",
    iconBg: "bg-[#dfe0ff]",
    label: "Total Projects",
    value: "42",
    trend: "+12%",
    trendIcon: "trending_up",
    trendColor: "text-[#7a2f00]",
  },
  {
    id: "total-issues",
    icon: "bug_report",
    iconColor: "text-[#505f76]",
    iconBg: "bg-[#d0e1fb]",
    label: "Total Issues",
    value: "1,284",
    trend: "+4%",
    trendIcon: "trending_up",
    trendColor: "text-[#454654]",
  },
  {
    id: "open-issues",
    icon: "emergency",
    iconColor: "text-[#ba1a1a]",
    iconBg: "bg-[#ffdad6]",
    label: "Open Issues",
    value: "156",
    trend: "-2%",
    trendIcon: "trending_down",
    trendColor: "text-[#ba1a1a]",
  },
  {
    id: "closed-issues",
    icon: "check_circle",
    iconColor: "text-[#7e3100]",
    iconBg: "bg-[#ffdbcc]",
    label: "Closed Issues",
    value: "1,128",
    trend: "+18%",
    trendIcon: "trending_up",
    trendColor: "text-[#7e3100]",
  },
  {
    id: "high-priority",
    icon: "priority_high",
    iconColor: "text-[#7a2f00]",
    iconBg: "bg-[#ffb694]",
    label: "High Priority",
    value: "24",
    trend: "Stable",
    trendIcon: null,
    trendColor: "text-[#454654]",
  },
  {
    id: "active-users",
    icon: "person",
    iconColor: "text-[#1d34ba]",
    iconBg: "bg-[#dfe0ff]",
    label: "Active Users",
    value: "84",
    trend: "+5",
    trendIcon: "person_add",
    trendColor: "text-[#7a2f00]",
  },
];

const PROJECTS_DATA = [
  {
    id: "cloud-infra",
    title: "Cloud Infrastructure v2",
    status: "Active",
    statusBg: "bg-[#3e52d5]",
    statusText: "text-[#d7daff]",
    description:
      "Scaling Kubernetes clusters across AWS regions with enhanced security protocols and automated failover systems.",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbptBLYsFfh2f_2b0sKFCa4DOFTBH9Q6j-1Q1mdyoBtPUQ8ricDX7cz-PN0CO7p6sFlfKdBQ-l-QvI5lYSNxlKnrOtkaoPxPrAxBMMa_RI9TCXivRfTFxMtBVRk7urIQHRJb4oIWbJF3e2R2CAs3Bzp1LznrSp-UrTbZ3K-8iJdehVPt_Gm9VWVdFbTMvlbykH9DD8F3sRM1E-QL4hmRDuKr6dmVBDuWXrjRTm6nLZ5b-VMGWZCyleCJkTzNXy17fuKXmvJZOOg9cD",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXSNrHkhpHTzQIASeCZyKYBAWCjApnRUuDUkL0fcbSl6oCoR_1X9iSuetFuKEvLneKOX1Fd23VldftlO05ZReeZwsqkwqYPqd5S7vs7tUFNAcm91Sq3Og4LzLmdUp0f6UxNEn9dg2C1Jl5uMo7M6y9l7hr8uUO3N0OcFxU3XD2aNIV4cPrc-seWGgFy_-Dmh7qw0TrIB8bqACi4ebT0kvxNkNJQWYvH3HTFTEk0z73OAV6sOQzRs9M0N-TPVtZMzZFdsXBOIt4X49Q",
    ],
    progress: 64,
    progressColor: "bg-[#2036bd]",
    issueCount: 12,
    updatedAt: "4h ago",
  },
  {
    id: "mobile-redesign",
    title: "Mobile App Redesign",
    status: "On Hold",
    statusBg: "bg-[#e0e3e5]",
    statusText: "text-[#454654]",
    description:
      "Complete overhaul of user journey and interface design for iOS and Android platforms using React Native.",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGIbx7xW1BvVvtNnEBU0JxzApAqrXI3Xi0bjICT09Bb3PyJFkfz25YMK3IZvYTZG-Av_Ffjgb8f0oX5k5bUBAcS0jJu5lJDdDGf3fBxg4XwSRdr4GDK7umL12QhRFwSKz_J_KmUuRs0bftRQ7jojzZKbhhvcnmi2waztELsU5zEguwRiWH5-vhQ_yFIkZsINd95mK4NvZ6LNRICTDniIVj38A6ztdCsFUfddJbKqW1he0MtgbOSuVYBAW6PAOvV6-EaShmZn2PY4IE",
    ],
    progress: 28,
    progressColor: "bg-[#c5c5d7]",
    issueCount: 42,
    updatedAt: "1d ago",
  },
];

const PRIORITY_BARS = [
  { label: "Critical", color: "bg-[#ba1a1a]", textColor: "text-[#ba1a1a]", count: 8,  widthClass: "w-[15%]" },
  { label: "High",     color: "bg-[#7a2f00]", textColor: "text-[#7a2f00]", count: 24, widthClass: "w-[45%]" },
  { label: "Medium",   color: "bg-[#54647a]", textColor: "text-[#54647a]", count: 62, widthClass: "w-[75%]" },
  { label: "Low",      color: "bg-[#757686]", textColor: "text-[#757686]", count: 38, widthClass: "w-[40%]" },
];

const STATUS_BARS = [
  { label: "Open",     color: "bg-[#3e52d5]", heightClass: "h-[60%]" },
  { label: "In Prog",  color: "bg-[#d0e1fb]", heightClass: "h-[40%]" },
  { label: "Resolved", color: "bg-[#ffb694]", heightClass: "h-[85%]" },
  { label: "Closed",   color: "bg-[#e0e3e5]", heightClass: "h-[30%]" },
];

const TEAM_MEMBERS = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    email: "s.jenkins@forgeflow.ai",
    role: "Lead Engineer",
    status: "Online",
    statusBg: "bg-green-100",
    statusText: "text-green-700",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJz1SAITa4rL3SP97llsV0sstWmGpwUAJTMYdzpDGf13GIMS4p_1ngRUxw1UA2U0OOTOH1BRKca3oOaDIf8esaJsL7a7zfD_A__SlJ_bhdEgdRvYiNml-Rxxk62OkoBlRyXYvWmKZvgOuNCubvN4kZTTgOP3jZTW0ADpb6QKFpDazHSLQkfI0SP98ltLEPtcJkCdNbt1GBcPaYAqBAYdQ3Hxf3S0-R7-hwT6dZDkmiWrofbsVGJRmYy6SRfLoSs7bcgbU0a1r_rjnb",
  },
  {
    id: "marcus",
    name: "Marcus Thorne",
    email: "m.thorne@forgeflow.ai",
    role: "Product Manager",
    status: "Away",
    statusBg: "bg-[#e0e3e5]",
    statusText: "text-[#454654]",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWO3NnziGZauOUAMm15QU18iUbEr2bOu9hmWdb0wG7uNLWn4EEUAPTvXc5dvq0oN0nRcg7-1Zs8wNWjQCD8IF8NgrARRskiG52SS9v7s8mFnexn-UNXEmtGfuoPkX0tPUwe72Dt1gv6bPE8_Ervww1EDN4wm85tclgNs98B4Kwz5KfoktVmI751UpXTDqD2o7JlFlxJ6Pk1IamxqBrEDGpi8ixoiruEjV3-nBvIUbUHqO2ruTgnKIPNmqF_95jO6sVJaWjZxZJzJXS",
  },
];

const ACTIVITIES_DATA = [
  {
    id: "act-1",
    iconBg: "bg-[#3e52d5]",
    iconColor: "text-[#d7daff]",
    icon: "add_circle",
    content: (
      <>
        <span className="font-bold">Sarah Jenkins</span> created{" "}
        <a href="#" className="text-[#2036bd] hover:underline">
          FF-402: API Optimization
        </a>
      </>
    ),
    time: "2 mins ago",
  },
  {
    id: "act-2",
    iconBg: "bg-[#d0e1fb]",
    iconColor: "text-[#54647a]",
    icon: "assignment_ind",
    content: (
      <>
        <span className="font-bold">Admin</span> assigned{" "}
        <a href="#" className="text-[#2036bd] hover:underline">
          FF-384
        </a>{" "}
        to <span className="font-bold">Marcus Thorne</span>
      </>
    ),
    time: "15 mins ago",
  },
  {
    id: "act-3",
    iconBg: "bg-[#ffdad6]",
    iconColor: "text-[#ba1a1a]",
    icon: "emergency_home",
    content: (
      <>
        <span className="font-bold">Critical Issue:</span>{" "}
        <a href="#" className="text-[#ba1a1a] font-bold hover:underline">
          Database Timeout in Production
        </a>
      </>
    ),
    time: "1h ago",
  },
  {
    id: "act-4",
    iconBg: "bg-[#ffdbcc]",
    iconColor: "text-[#7a2f00]",
    icon: "comment",
    content: (
      <>
        <span className="font-bold">Marcus</span> commented on{" "}
        <a href="#" className="text-[#2036bd] hover:underline">
          App Redesign Proposal
        </a>
      </>
    ),
    time: "3h ago",
  },
];

const AI_SUGGESTIONS = [
  "Set up CI/CD pipeline for staging",
  "Define API endpoints for auth",
];

const QUICK_ACTIONS = [
  { icon: "add_box",        label: "Create Proj" },
  { icon: "bug_report",     label: "New Issue"   },
  { icon: "person_add",     label: "Invite User" },
  { icon: "assignment_ind", label: "Assign Task" },
];

const NAV_LINKS = [
  { to: "/dashboard",  icon: "dashboard",    label: "Dashboard"  },
  { to: "/projects",   icon: "folder_open",  label: "Projects"   },
  { to: "/issues",     icon: "bug_report",   label: "Issues"     },
  { to: "/users",      icon: "group",        label: "Users"      },
  { to: "/activity",   icon: "history",      label: "Activity"   },
  { to: "/analytics",  icon: "analytics",    label: "Analytics"  },
  { to: "/ai-planner", icon: "auto_awesome", label: "AI Planner" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

function StatCard({ icon, iconColor, iconBg, label, value, trend, trendIcon, trendColor }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#c5c5d7]">
      <div className="flex justify-between items-start mb-2">
        <span className={`material-symbols-outlined ${iconColor} ${iconBg} p-1 rounded-lg`}>
          {icon}
        </span>
        <span className={`${trendColor} text-[11px] leading-[14px] tracking-[0.03em] font-semibold flex items-center gap-0.5`}>
          {trend}
          {trendIcon && (
            <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
          )}
        </span>
      </div>
      <p className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#454654]">
        {label}
      </p>
      <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold mt-1">
        {value}
      </h3>
    </div>
  );
}

function ProjectCard({ title, status, statusBg, statusText, description, avatars, progress, progressColor, issueCount, updatedAt }) {
  return (
    <div className="bg-white border border-[#c5c5d7] rounded-xl p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between mb-2">
        <h4 className="text-[18px] leading-[26px] font-semibold">{title}</h4>
        <span className={`px-2 py-0.5 rounded ${statusBg} ${statusText} text-[10px] font-bold uppercase tracking-wider`}>
          {status}
        </span>
      </div>
      <p className="text-[13px] leading-[18px] text-[#454654] mb-4 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="team member"
              className="w-8 h-8 rounded-full border-2 border-[#f7f9fb]"
              style={{ marginLeft: i > 0 ? "-8px" : "0" }}
            />
          ))}
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[11px] leading-[14px] tracking-[0.03em] font-semibold mb-1">
            <span className="text-[#454654]">Progress</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#eceef0] rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-[#c5c5d7]">
        <div className="flex items-center gap-1 text-[#454654]">
          <Icon name="bug_report" className="text-[16px]" />
          <span className="font-mono text-[12px] leading-[16px]">{issueCount} Issues</span>
        </div>
        <span className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold text-[#454654] italic">
          Updated {updatedAt}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── API-ready state (populate via useEffect once backend exists) ──────────
  const [stats, setStats]         = useState(STATS_DATA);
  const [projects, setProjects]   = useState(PROJECTS_DATA);
  const [activities, setActivities] = useState(ACTIVITIES_DATA);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [aiPrompt, setAiPrompt]   = useState("");

  useEffect(() => {
    // Future API calls go here, e.g.:
    // fetchStats().then(setStats);
    // fetchProjects().then(setProjects);
    // fetchActivities().then(setActivities);
    // fetchTeamMembers().then(setTeamMembers);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // NavLink active/inactive class helper
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-[0.75rem] transition-colors duration-100 text-[14px] leading-[20px] ${
      isActive
        ? "bg-[#d0e1fb] text-[#54647a] font-medium"
        : "text-[#454654] hover:bg-[#e6e8ea]"
    }`;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-['Inter',sans-serif] min-h-screen">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#f7f9fb] border-r border-[#c5c5d7] flex flex-col gap-2 p-4 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <img src={LOGO_SRC} alt="ForgeFlow Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-[18px] leading-[26px] font-semibold text-[#191c1e]">ForgeFlow</h1>
            <p className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold text-[#454654] opacity-70">
              Enterprise Tier
            </p>
          </div>
        </div>

        {/* New Issue CTA */}
        <button className="w-full bg-[#2036bd] text-white py-2 px-4 rounded-[0.75rem] text-[12px] leading-[16px] tracking-[0.01em] font-medium flex items-center justify-center gap-2 mb-2 hover:brightness-110 active:scale-[0.98] transition-all border-0 cursor-pointer">
          <Icon name="add" className="text-[20px]" />
          New Issue
        </button>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
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

      {/* ── Top Navbar ── */}
      <header className="flex items-center justify-between px-4 sticky top-0 z-40 ml-[240px] w-[calc(100%-240px)] h-14 bg-white border-b border-[#c5c5d7]">
        {/* Search */}
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#454654] text-[20px]" />
            <input
              type="text"
              placeholder="Search projects, tasks, or members..."
              className="w-full bg-[#eceef0] border-0 rounded-lg pl-10 pr-4 py-1.5 text-[14px] leading-[20px] outline-none focus:ring-2 focus:ring-[#2036bd] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="text-[#454654] hover:text-[#191c1e] transition-colors bg-transparent border-0 cursor-pointer">
            <Icon name="notifications" />
          </button>
          <button className="text-[#454654] hover:text-[#191c1e] transition-colors bg-transparent border-0 cursor-pointer">
            <Icon name="help_outline" />
          </button>

          <div className="h-6 w-px bg-[#c5c5d7] mx-2" />

          {/* User profile */}
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
            <Icon name="logout" className="text-[18px]" />
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="ml-[240px] p-4 min-h-screen">

        {/* KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mb-10">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </section>

        <div className="grid grid-cols-12 gap-10">

          {/* ── Left column (9/12) ── */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-10">

            {/* Recent Projects */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold">
                    Recent Projects
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#454654]">
                    High priority initiatives requiring attention
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#eceef0] border border-[#c5c5d7] rounded-lg text-[12px] font-medium hover:bg-[#e6e8ea] transition-all cursor-pointer">
                    View All
                  </button>
                  <button className="px-4 py-2 bg-[#2036bd] text-white border-0 rounded-lg text-[12px] font-medium hover:brightness-110 active:scale-95 transition-all cursor-pointer">
                    Create Project
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            </section>

            {/* Analytics Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Issues by Status */}
              <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
                <h3 className="text-[18px] leading-[26px] font-semibold mb-4">
                  Issues by Status
                </h3>
                <div className="h-48 flex items-end gap-4 px-4">
                  {STATUS_BARS.map(({ label, color, heightClass }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={`w-full ${color} ${heightClass} transition-all duration-1000`}
                      />
                      <span className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues by Priority */}
              <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
                <h3 className="text-[18px] leading-[26px] font-semibold mb-4">
                  Issues by Priority
                </h3>
                <div className="flex flex-col gap-4">
                  {PRIORITY_BARS.map(({ label, color, textColor, count, widthClass }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] leading-[14px] tracking-tight font-semibold uppercase">
                        <span className={`${textColor} font-bold`}>{label}</span>
                        <span>{count}</span>
                      </div>
                      <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
                        <div className={`h-full ${color} ${widthClass}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Team Management Table */}
            <section className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#c5c5d7] flex justify-between items-center">
                <h3 className="text-[18px] leading-[26px] font-semibold">Team Management</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#eceef0] hover:bg-[#e6e8ea] rounded text-[12px] font-medium transition-colors cursor-pointer border-0">
                    Manage Users
                  </button>
                  <button className="px-3 py-1.5 bg-[#2036bd] text-white rounded text-[12px] font-medium hover:brightness-110 active:scale-95 transition-all cursor-pointer border-0">
                    Invite User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f2f4f6] text-[#454654] text-[11px] leading-[14px] tracking-[0.03em] font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3">Member</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c5d7]">
                    {teamMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-[#f2f4f6] transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-[14px] leading-[20px] font-bold">
                            {member.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] leading-[18px] text-[#454654]">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 text-[13px] leading-[18px]">
                          {member.role}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full ${member.statusBg} ${member.statusText} text-[10px] font-bold`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#454654] hover:text-[#2036bd] transition-colors bg-transparent border-0 cursor-pointer">
                            <Icon name="more_vert" className="text-[18px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* ── Right column (3/12) ── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-10">

            {/* Quick Actions */}
            <section className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <h3 className="text-[18px] leading-[26px] font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(({ icon, label }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#c5c5d7] hover:bg-[#3e52d5] hover:border-[#3e52d5] hover:[&>span]:text-[#d7daff] transition-all group cursor-pointer bg-transparent"
                  >
                    <Icon
                      name={icon}
                      className="text-[#454654] group-hover:text-[#d7daff] mb-1 transition-colors"
                    />
                    <span className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold text-[#454654] group-hover:text-[#d7daff] transition-colors">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* AI Planner */}
            <section className="bg-[#2036bd] text-white rounded-xl p-4 shadow-xl overflow-hidden relative group">
              {/* Glow blob */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#d7daff] opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="material-symbols-outlined text-[#d7daff]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <h3 className="text-[18px] leading-[26px] font-semibold">AI Issue Planner</h3>
                </div>

                <p className="text-[13px] leading-[18px] opacity-90 mb-4">
                  Generate optimized task backlogs in seconds.
                </p>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your project goal..."
                  className="w-full bg-[#1d34ba] border-0 focus:ring-1 focus:ring-white rounded-lg p-3 text-[13px] leading-[18px] text-white placeholder:text-white/50 h-20 resize-none mb-2 outline-none"
                />

                <button className="w-full py-2 bg-white text-[#2036bd] font-bold rounded-lg text-[12px] hover:bg-[#d7daff] transition-all mb-4 border-0 cursor-pointer">
                  Generate Tasks
                </button>

                <div className="flex flex-col gap-2">
                  <p className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold opacity-70 uppercase">
                    Suggestions:
                  </p>
                  {AI_SUGGESTIONS.map((text) => (
                    <div
                      key={text}
                      className="p-2 bg-white/10 rounded border border-white/20 flex gap-2 items-start"
                    >
                      <Icon name="check_circle" className="text-[16px] mt-0.5" />
                      <span className="text-[13px] leading-[18px] italic">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <h3 className="text-[18px] leading-[26px] font-semibold mb-4">Recent Activity</h3>

              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#c5c5d7]" />

                <div className="flex flex-col gap-4">
                  {activities.map(({ id, iconBg, iconColor, icon, content, time }) => (
                    <div key={id} className="relative pl-9">
                      <div
                        className={`absolute left-0 top-0.5 w-7 h-7 ${iconBg} rounded-full flex items-center justify-center z-10`}
                        style={{ outline: "4px solid #ffffff" }}
                      >
                        <Icon name={icon} className={`text-[16px] ${iconColor}`} />
                      </div>
                      <p className="text-[13px] leading-[18px]">{content}</p>
                      <span className="text-[11px] leading-[14px] tracking-[0.03em] font-semibold text-[#454654]">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 py-1.5 text-[12px] font-medium text-[#454654] hover:text-[#191c1e] transition-colors border border-dashed border-[#c5c5d7] rounded bg-transparent cursor-pointer">
                Load More Activity
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
