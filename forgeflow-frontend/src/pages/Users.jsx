import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

const initialUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "s.chen@forgeflow.ai",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzSpMFqeQm39ABrNxTIgI8D5tMpO22CRzpX6uYjDHnxRi0SNPNlC9gbAuSYfj1iDtaW5fkINkbsBvS7trpSdojrgEwrq_YBLnCVkMh_RGcn0hiyd6w0fxQAvf4UoNKv7R4weLpP7RwXoOmL1U_4itUjdAsD7lLOR-FH0D4SfyTDx_aE05rhy43B2UL-yUwOcsS6S-lUoWxH53raiwNpijsleD51bclrjkIt8KZfQjI9T6r_YbJsXm7LKGspiUMwpeN5wCBzYWPWXPL",
    role: "DEVELOPER",
    roleBadgeClass: "bg-blue-100 text-blue-800",
    department: "Engineering",
    projects: [
      { label: "P1", color: "bg-blue-100 text-blue-600" },
      { label: "D3", color: "bg-purple-100 text-purple-600" },
      { label: "+3", color: "bg-slate-100 text-slate-400" },
    ],
    issues: 14,
    status: "Active",
    statusDot: "bg-green-500",
    statusText: "text-green-700",
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Marcus Wright",
    email: "m.wright@forgeflow.ai",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkgWziBtkBfbeQftZTdWJiHUvNGXGlAuKarJ0Xo6rt6UrAprks7sYsazqj3UfyBeJuWbFSrQSSWqAltDMWHhroLM5STaRsAY79neo6nMCL4vM5sYd1bfwd-TCpdd1x7aTwmBQlseDiybpvwCvDcqgU0yQApiIU3OgZjZKAljiwr56TNt10wG4h1ptqimmfhASyNk7S2hNUY67rqG2bzJ-vu3KS66o8dQsCVy34W71yQe2PRXkFS7U6jLkY6DkGXdN52ULAaCy5NGrh",
    role: "PRODUCT",
    roleBadgeClass: "bg-[#d0e1fb] text-[#54647a]",
    department: "Product",
    projects: [
      { label: "R2", color: "bg-amber-100 text-amber-600" },
      { label: "+1", color: "bg-slate-100 text-slate-400" },
    ],
    issues: 8,
    status: "Away",
    statusDot: "bg-amber-500",
    statusText: "text-amber-700",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "e.rodriguez@forgeflow.ai",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-PCNbRN4UOwxHnkQ7ncvSwlkYgohdpfBfXsGCw1W9seoUlLZHEMxiZ3azwZ5OylIPYSqwH36RVLtsxxZbon7FikTayVGXsp3D5wrslq9-rlM0rIc-CCYidJOuUQ6c3Z3O7HqSVcpNBwpXiFyvKZZ4DJmQORZLfSNoKxouJSNvBPriouQOxubvXSxEU2wKg0e8P5bG67n7PkidmQRCyVrvUCZkVb7VfT9PFSiyP9H-h_cXjvWgNPP7vjbwVp2sLlRRGvTDtsDBttrV",
    role: "DESIGN",
    roleBadgeClass: "bg-orange-100 text-orange-800",
    department: "Design",
    projects: [
      { label: "S1", color: "bg-indigo-100 text-indigo-600" },
    ],
    issues: 3,
    status: "Offline",
    statusDot: "bg-slate-400",
    statusText: "text-slate-500",
    lastActive: "Yesterday",
  },
];

const kpiCards = [
  { icon: "group", iconClass: "text-[#2036bd]", label: "Total Users", value: "1,248", badge: "+12%", badgeClass: "text-[#1d34ba] bg-[#dfe0ff]" },
  { icon: "bolt", iconClass: "text-green-600", label: "Active Now", value: "842", badge: "+5.2%", badgeClass: "text-green-800 bg-green-100" },
  { icon: "admin_panel_settings", iconClass: "text-purple-600", label: "Admins", value: "24", badge: null, badgeClass: "" },
  { icon: "badge", iconClass: "text-blue-600", label: "Members", value: "1,120", badge: null, badgeClass: "" },
  { icon: "hourglass_top", iconClass: "text-amber-600", label: "Pending", value: "18", badge: "New", badgeClass: "text-amber-800 bg-amber-100" },
  { icon: "person_off", iconClass: "text-[#757686]", label: "Inactive", value: "64", badge: null, badgeClass: "" },
];

const departments = [
  { name: "Engineering", members: 42, load: 88, loadWidth: "w-[88%]", color: "text-[#2036bd]", barClass: "bg-[#2036bd]" },
  { name: "Product", members: 12, load: 65, loadWidth: "w-[65%]", color: "text-[#505f76]", barClass: "bg-[#505f76]" },
  { name: "Design", members: 8, load: 92, loadWidth: "w-[92%]", color: "text-[#7e3100]", barClass: "bg-[#7e3100]" },
  { name: "QA", members: 15, load: 40, loadWidth: "w-[40%]", color: "text-green-700", barClass: "bg-green-600" },
  { name: "DevOps", members: 6, load: 78, loadWidth: "w-[78%]", color: "text-purple-700", barClass: "bg-purple-600" },
];

const roleDistribution = [
  { label: "Admin", count: "24 (2%)", widthClass: "w-[2%]", barClass: "bg-purple-600" },
  { label: "Manager", count: "112 (9%)", widthClass: "w-[9%]", barClass: "bg-[#505f76]" },
  { label: "Developer", count: "846 (68%)", widthClass: "w-[68%]", barClass: "bg-[#2036bd]" },
  { label: "QA", count: "266 (21%)", widthClass: "w-[21%]", barClass: "bg-green-600" },
];

const activityTimeline = [
  { dotClass: "bg-[#2036bd]", text: <><span className="font-bold">Sarah Chen</span> merged PR #412</>, time: "12 mins ago" },
  { dotClass: "bg-green-500", text: <><span className="font-bold">System</span> invited 4 new engineers</>, time: "2 hours ago" },
  { dotClass: "bg-amber-500", text: <><span className="font-bold">Marcus W.</span> changed role to Lead</>, time: "5 hours ago" },
];

const drawerUser = {
  name: "Sarah Chen",
  title: "Senior Software Architect",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBBoj2imik8c_14A27U8wiB1Qe6KtFiMvfjoO6vS3oluFE_aW4D0x3uQiEsEbN_wiv5bNbIDxPTSbRIu_13-L4JHf06nhFcZ7XDPxqORGuhDTByZh_jl6YsqHsOjpY_GWlrylo0TQFd6hBHjP85yr9BhSSMrD3KlftzkKD-ghEPJpj8lGS8Z85wOmnnO8s7JdWLUZUj3GZntDCfom3qDrMOWXfG21a3GxpZc0N_7ucgUDuFE2Ly72QC0-gZ2hZHvh4Jm514mWV3e6h",
  stats: [
    { label: "Tasks", value: "142" },
    { label: "Projects", value: "12" },
    { label: "Uptime", value: "98%" },
  ],
  metrics: [
    { label: "Code Quality Score", value: "9.2", percent: "w-[92%]", barClass: "bg-[#2036bd]" },
    { label: "Task Completion Rate", value: "88%", percent: "w-[88%]", barClass: "bg-green-600" },
  ],
  recentActivity: [
    { dotClass: "bg-[#2036bd]", text: <>Reviewed PR <span className="font-mono text-[12px] text-[#2036bd]">#FRG-2291</span> in <span className="font-bold">Core Engine</span></>, time: "15 minutes ago" },
    { dotClass: "bg-slate-400", text: <>Updated documentation for <span className="font-bold">Auth Flow</span></>, time: "2 hours ago" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterDept, setFilterDept] = useState("Department");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleReset = () => {
    setFilterKeyword("");
    setFilterRole("All Roles");
    setFilterStatus("All Status");
    setFilterDept("Department");
  };

  const filteredUsers = users.filter((u) => {
    const kw = filterKeyword.toLowerCase();
    const matchesKw = !kw || u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw);
    const matchesRole = filterRole === "All Roles" || u.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus = filterStatus === "All Status" || u.status === filterStatus;
    const matchesDept = filterDept === "Department" || u.department === filterDept;
    return matchesKw && matchesRole && matchesStatus && matchesDept;
  });

  const openDrawer = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
        <Sidebar />

    <Navbar />

    <div className="ml-[240px] pt-14">
      <div className="flex">
        {/* ── Center Canvas ── */}
       <div className="flex-1 p-6 space-y-6 overflow-y-auto min-w-0">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight leading-tight">Users Management</h2>
              <p className="text-[14px] text-[#454654] mt-0.5">Manage team members, permissions, and collaboration across projects.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-[#c5c5d7] px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-[#eceef0] transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Users
              </button>
              <button className="flex items-center gap-2 bg-[#2036bd] text-white px-4 py-2 rounded-lg text-[12px] font-semibold hover:opacity-90 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Invite User
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpiCards.map((card) => (
              <div
                key={card.label}
                className="bg-white p-4 rounded-xl border border-[#c5c5d7] hover:border-[#2036bd] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`material-symbols-outlined ${card.iconClass} text-[22px]`}>{card.icon}</span>
                  {card.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${card.badgeClass}`}>{card.badge}</span>
                  )}
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#757686]">{card.label}</p>
                <h3 className="text-2xl font-semibold mt-1">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white border border-[#c5c5d7] rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <div className="relative min-w-[200px] flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">search</span>
              <input
                className="w-full border border-[#c5c5d7] rounded-lg pl-10 pr-4 py-2 text-[13px] focus:ring-1 focus:ring-[#2036bd] outline-none"
                placeholder="Search users..."
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
            <select
              className="border border-[#c5c5d7] rounded-lg py-2 pl-3 pr-8 text-[12px] font-medium bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option>All Roles</option>
              <option>Administrator</option>
              <option>Manager</option>
              <option>Developer</option>
              <option>Designer</option>
              <option>QA Engineer</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg py-2 pl-3 pr-8 text-[12px] font-medium bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Away</option>
              <option>Offline</option>
              <option>Invited</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg py-2 pl-3 pr-8 text-[12px] font-medium bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option>Department</option>
              <option>Engineering</option>
              <option>Product</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
            <button onClick={handleReset} className="text-[#2036bd] text-[12px] font-semibold hover:underline px-2">
              Reset
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#eceef0] text-[11px] font-semibold text-[#757686] uppercase tracking-wider">
                  <tr>
                    {["Name & Email", "Role", "Department", "Projects", "Issues", "Status", "Last Active", ""].map((h, i) => (
                      <th key={i} className={`px-4 py-4 ${h === "Issues" ? "text-center" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c5d7]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-[#757686]">No users match your filters.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-[#f2f4f6] transition-colors cursor-pointer group"
                        onClick={() => openDrawer(user)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-[14px] font-bold">{user.name}</p>
                              <p className="text-[12px] text-[#757686]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[11px] font-bold ${user.roleBadgeClass}`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-4 text-[13px]">{user.department}</td>
                        <td className="px-4 py-4">
                          <div className="flex -space-x-2">
                            {user.projects.map((p, i) => (
                              <div key={i} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${p.color}`}>
                                {p.label}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-mono text-[12px] font-bold">{String(user.issues).padStart(2, "0")}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${user.statusDot}`}></span>
                            <span className={`text-[12px] font-medium ${user.statusText}`}>{user.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#757686]">{user.lastActive}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            className="p-1 hover:bg-[#eceef0] rounded-md transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-[#f2f4f6] border-t border-[#c5c5d7] flex items-center justify-between">
              <p className="text-[12px] text-[#454654]">Showing {filteredUsers.length} of {users.length} users</p>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded border border-[#c5c5d7] hover:bg-white transition-colors opacity-50 cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-[12px] font-bold px-2">1</span>
                <span className="text-[12px] text-[#757686] px-2">2</span>
                <span className="text-[12px] text-[#757686] px-2">3</span>
                <button className="p-1 rounded border border-[#c5c5d7] hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Team Departments */}
          <div>
            <h3 className="text-[18px] font-semibold mb-4">Team Departments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {departments.map((dept) => (
                <div key={dept.name} className="bg-white border border-[#c5c5d7] p-4 rounded-xl hover:border-[#2036bd] hover:shadow-md transition-all duration-200">
                  <h4 className={`text-[14px] font-bold mb-1 ${dept.color}`}>{dept.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-[#757686] mb-3">
                    <span>{dept.members} Members</span>
                    <span>{dept.load}% Load</span>
                  </div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${dept.barClass} ${dept.loadWidth}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
   <aside className="w-80 bg-[#f2f4f6] border-l border-[#c5c5d7] hidden xl:flex flex-col p-4 gap-6 overflow-y-auto">
          {/* Team Insights */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#757686] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">insights</span>
              Team Insights
            </h4>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-[#c5c5d7]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px]">Resource Capacity</span>
                  <span className="font-bold text-[#2036bd]">82%</span>
                </div>
                <div className="w-full bg-[#e6e8ea] h-2 rounded-full">
                  <div className="bg-[#2036bd] h-2 rounded-full w-[82%]"></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] text-[#454654]">Avg. Collaboration Score</span>
                <span className="font-mono text-[12px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">9.4/10</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] text-[#454654]">Top Contributor</span>
                <span className="text-[12px] font-bold">@schen</span>
              </div>
            </div>
          </section>

          {/* Role Distribution */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#757686] uppercase tracking-wider mb-4">Role Distribution</h4>
            <div className="space-y-3">
              {roleDistribution.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>{r.label}</span>
                    <span>{r.count}</span>
                  </div>
                  <div className="w-full bg-[#e6e8ea] h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${r.barClass} ${r.widthClass}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Timeline */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#757686] uppercase tracking-wider mb-4">Recent Activity</h4>
            <div className="relative space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-[#c5c5d7]">
              {activityTimeline.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-1 top-1 w-3 h-3 rounded-full border-2 border-[#f2f4f6] z-10 ${item.dotClass}`}></div>
                  <p className="text-[13px]">{item.text}</p>
                  <span className="text-[10px] text-[#757686]">{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Team Assistant */}
          <section className="mt-auto">
            <div className="bg-[#3e52d5] text-[#d7daff] p-4 rounded-xl border border-[#2036bd]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <h5 className="text-[12px] font-bold">AI Team Assistant</h5>
                </div>
                <p className="text-[13px] mb-4 opacity-90">Workload analysis shows high burnout risk in Design department.</p>
                <div className="flex items-center gap-2 mb-4 bg-white/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span className="text-[11px] font-bold">Burnout Risk: High (92%)</span>
                </div>
                <button className="w-full bg-white text-[#2036bd] font-bold py-2 rounded-lg text-[12px] hover:shadow-lg transition-all active:scale-95">
                  Analyze Team
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* ── User Profile Drawer ── */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? "visible" : "invisible"}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#c5c5d7] flex items-center justify-between bg-[#f2f4f6]">
            <h3 className="text-[18px] font-semibold">User Details</h3>
            <button className="p-1 hover:bg-[#eceef0] rounded-full transition-colors" onClick={() => setDrawerOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Drawer Body */}
          <div className="p-6 space-y-6">
            {/* Profile Hero */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <img src={drawerUser.avatar} alt={drawerUser.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h4 className="text-[18px] font-semibold">{drawerUser.name}</h4>
                <p className="text-[#2036bd] text-[12px] font-bold tracking-widest uppercase">{drawerUser.title}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-[#2036bd] text-white px-4 py-1.5 rounded-lg text-[12px] font-medium">Message</button>
                <button className="border border-[#c5c5d7] px-4 py-1.5 rounded-lg text-[12px] font-medium hover:bg-[#f2f4f6] transition-colors">Edit Role</button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {drawerUser.stats.map((s) => (
                <div key={s.label} className="bg-[#f7f9fb] p-3 rounded-lg border border-[#c5c5d7] text-center">
                  <p className="text-[#757686] text-[10px] uppercase">{s.label}</p>
                  <p className="font-bold text-[18px]">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <section>
              <h5 className="text-[11px] font-semibold text-[#757686] uppercase tracking-wider mb-3">Performance Metrics</h5>
              <div className="space-y-4">
                {drawerUser.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[13px] mb-1">
                      <span>{m.label}</span>
                      <span className="font-bold">{m.value}</span>
                    </div>
                    <div className="w-full bg-[#eceef0] h-1.5 rounded-full">
                      <div className={`h-1.5 rounded-full ${m.barClass} ${m.percent}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h5 className="text-[11px] font-semibold text-[#757686] uppercase tracking-wider mb-3">Recent Activity</h5>
              <div className="space-y-3">
                {drawerUser.recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 text-[13px]">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.dotClass}`}></div>
                    <div>
                      <p>{a.text}</p>
                      <span className="text-[10px] text-[#757686]">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Deactivate Button */}
            <button className="w-full bg-[#ffdad6] text-[#93000a] py-3 rounded-xl font-bold text-[12px] hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">person_remove</span>
              Deactivate User Account
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}