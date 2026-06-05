import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
// ─── Static data (replace with API calls) ────────────────────────────────────

const initialActivities = [
  {
    id: 1,
    timestamp: "2023-11-24 14:02:11",
    user: { name: "Sarah Chen", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDdtfGkDAaq9gBIpzJRhIu15rZezRxVtXTULPDK74klVkYqK2XB_ZaZsQWWz57hycZ4ABDVF7Y7aDSb47R1ZZXI03QIpBebC_PHuEEXg3vKOzVqO2IiuTXLY0vdJKaqmoA2gHUBloGp9HWFQ0UJ4MZdJubNsVU1XarLjUvlDh62Ds2-FHlpqBuO1Pk35DNW5-4NBW-hUf80WC14w_SRdTTt9W85_wXpROcm8D11usZ5QAGlAfdH24WS34YMfQvPN1O17kWwATcztdU" },
    type: "Issue Update",
    typeBadge: "bg-blue-50 text-blue-700",
    project: "Core Engine",
    description: "Modified memory allocation logic in v2.4.1",
    status: "Success",
    statusBadge: "bg-emerald-50 text-emerald-700",
    actionIcon: "more_horiz",
  },
  {
    id: 2,
    timestamp: "2023-11-24 13:45:02",
    user: { name: "Marcus Wright", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZRNcsTx1Hqm4OqAixcZxj1Wp6MFUZkrA-38NgpMe6Y_dHACk8uDzme4MR1D4ilgfXmEN0eTvw1u-kMq4AbyKcrr_Sc-T88mdqW_5T7kGEuOsyXe6wF28nJem_DghbBBzdxygrjH290tqm3l5CmfEV6lT1W0xHvXXu1OLSWdePHIfelCwBKU0gGuldpPh07DJrQfm9M82PdtBfgZINJGsoagtU--Gis5y_Q0KZShu9PI4vh-keTsoDXPkjswUD-zDJBD_PSJv2hLxk" },
    type: "Security",
    typeBadge: "bg-amber-50 text-amber-700",
    project: "Auth Gateway",
    description: "Failed login attempt - Suspicious IP detected",
    status: "Blocked",
    statusBadge: "bg-red-50 text-red-700",
    actionIcon: "visibility",
  },
  {
    id: 3,
    timestamp: "2023-11-24 13:12:44",
    user: { name: "ForgeBot (AI)", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHGvwG59qICG6ngpmiqJAbYssKf_lrst9pSTqJ2XJmxWLMLPgUiaZRWOTdswtSNoHNx7wS563AA69agu4ejoYpvUxLMJ0G8YpEob3O_0UoNFO7XU8CXbxPGlRO16hzKvJ-355EYa_mq96-rLb_El5Gc3RCdbmTOxoso3OyOoc2LPeYMmRvGm8Zk9ZPRPn9kNSuKzho-urFwxZn3Nd0-QkyY5sDAI4YbWwPcFRBvaWhA2_9z6sPUrlgFHNYh-8FYAXimm6we62COimz" },
    type: "Automation",
    typeBadge: "bg-purple-50 text-purple-700",
    project: "UI Framework",
    description: "Auto-reassigned 14 stagnant issues to Active sprint",
    status: "Applied",
    statusBadge: "bg-emerald-50 text-emerald-700",
    actionIcon: "undo",
  },
];

const kpiCards = [
  { icon: "all_inclusive", iconClass: "text-[#2036bd]", label: "Total Activities", value: "12,842", badge: "12%", badgeClass: "text-emerald-600 bg-emerald-50", trendIcon: "trending_up" },
  { icon: "today", iconClass: "text-[#d0e1fb]", label: "Activities Today", value: "432", badge: "4%", badgeClass: "text-emerald-600 bg-emerald-50", trendIcon: "trending_up" },
  { icon: "work", iconClass: "text-[#bbc3ff]", label: "Project Events", value: "89", badge: null, badgeClass: "text-[#454654] bg-[#eceef0]", trendIcon: "horizontal_rule" },
  { icon: "error_outline", iconClass: "text-[#ba1a1a]", label: "Issue Events", value: "156", badge: "18%", badgeClass: "text-[#ba1a1a] bg-[#ffdad6]", trendIcon: "trending_up" },
  { icon: "person", iconClass: "text-[#7e3100]", label: "User Events", value: "127", badge: "2%", badgeClass: "text-emerald-600 bg-emerald-50", trendIcon: "trending_up" },
  { icon: "auto_awesome", iconClass: "text-[#2036bd]", label: "AI Actions", value: "60", badge: "New", badgeClass: "text-[#2036bd] bg-[#dfe0ff]", trendIcon: "bolt" },
];

const heatmapLevels = ["bg-[#eceef0]", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-[#2036bd]"];

const liveTimeline = [
  {
    type: "dot",
    dotClass: "border-[#2036bd]",
    innerClass: "bg-[#2036bd]",
    title: "New Pull Request",
    desc: <>Alex J. submitted to <span className="text-[#2036bd]">#main</span></>,
    time: "Just Now",
  },
  {
    type: "avatar",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIDonVaYjFgpMClyKXUgwVdHIetoGSwrVQ82gLqQ5YtsEBTICRLATkqMyFE94PEFN5TZvhx8F2S4bwV3VzTm1FRXcFcg6Y7kkRdalG8WQn3YHqmhs6BDpUvSpvkEBsx7RcrzVcyjM_s7BU4MVDOzZq3jEjpwyJ6cMH0x5b_ekvXkoQZPVmbuC6qu5NjgdU9nhXM9SzvkvjRR67fF_fM2Xuiosqn9bOHbfosCDRINeuzNOg6S6DCmiUaRfeaTONnCPv4S5OCf3DRx7M",
    title: "Meeting Started",
    desc: "Sprint Planning 2024-Q1",
    time: "15 mins ago",
  },
  {
    type: "icon",
    icon: "warning",
    iconClass: "text-amber-500",
    title: "Warning Logged",
    desc: "Disk usage threshold exceeded 90%",
    time: "1 hour ago",
  },
];

const contributors = [
  { name: "Sarah Chen", score: "98.2", barWidth: "w-[92%]", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5zhUMm4TqMi7wtprkZb_n-20mfHwYcl7H-JfwEjG--NQdpRzc7NMIwcHRRclcU2psY4Kog4kv83xEtQNPhOwVSM8mc7BFmyuvElvxZUzvCBdKvKjUSauUmwT3-FGv0-lseDGV-qKn8ZmGd8roKT6OMkWsdOtM5oCr4AUQTMVsdmvTtrVAKypPPl57iX7FErfOk_H1WmJ4rx5kYtZZNhOpu8Pt4zHGMjfVEcoN_t8ptLLe5mjZyrLkoaTThKjORdEA8CQIiqKfafkm" },
  { name: "Marcus Wright", score: "84.5", barWidth: "w-[84%]", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNoauIErZhwjzrQmEWCDHAqN958CsXUsqKklCiK2PhnRHdibpMnYpvKYO52zM2sWG9yldQBLnGAXPlgp2qN6i3LOvFF_jZKFQLGmqq-T3WMAlzcpZkFd542SHud8fjIJ8-V1PNOYpCrz1nHhzM5Wucfgbe1-TCjg6mi5A4UFW5q4Wm8P7DQUL-sQLBWTgxDrkHrh61GWK_1ek8k88uIURMUnSqBfpxseur__fZVijjwZwCC57p10SupCHYY5a_8FzZLU7_Qb6icZmI" },
  { name: "Elena Rodriguez", score: "76.0", barWidth: "w-[76%]", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqt5qLZ0y1W1NESAm5sFPRuqMF6cAHt1D92WK8BI81nKXzD7lNfdWPLUFd7gEhIAuSliFJDVIgP5014pC2QvRtk6FoNV_AADgE8aM6J2wHE-AY6wBIBuZ1ecF-vRq8yd9OZmw7YrtCQX2gK1XuGvFYlaj5rmMWGpoKcEZjJ2qYsni5GYcC-XFL_LtJlGh4jR4keRlL-XybNk29d2oKK-AiToPWe-GAO8qzn-UPxpNvNRzRLfx6AfIS6_lsBOShuofzU5cs8TYwyYb3" },
];

const criticalEvents = [
  { title: "Database Migration Failed", desc: "Deployment #882 rolled back automatically due to constraint error." },
  { title: "Unauthorized API Access", desc: "14 failed attempts from IP 104.22.x.x within 2 minutes." },
];

const auditLog = {
  loginActivity: [
    { user: "sarah.c", ip: "192.168.1.42", ok: true },
    { user: "admin", ip: "10.0.4.155", ok: true },
  ],
  permissionChanges: [
    <>Admin promoted <b>@user_44</b></>,
    <>Sarah C. updated <b>Role: Dev</b></>,
  ],
  apiUsage: [
    { key: "PROD_API_KEY", time: "32m ago" },
    { key: "REPL_SYNC_TOKEN", time: "1h ago" },
  ],
  criticalFailures: ["DB Connection Timed Out"],
};

// ─── Heatmap ─────────────────────────────────────────────────────────────────

function ActivityHeatmap() {
  const cells = Array.from({ length: 26 * 7 }, (_, i) =>
    heatmapLevels[Math.floor(Math.random() * heatmapLevels.length)]
  );
  return (
    <div className="bg-white border border-[#c5c5d7] rounded-xl p-5 flex flex-col h-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-semibold">Activity Intensity</h3>
        <div className="flex items-center gap-2 text-[10px] text-[#757686]">
          <span>Less</span>
          <div className="flex gap-1">
            {["bg-[#eceef0]", "bg-blue-200", "bg-blue-400", "bg-[#2036bd]"].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: "repeat(26, 1fr)", gridTemplateRows: "repeat(7, 1fr)" }}>
        {cells.map((cls, i) => (
          <div key={i} className={`rounded-sm aspect-square ${cls}`} />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-[#757686] font-medium">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Activity() {
  const [activities, setActivities] = useState(initialActivities);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterUser, setFilterUser] = useState("All Users");
  const [filterSeverity, setFilterSeverity] = useState("All Severity");
  const [aiQuery, setAiQuery] = useState("");

  const handleReset = () => {
    setFilterKeyword("");
    setFilterType("All Types");
    setFilterUser("All Users");
    setFilterSeverity("All Severity");
  };

  const filteredActivities = activities.filter((a) => {
    const kw = filterKeyword.toLowerCase();
    const matchesKw = !kw || a.description.toLowerCase().includes(kw) || a.user.name.toLowerCase().includes(kw);
    const matchesType = filterType === "All Types" || a.type === filterType;
    const matchesUser = filterUser === "All Users" || a.user.name === filterUser;
    return matchesKw && matchesType && matchesUser;
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
        <Sidebar />

    <Navbar />

    <div className="ml-[240px] pt-14">
      {/* Background atmospherics */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px]" />
      </div>

      <div className="p-4 lg:p-6 flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight leading-tight">Activity Center</h2>
            <p className="text-[14px] text-[#505f76] mt-0.5">Monitor and track all project, issue, and team activities across ForgeFlow</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#c5c5d7] rounded-lg text-[12px] font-semibold hover:bg-[#eceef0] transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Activity
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2036bd] text-white rounded-lg text-[12px] font-semibold hover:opacity-90 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">assessment</span>
              Generate Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((card) => (
            <div key={card.label} className="bg-white p-4 border border-[#c5c5d7] rounded-xl flex flex-col gap-1 hover:border-blue-300 transition-all cursor-default group">
              <div className="flex justify-between items-start mb-2">
                <span className={`material-symbols-outlined group-hover:scale-110 transition-transform ${card.iconClass}`}>{card.icon}</span>
                <span className={`text-[10px] font-bold px-1.5 rounded flex items-center gap-0.5 ${card.badgeClass}`}>
                  <span className="material-symbols-outlined text-[12px]">{card.trendIcon}</span>
                  {card.badge}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#505f76] uppercase tracking-wider">{card.label}</p>
              <p className="text-[18px] font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* ── Left/Center Column ── */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">

            {/* AI Analyzer + Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Analyzer */}
              <div className="md:col-span-1 bg-gradient-to-br from-[#3e52d5] to-[#2036bd] p-6 rounded-xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between h-64">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                    <h3 className="text-[18px] font-semibold">AI Activity Analyzer</h3>
                  </div>
                  <p className="text-[13px] opacity-90 mb-4">Detection of anomalies and productivity trends based on historical flow.</p>
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Anomaly Detection</p>
                    <p className="text-[13px]">Peak activity observed in 'Project Alpha' between 2-4 AM UTC.</p>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-white/20 rounded-lg py-2 px-3 text-[13px] placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40 border border-white/30"
                      placeholder="Analyze activity trends..."
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[200px]">bolt</span>
                </div>
              </div>

              {/* Heatmap */}
              <div className="md:col-span-2">
                <ActivityHeatmap />
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white border border-[#c5c5d7] p-3 rounded-xl flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#757686] text-[16px]">search</span>
                <input
                  className="w-full h-9 bg-[#f2f4f6] border border-[#c5c5d7] rounded-lg pl-9 pr-3 text-[13px] focus:ring-1 focus:ring-[#2036bd] outline-none"
                  placeholder="Filter by description..."
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                />
              </div>
              <select
                className="h-9 border border-[#c5c5d7] rounded-lg text-[13px] px-3 bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option>All Types</option>
                <option>Issue Update</option>
                <option>Security</option>
                <option>Automation</option>
                <option>Deployment</option>
                <option>User Login</option>
              </select>
              <select
                className="h-9 border border-[#c5c5d7] rounded-lg text-[13px] px-3 bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                <option>All Users</option>
                <option>Sarah Chen</option>
                <option>Marcus Wright</option>
                <option>ForgeBot (AI)</option>
              </select>
              <select
                className="h-9 border border-[#c5c5d7] rounded-lg text-[13px] px-3 bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option>All Severity</option>
                <option>Critical</option>
                <option>Warning</option>
                <option>Info</option>
              </select>
              <div className="h-6 w-px bg-[#c5c5d7] mx-1" />
              <button onClick={handleReset} className="text-[#2036bd] text-[12px] font-semibold hover:underline underline-offset-4">
                Reset Filters
              </button>
            </div>

            {/* Activity Feed Table */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#c5c5d7] flex justify-between items-center">
                <h3 className="text-[18px] font-semibold">Activity Feed</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[11px] text-[#757686] font-semibold">Live Stream Active</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f2f4f6] border-b border-[#c5c5d7]">
                    <tr>
                      {["Timestamp", "User", "Type", "Project", "Description", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#757686]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c5d7]">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#757686]">No activities match your filters.</td>
                      </tr>
                    ) : (
                      filteredActivities.map((item) => (
                        <tr key={item.id} className="hover:bg-[#f2f4f6] transition-colors">
                          <td className="px-5 py-3 font-mono text-[12px] whitespace-nowrap text-[#757686]">{item.timestamp}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <img src={item.user.avatar} alt={item.user.name} className="w-6 h-6 rounded-full border border-[#c5c5d7] object-cover" />
                              <span className="text-[13px] font-medium">{item.user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${item.typeBadge}`}>{item.type}</span>
                          </td>
                          <td className="px-5 py-3 text-[13px] font-medium text-[#2036bd]">{item.project}</td>
                          <td className="px-5 py-3 text-[13px] max-w-xs truncate text-[#454654]">{item.description}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${item.statusBadge}`}>{item.status}</span>
                          </td>
                          <td className="px-5 py-3">
                            <button className="text-[#505f76] hover:text-[#2036bd] transition-colors">
                              <span className="material-symbols-outlined text-[18px]">{item.actionIcon}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Audit Log */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#c5c5d7] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold">Security Audit Log</h3>
                <button className="text-[#2036bd] text-[12px] font-bold hover:underline">View All Logs</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-[#c5c5d7]">
                {/* Login Activity */}
                <div className="p-4">
                  <p className="text-[10px] text-[#757686] font-bold uppercase tracking-wider mb-3">Login Activity</p>
                  <div className="space-y-3">
                    {auditLog.loginActivity.map((entry, i) => (
                      <div key={i} className="flex justify-between items-center text-[13px]">
                        <span>{entry.user}</span>
                        <span className="font-mono text-[12px]">{entry.ip}</span>
                        <span className={`material-symbols-outlined text-[16px] ${entry.ok ? "text-emerald-500" : "text-red-500"}`}>
                          {entry.ok ? "check_circle" : "cancel"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Permission Changes */}
                <div className="p-4">
                  <p className="text-[10px] text-[#757686] font-bold uppercase tracking-wider mb-3">Permission Changes</p>
                  <div className="space-y-3">
                    {auditLog.permissionChanges.map((item, i) => (
                      <p key={i} className="text-[13px]">{item}</p>
                    ))}
                  </div>
                </div>
                {/* API Secret Usage */}
                <div className="p-4">
                  <p className="text-[10px] text-[#757686] font-bold uppercase tracking-wider mb-3">API Secret Usage</p>
                  <div className="space-y-3">
                    {auditLog.apiUsage.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[13px]">
                        <span>{item.key}</span>
                        <span className="text-[10px] font-bold text-[#454654] bg-[#eceef0] px-1 rounded">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Critical Failures */}
                <div className="p-4">
                  <p className="text-[10px] text-[#757686] font-bold uppercase tracking-wider mb-3">Critical Failures</p>
                  <div className="space-y-3">
                    {auditLog.criticalFailures.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#ba1a1a] text-[13px]">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar Column ── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">

            {/* Live Timeline */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-5 shadow-sm">
              <h3 className="text-[18px] font-semibold mb-4">Live Timeline</h3>
              <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c5c5d7]">
                {liveTimeline.map((item, i) => (
                  <div key={i} className="relative pl-8">
                    {item.type === "dot" && (
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 bg-white z-10 flex items-center justify-center ${item.dotClass}`}>
                        <span className={`w-2 h-2 rounded-full ${item.innerClass}`} />
                      </div>
                    )}
                    {item.type === "avatar" && (
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-[#c5c5d7] bg-white z-10 flex items-center justify-center overflow-hidden">
                        <img src={item.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      </div>
                    )}
                    {item.type === "icon" && (
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-[#c5c5d7] bg-white z-10 flex items-center justify-center">
                        <span className={`material-symbols-outlined text-[14px] ${item.iconClass}`}>{item.icon}</span>
                      </div>
                    )}
                    <p className="text-[11px] font-bold">{item.title}</p>
                    <p className="text-[13px] text-[#505f76]">{item.desc}</p>
                    <p className="text-[10px] text-[#757686] mt-1 uppercase font-bold tracking-tighter">{item.time}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 border border-[#c5c5d7] rounded-lg text-[12px] font-bold text-[#505f76] hover:bg-[#eceef0] transition-colors">
                Load More History
              </button>
            </div>

            {/* Top Contributors */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-5 shadow-sm">
              <h3 className="text-[18px] font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {contributors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-[13px] font-bold">{c.name}</p>
                      <div className="w-full bg-[#eceef0] h-1.5 rounded-full mt-1">
                        <div className={`bg-[#2036bd] h-full rounded-full ${c.barWidth}`} />
                      </div>
                    </div>
                    <p className="text-[12px] font-bold text-[#2036bd]">{c.score}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Events */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[20px]">notification_important</span>
                <h3 className="text-[18px] font-semibold">Critical Events</h3>
              </div>
              <div className="space-y-3">
                {criticalEvents.map((e, i) => (
                  <div key={i} className="bg-white/60 p-3 rounded border border-red-100">
                    <p className="text-[11px] font-bold text-[#ba1a1a]">{e.title}</p>
                    <p className="text-[11px] text-[#93000a] mt-1">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Insights */}
            <div className="bg-[#e6e8ea] rounded-xl p-5 border border-[#c5c5d7]">
              <h3 className="text-[18px] font-semibold mb-3">Insights</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-[#c5c5d7] shadow-sm">
                  <p className="text-[10px] font-bold text-[#505f76] uppercase leading-tight">Hot Project</p>
                  <p className="text-[12px] font-bold text-[#2036bd] truncate">Core Engine</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#c5c5d7] shadow-sm">
                  <p className="text-[10px] font-bold text-[#505f76] uppercase leading-tight">Collab Score</p>
                  <p className="text-[12px] font-bold text-[#2036bd]">8.4 / 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 py-6 border-t border-[#c5c5d7] flex justify-between items-center text-[#505f76] text-[11px]">
          <p>© 2024 ForgeFlow Enterprise Management System. All rights reserved.</p>
          <div className="flex gap-4">
            {["System Status: Healthy", "Privacy Policy", "API Documentation"].map((link) => (
              <a key={link} href="#" className="hover:text-[#2036bd] transition-colors">{link}</a>
            ))}
          </div>
        </footer>
      </div>

      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#2036bd] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform group relative">
          <span className="material-symbols-outlined">smart_toy</span>
          <div className="absolute right-full mr-3 bg-[#191c1e] text-white px-3 py-1.5 rounded-lg text-[13px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask ForgeBot AI
          </div>
        </button>
      </div>
    </div>
    </div>
  );
}