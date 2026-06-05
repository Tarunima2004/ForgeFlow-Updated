import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
// ─── Static data (replace with API calls) ────────────────────────────────────

const initialAnalyticsData = {
  kpiCards: [
    {
      id: 1,
      label: "Total Projects",
      icon: "folder",
      value: "142",
      trend: "+4%",
      trendClass: "text-green-600",
      trendIcon: "trending_up",
      sparkType: "bars",
      sparkBars: ["40%", "60%", "45%", "75%", "85%"],
    },
    {
      id: 2,
      label: "Active Projects",
      icon: "play_circle",
      value: "28",
      trend: "-2%",
      trendClass: "text-red-600",
      trendIcon: "trending_down",
      sparkType: "bars",
      sparkBars: ["80%", "65%", "90%", "55%", "60%"],
    },
    {
      id: 3,
      label: "Total Issues",
      icon: "list_alt",
      value: "1,842",
      trend: "+12%",
      trendClass: "text-green-600",
      trendIcon: "trending_up",
      sparkType: "bars",
      sparkBars: ["30%", "40%", "60%", "80%", "95%"],
    },
    {
      id: 4,
      label: "Open Issues",
      icon: "radio_button_checked",
      value: "312",
      trend: "No change",
      trendClass: "text-[#505f76]",
      trendIcon: null,
      sparkType: "bars",
      sparkBars: ["50%", "50%", "50%", "50%", "50%"],
    },
    {
      id: 5,
      label: "Closed Issues",
      icon: "check_circle",
      value: "1,530",
      trend: "+8%",
      trendClass: "text-green-600",
      trendIcon: "trending_up",
      sparkType: "progress-green",
      progressWidth: "w-[85%]",
    },
    {
      id: 6,
      label: "Team Productivity",
      icon: "speed",
      value: "94.2",
      trend: "+1.2",
      trendClass: "text-green-600",
      trendIcon: "trending_up",
      sparkType: "progress-blue",
      progressWidth: "w-[94%]",
    },
    {
      id: 7,
      label: "Avg Resolution Time",
      icon: "timer",
      value: "4.2h",
      trend: "-12%",
      trendClass: "text-green-600",
      trendIcon: "trending_down",
      sparkType: "step-bars",
      stepBars: ["80%", "60%", "40%", "20%"],
    },
    {
      id: 8,
      label: "Sprint Velocity",
      icon: "bolt",
      value: "86",
      trend: "Target: 90",
      trendClass: "text-[#505f76]",
      trendIcon: null,
      sparkType: "progress-blue",
      progressWidth: "w-[86%]",
    },
  ],
  contributors: [
    {
      name: "Sarah Jenkins",
      tasks: "42 Tasks / 98% Velocity",
      barWidth: "w-[98%]",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs8AY15zSldIVU8z_NOmEuBmul9ZrIcEkaFXoiENbtlHqXDQrA_BGhQJJAmOJQ15GT8eewEL8D6oG5JozbpeklTunqKuFZdUh3TuHzH8AhEBZkEC1Nn-aggZYBKovOm3sSlvpjGj3F9rVguKAculT5-kLDOCIbAG4AdT1pr5DPCWRVJEGr9h7ImtF_y4XgqqrWgarRMiI3-8HlIIjd7B_IHFONMgpP-ThzJXiVQ-3MMJGD3orEkz7IForoJki66Bvp32EaNXDTfcbM",
    },
    {
      name: "Marcus Chen",
      tasks: "38 Tasks / 92% Velocity",
      barWidth: "w-[92%]",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe-fYvv6OPaZTmG3S0Y1l0cAQ5w9znAa_phFxvORmvtsUK8sS_ktbX1A930yaHqe227HocdTgALYlaqom7e1e1VxYjbfAx3eMHwKWZNnOz2xGFVodAklDEI0dUeOroJ0ifuqS8ldz5eCusRE1ba9TzV_z0j-00muiYaXgWJpLvInbpwtkd9_Yx6QviRwpemQzzRGo4Sfb6ahPCA6m5q4zvuK9spf1agJxnhi8J8CFvj7Cj9T6jhNum_vB8Po3qCuQYXtXXQo99ktaF",
    },
    {
      name: "David Rivera",
      tasks: "35 Tasks / 89% Velocity",
      barWidth: "w-[89%]",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZPoc7EYgfEr7cd8ao0uSlubK9M0O_6Dthf-J8LPIBr7fXAlyzEGkpUB9CfvMFoxFYTXjdafZhVFbJO0dzefB12ysxqBSKbCdUHNf3gthdqNGQmO7fGyDTasMnjYPvpU40Q-f3uErgOBnI_AhPZUUsyjcTN24NJvEley5xvUusdVRxhyxV5FxfzOAQWBjXojqwJn2G59rTz5yYLRqpdci1W_ySzUFomm7UnWemLT90pkXgSVkDwFjItqCXbmvcOaeQa8Cbnum8BUM1",
    },
  ],
  reports: [
    { name: "Q3 Project Efficiency Audit", date: "Oct 12, 2023", type: "Executive Summary", status: "Ready", statusClass: "bg-green-100 text-green-700", actions: ["Download", "Share"] },
    { name: "Sprint 12 Velocity Breakdown", date: "Oct 10, 2023", type: "Sprint Report", status: "Ready", statusClass: "bg-green-100 text-green-700", actions: ["Download", "Share"] },
    { name: "Annual Resource Allocation Map", date: "Oct 05, 2023", type: "Forecasting", status: "Archived", statusClass: "bg-amber-100 text-amber-700", actions: ["View", "Restore"] },
  ],
  projectHealth: [
    { label: "Healthy", count: "18 Projects", icon: "check_circle", bg: "bg-green-50", border: "border-green-200", iconClass: "text-green-600", labelClass: "text-green-800", valueClass: "text-green-900" },
    { label: "At Risk", count: "6 Projects", icon: "warning", bg: "bg-amber-50", border: "border-amber-200", iconClass: "text-amber-600", labelClass: "text-amber-800", valueClass: "text-amber-900" },
    { label: "Delayed", count: "2 Projects", icon: "error", bg: "bg-red-50", border: "border-red-200", iconClass: "text-red-600", labelClass: "text-red-800", valueClass: "text-red-900" },
    { label: "Blocked", count: "2 Projects", icon: "block", bg: "bg-[#eceef0]", border: "border-[#c5c5d7]", iconClass: "text-[#505f76]", labelClass: "text-[#505f76]", valueClass: "text-[#191c1e]" },
  ],
  executiveSummary: [
    { label: "Most Productive Team", value: "Core Dev (Team Alpha)", valueClass: "text-[#2036bd]" },
    { label: "Fastest Resolver", value: "Sarah Jenkins", valueClass: "text-[#2036bd]" },
    { label: "Critical Bottleneck", value: "QA Sandbox Testing", valueClass: "text-[#ba1a1a]" },
  ],
  priorityHeatmap: [
    { label: "Urgent", pct: "12%", widthClass: "w-[12%]", barClass: "bg-[#ba1a1a]" },
    { label: "High", pct: "24%", widthClass: "w-[24%]", barClass: "bg-orange-500" },
    { label: "Medium", pct: "48%", widthClass: "w-[48%]", barClass: "bg-[#2036bd]" },
  ],
  resourceHeatmap: [
    "bg-blue-100","bg-blue-400","bg-blue-200","bg-blue-600","bg-blue-800","bg-blue-300","bg-blue-100",
    "bg-blue-900","bg-blue-200","bg-blue-100","bg-blue-100","bg-blue-400","bg-blue-500","bg-blue-100",
    "bg-blue-200","bg-blue-300","bg-blue-950","bg-blue-200","bg-blue-100","bg-blue-100","bg-blue-400",
    "bg-blue-600","bg-blue-200","bg-blue-300","bg-blue-100","bg-blue-300","bg-blue-600","bg-blue-100",
    "bg-blue-100","bg-blue-800","bg-blue-200","bg-blue-100","bg-blue-400","bg-blue-200","bg-blue-100","bg-blue-900",
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SparkBars({ bars }) {
  return (
    <div className="mt-4 h-10 w-full flex items-end gap-0.5">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`rounded-t-sm w-full ${i === bars.length - 1 ? "bg-[#2036bd]" : "bg-blue-200"}`}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

function StepBars({ bars }) {
  return (
    <div className="mt-4 flex gap-1 items-end h-6">
      {bars.map((h, i) => (
        <div key={i} className="w-2 bg-[#2036bd] rounded-sm" style={{ height: h }} />
      ))}
    </div>
  );
}

function ProgressSpark({ widthClass, colorClass }) {
  return (
    <div className="mt-4 h-2 bg-[#eceef0] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colorClass} ${widthClass}`} />
    </div>
  );
}

function ProgressGreen({ widthClass }) {
  return (
    <div className="mt-4 h-10 w-full bg-green-50 rounded p-1 flex items-center">
      <div className={`h-full bg-green-500 rounded-sm ${widthClass}`} />
    </div>
  );
}

function KpiCard({ card }) {
  return (
    <div className="bg-white p-4 border border-[#c5c5d7] rounded-lg hover:border-[#2036bd] transition-colors">
      <div className="flex justify-between mb-2">
        <span className="text-[11px] font-semibold text-[#505f76] uppercase tracking-wider">{card.label}</span>
        <span className="material-symbols-outlined text-[#2036bd] bg-blue-50 p-1 rounded text-[18px]">{card.icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold">{card.value}</h3>
        <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${card.trendClass}`}>
          {card.trend}
          {card.trendIcon && <span className="material-symbols-outlined text-[14px]">{card.trendIcon}</span>}
        </span>
      </div>
      {card.sparkType === "bars" && <SparkBars bars={card.sparkBars} />}
      {card.sparkType === "step-bars" && <StepBars bars={card.stepBars} />}
      {card.sparkType === "progress-blue" && <ProgressSpark widthClass={card.progressWidth} colorClass="bg-[#2036bd]" />}
      {card.sparkType === "progress-green" && <ProgressGreen widthClass={card.progressWidth} />}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Analytics() {
  const [data, setData] = useState(initialAnalyticsData);
  const [filterProject, setFilterProject] = useState("All Projects");
  const [filterTeam, setFilterTeam] = useState("All Teams");
  const [filterUser, setFilterUser] = useState("All Users");
  const [aiQuery, setAiQuery] = useState("");

  const handleReset = () => {
    setFilterProject("All Projects");
    setFilterTeam("All Teams");
    setFilterUser("All Users");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
        <Sidebar />

    <Navbar />

    <div className="ml-[240px] pt-14">
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full min-w-0">

        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-[#c5c5d7] pb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Analytics Center</h2>
            <p className="text-[14px] text-[#505f76] max-w-2xl mt-0.5">
              Track project performance, team productivity, issue resolution trends, and business insights across the enterprise.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-[#c5c5d7] px-4 py-2 rounded text-[12px] font-semibold flex items-center gap-2 hover:bg-[#eceef0] transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Analytics
            </button>
            <button className="bg-[#2036bd] text-white px-4 py-2 rounded text-[12px] font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">description</span>
              Generate Executive Report
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-[#c5c5d7] rounded-lg shadow-sm">
          <div className="flex items-center bg-[#eceef0] rounded px-3 py-1.5 gap-2 border border-[#c5c5d7]">
            <span className="material-symbols-outlined text-[18px] text-[#505f76]">calendar_today</span>
            <span className="text-[12px]">Last 30 Days</span>
          </div>
          <div className="h-6 w-px bg-[#c5c5d7] mx-1" />
          <select
            className="bg-[#f2f4f6] border border-[#c5c5d7] rounded px-3 py-1 text-[12px] focus:ring-1 focus:ring-[#2036bd] outline-none min-w-[120px]"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option>All Projects</option>
            <option>ForgeFlow Mobile</option>
            <option>Enterprise API</option>
          </select>
          <select
            className="bg-[#f2f4f6] border border-[#c5c5d7] rounded px-3 py-1 text-[12px] focus:ring-1 focus:ring-[#2036bd] outline-none min-w-[120px]"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            <option>All Teams</option>
            <option>Core Dev</option>
            <option>Design Ops</option>
          </select>
          <select
            className="bg-[#f2f4f6] border border-[#c5c5d7] rounded px-3 py-1 text-[12px] focus:ring-1 focus:ring-[#2036bd] outline-none min-w-[120px]"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option>All Users</option>
          </select>
          <button
            onClick={handleReset}
            className="ml-auto text-[#2036bd] text-[12px] font-bold flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset Filters
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpiCards.map((card) => (
            <KpiCard key={card.id} card={card} />
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">

          {/* Project Performance Chart */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-[#c5c5d7] rounded-lg p-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[18px] font-semibold">Project Performance Trends</h4>
              <div className="flex gap-4">
                {[
                  { color: "bg-[#2036bd]", label: "Completed" },
                  { color: "bg-[#505f76]", label: "Active" },
                  { color: "bg-[#ba1a1a]", label: "Delayed" },
                ].map((l) => (
                  <label key={l.label} className="flex items-center gap-2 text-[11px] font-medium">
                    <span className={`w-3 h-3 rounded-full ${l.color}`} />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="h-[300px] relative w-full border-b border-l border-[#c5c5d7] flex items-end pb-2 pl-2 overflow-hidden">
              <div className="absolute inset-0 flex items-end pointer-events-none">
                <svg className="w-full h-full opacity-20" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,300 L0,220 C100,180 200,240 300,150 C400,100 500,180 600,120 C700,160 800,80 900,40 L1000,0 L1000,300 Z" fill="#2036bd" />
                </svg>
              </div>
              <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-[11px] text-[#505f76] px-4">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => <span key={w}>{w}</span>)}
              </div>
            </div>
          </div>

          {/* Status Distribution + Priority Heatmap */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Status Distribution */}
            <div className="bg-white border border-[#c5c5d7] rounded-lg p-4">
              <h4 className="text-[18px] font-semibold mb-4">Status Distribution</h4>
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="w-32 h-32 rounded-full border-[12px] border-[#2036bd] border-t-[#505f76] border-r-[#eceef0] relative flex items-center justify-center">
                  <div className="text-center">
                    <span className="block font-bold text-lg">68%</span>
                    <span className="text-[10px] text-[#505f76] uppercase">Done</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { dot: "bg-[#2036bd]", label: "Done (1.2k)" },
                    { dot: "bg-[#505f76]", label: "In Progress (420)" },
                    { dot: "bg-[#eceef0]", label: "Backlog (180)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Heatmap */}
            <div className="bg-white border border-[#c5c5d7] rounded-lg p-4">
              <h4 className="text-[18px] font-semibold mb-4">Priority Heatmap</h4>
              <div className="space-y-3">
                {data.priorityHeatmap.map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>{p.label}</span>
                      <span>{p.pct}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#eceef0] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.barClass} ${p.widthClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="col-span-12 lg:col-span-9 bg-white border border-[#c5c5d7] rounded-lg p-4">
            <h4 className="text-[18px] font-semibold mb-6">Top Contributors &amp; Velocity</h4>
            <div className="space-y-4">
              {data.contributors.map((c) => (
                <div key={c.name} className="flex items-center gap-4">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] font-bold">{c.name}</span>
                      <span className="text-[11px] text-[#505f76]">{c.tasks}</span>
                    </div>
                    <div className="h-2 bg-[#eceef0] rounded-full overflow-hidden">
                      <div className={`bg-[#2036bd] h-full rounded-full ${c.barWidth}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="col-span-12 lg:col-span-3 bg-[#f2f4f6] border border-[#c5c5d7] rounded-lg p-4">
            <h4 className="text-[11px] font-semibold text-[#505f76] uppercase tracking-wider mb-4">Executive Summary</h4>
            <div className="space-y-4">
              {data.executiveSummary.map((item) => (
                <div key={item.label} className="p-3 bg-white border border-[#c5c5d7] rounded">
                  <p className="text-[11px] text-[#505f76]">{item.label}</p>
                  <h5 className={`text-[14px] font-bold ${item.valueClass}`}>{item.value}</h5>
                </div>
              ))}
            </div>
          </div>

          {/* Project Health Cards */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.projectHealth.map((item) => (
              <div key={item.label} className={`${item.bg} border ${item.border} p-4 rounded-lg flex items-center gap-4`}>
                <span className={`material-symbols-outlined text-[32px] ${item.iconClass}`}>{item.icon}</span>
                <div>
                  <h5 className={`text-[11px] font-bold ${item.labelClass}`}>{item.label}</h5>
                  <p className={`text-[18px] font-bold ${item.valueClass}`}>{item.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resource Utilization Heatmap */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-[#c5c5d7] rounded-lg p-4">
            <h4 className="text-[18px] font-semibold mb-6">Resource Utilization Heatmap</h4>
            <div className="grid grid-cols-12 gap-1 h-32">
              {data.resourceHeatmap.map((cls, i) => (
                <div key={i} className={`rounded-sm ${cls}`} />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[11px] text-[#505f76] uppercase font-medium">
              <span>Development</span>
              <span>Design</span>
              <span>QA / Devops</span>
            </div>
          </div>

          {/* AI Insights */}
          <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-[#3e52d5] to-[#2036bd] rounded-lg p-4 text-white shadow-lg overflow-hidden relative group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative">
              <span className="material-symbols-outlined text-[32px]">psychology</span>
              <h4 className="text-[18px] font-semibold">ForgeFlow AI Insights</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20 relative">
              <p className="text-[14px] italic mb-4 opacity-90">
                "Predictive analysis suggests Project 'Atlas' is at high risk of 2-week delay due to QA resource bottlenecks. Recommended action: Allocate 2 developers from Maintenance Team for cross-testing."
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white/20 rounded text-[11px] font-medium">Risk: High</span>
                <span className="px-2 py-1 bg-white/20 rounded text-[11px] font-medium">Impact: Sprint 14</span>
              </div>
            </div>
            <div className="flex gap-2 relative">
              <input
                className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder:text-white/60 focus:ring-1 focus:ring-white outline-none text-[13px]"
                placeholder="Ask AI about project performance..."
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <button className="bg-white text-[#2036bd] px-6 py-2 rounded font-bold text-[12px] hover:opacity-90 transition-opacity">
                Generate Insights
              </button>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="col-span-12 bg-white border border-[#c5c5d7] rounded-lg p-4">
            <h4 className="text-[18px] font-semibold mb-6">Recent Reports</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f2f4f6] text-[11px] text-[#505f76] uppercase">
                    {["Report Name", "Generated", "Type", "Status", "Actions"].map((h, i) => (
                      <th key={h} className={`px-4 py-3 font-semibold ${i === 4 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c5d7]">
                  {data.reports.map((report) => (
                    <tr key={report.name} className="hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-4 py-3 text-[14px] font-bold">{report.name}</td>
                      <td className="px-4 py-3 text-[13px]">{report.date}</td>
                      <td className="px-4 py-3 text-[13px]">{report.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${report.statusClass}`}>{report.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button className="text-[#2036bd] hover:underline text-[11px] font-semibold">{report.actions[0]}</button>
                        <button className="text-[#505f76] hover:underline text-[11px] font-semibold">{report.actions[1]}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="py-4 border-t border-[#c5c5d7] bg-[#f2f4f6] flex justify-between items-center px-2">
          <span className="text-[11px] text-[#505f76]">© 2023 ForgeFlow Enterprise Inc. All rights reserved.</span>
          <div className="flex gap-4">
            {["System Status", "Documentation", "Support"].map((link) => (
              <a key={link} href="#" className="text-[11px] text-[#505f76] hover:text-[#2036bd] transition-colors">{link}</a>
            ))}
          </div>
        </footer>

      </div>
    </div>
    </div>
  );
}