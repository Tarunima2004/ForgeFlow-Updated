import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
const initialIssues = [
  {
    id: "FF-1042",
    title: "Database connection timeout on production cluster",
    project: "Core Infrastructure",
    priority: "Critical",
    status: "In Progress",
    assignee: { initials: "SR", name: "Sam Rivers", color: "bg-blue-100 text-blue-700" },
    date: "Oct 22",
  },
  {
    id: "FF-1039",
    title: "Refactor auth middleware for OAuth2.1 compliance",
    project: "Auth Services",
    priority: "High",
    status: "Open",
    assignee: { initials: "AK", name: "Alex Kim", color: "bg-purple-100 text-purple-700" },
    date: "Oct 24",
  },
  {
    id: "FF-1035",
    title: "Dark mode UI flicker on initial page load",
    project: "ForgeFlow Web",
    priority: "Medium",
    status: "Resolved",
    assignee: { initials: "MT", name: "Mia Thorne", color: "bg-pink-100 text-pink-700" },
    date: "Oct 18",
  },
];

const kpiCards = [
  { icon: "list_alt", iconClass: "text-blue-700 bg-blue-50", label: "Total Issues", value: "1,284", trend: "+12%", trendClass: "text-emerald-600" },
  { icon: "radio_button_checked", iconClass: "text-blue-600 bg-blue-50", label: "Open Issues", value: "156", trend: "+4%", trendClass: "text-red-600" },
  { icon: "pending", iconClass: "text-amber-600 bg-amber-50", label: "In Progress", value: "42", trend: "~0%", trendClass: "text-slate-500" },
  { icon: "check_circle", iconClass: "text-emerald-600 bg-emerald-50", label: "Resolved", value: "1,086", trend: "+18%", trendClass: "text-emerald-600" },
  { icon: "priority_high", iconClass: "text-red-600 bg-red-50", label: "Critical", value: "8", trend: "+2%", trendClass: "text-red-600" },
  { icon: "event_busy", iconClass: "text-purple-600 bg-purple-50", label: "Overdue", value: "14", trend: "+1%", trendClass: "text-red-600" },
];

const activityTimeline = [
  { color: "bg-blue-600", title: "Issue FF-1042 reassigned", time: "10 minutes ago by David Chen" },
  { color: "bg-emerald-500", title: "FF-1035 marked as Resolved", time: "2 hours ago by Mia Thorne" },
  { color: "bg-amber-500", title: "New comment on FF-1039", time: "4 hours ago by Alex Kim" },
];

const priorityLoad = [
  { label: "Critical", count: "8 Issues", widthClass: "w-[15%]", barClass: "bg-red-600" },
  { label: "High", count: "42 Issues", widthClass: "w-[45%]", barClass: "bg-amber-500" },
  { label: "Medium/Low", count: "106 Issues", widthClass: "w-[70%]", barClass: "bg-blue-500" },
];

const kanbanColumns = [
  {
    title: "Open",
    countClass: "bg-slate-100 text-slate-600",
    count: 24,
    cards: [
      { id: "FF-1039", dotClass: "bg-amber-500", title: "Refactor auth middleware for OAuth2.1 compliance", assignee: { initials: "AK", color: "bg-purple-100 text-purple-700" }, date: "Oct 24" },
    ],
  },
  {
    title: "In Progress",
    countClass: "bg-blue-100 text-blue-700",
    count: 8,
    cards: [
      { id: "FF-1042", dotClass: "bg-red-600", title: "Database connection timeout on production cluster", assignee: { initials: "SR", color: "bg-blue-100 text-blue-700" }, date: "Oct 22" },
    ],
  },
  {
    title: "Review",
    countClass: "bg-slate-100 text-slate-600",
    count: 12,
    cards: [
      { id: "FF-994", dotClass: "bg-slate-300", title: "Update API documentation for v2.4 Release", assignee: { initials: "LW", color: "bg-green-100 text-green-700" }, date: "Oct 18" },
    ],
  },
  {
    title: "Resolved",
    countClass: "bg-emerald-50 text-emerald-700",
    count: 156,
    cards: [
      { id: "FF-1035", resolved: true, title: "Dark mode UI flicker on initial page load", assignee: { initials: "MT", color: "bg-pink-100 text-pink-700" }, date: "" },
    ],
  },
];

function PriorityBadge({ priority }) {
  const map = {
    Critical: "bg-red-50 text-red-700 border border-red-100",
    High: "bg-amber-50 text-amber-700 border border-amber-100",
    Medium: "bg-slate-50 text-slate-700 border border-slate-100",
    Low: "bg-slate-50 text-slate-500 border border-slate-100",
  };
  const dotMap = {
    Critical: "bg-red-600",
    High: "bg-amber-600",
    Medium: "bg-slate-400",
    Low: "bg-slate-300",
  };
  return (
    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${map[priority] || map.Medium}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[priority] || dotMap.Medium}`}></span>
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    "In Progress": "bg-blue-50 text-blue-700",
    Open: "bg-slate-100 text-slate-700",
    Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

export default function IssuesManagement() {
  const [issues, setIssues] = useState(initialIssues);
  const [view, setView] = useState("table");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("Everyone");
  const [filterProject, setFilterProject] = useState("All");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState(false);

  const filteredIssues = issues.filter((issue) => {
    const keyword = filterKeyword.toLowerCase();
    const matchesKeyword =
      !keyword ||
      issue.title.toLowerCase().includes(keyword) ||
      issue.id.toLowerCase().includes(keyword) ||
      issue.project.toLowerCase().includes(keyword);
    const matchesStatus = filterStatus === "All" || issue.status === filterStatus;
    const matchesPriority = filterPriority === "All" || issue.priority === filterPriority;
    const matchesProject = filterProject === "All" || issue.project === filterProject;
    return matchesKeyword && matchesStatus && matchesPriority && matchesProject;
  });

  const handleReset = () => {
    setFilterKeyword("");
    setFilterStatus("All");
    setFilterPriority("All");
    setFilterAssignee("Everyone");
    setFilterProject("All");
  };

  const handleAnalyze = () => {
    if (aiInput.trim()) setAiResult(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
        <Sidebar />

    <Navbar />

    <div className="ml-[240px] pt-14">
      <main className="flex">
        {/* Center Canvas */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight leading-tight">Issues Management</h1>
              <p className="text-sm text-[#505f76] mt-0.5">Track, prioritize and resolve issues across all projects</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c5c5d7] text-[#505f76] rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Issues
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2036bd] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-semibold shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Issue
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {kpiCards.map((card) => (
              <div key={card.label} className="bg-white p-4 border border-[#c5c5d7] rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className={`material-symbols-outlined p-1.5 rounded-lg text-[20px] ${card.iconClass}`}>{card.icon}</span>
                  <span className={`text-[11px] font-bold ${card.trendClass}`}>{card.trend}</span>
                </div>
                <p className="text-[11px] font-semibold tracking-widest text-[#505f76] uppercase">{card.label}</p>
                <h3 className="text-2xl font-semibold mt-1">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white border border-[#c5c5d7] rounded-xl p-2 mb-6 flex flex-wrap gap-2 items-center">
            <div className="flex-1 relative min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">filter_list</span>
              <input
                className="w-full pl-10 pr-4 py-1.5 border border-[#c5c5d7] rounded-lg text-[13px] focus:ring-1 focus:ring-[#2036bd] outline-none"
                placeholder="Filter by keyword..."
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">Priority: All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value="Everyone">Assignee: Everyone</option>
              <option>Me</option>
              <option>Dev Team</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="All">Project: All</option>
              <option>Core Infrastructure</option>
              <option>Auth Services</option>
              <option>ForgeFlow Web</option>
            </select>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 border border-[#c5c5d7] rounded-lg text-[13px] hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 mb-4 bg-[#eceef0] rounded-lg p-1 w-fit">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all ${view === "table" ? "bg-white shadow-sm text-[#2036bd]" : "text-[#505f76] hover:text-[#191c1e]"}`}
            >
              Table View
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all ${view === "kanban" ? "bg-white shadow-sm text-[#2036bd]" : "text-[#505f76] hover:text-[#191c1e]"}`}
            >
              Kanban Board
            </button>
          </div>

          {/* Table View */}
          {view === "table" && (
            <div className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6] border-b border-[#c5c5d7]">
                  <tr>
                    {["ID", "Title", "Project", "Priority", "Status", "Assignee", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-semibold tracking-wider text-[#505f76] uppercase ${h === "Actions" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c5d7]">
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-[#757686]">No issues match your filters.</td>
                    </tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group">
                        <td className="px-4 py-3 font-mono text-[12px] text-[#757686]">{issue.id}</td>
                        <td className="px-4 py-3 text-[14px] font-medium">{issue.title}</td>
                        <td className="px-4 py-3 text-[13px] text-[#505f76]">{issue.project}</td>
                        <td className="px-4 py-3"><PriorityBadge priority={issue.priority} /></td>
                        <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${issue.assignee.color}`}>
                              {issue.assignee.initials}
                            </div>
                            <span className="text-[13px]">{issue.assignee.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 hover:bg-[#eceef0] rounded transition-colors text-[#757686] group-hover:text-[#2036bd]">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="p-4 border-t border-[#c5c5d7] flex justify-between items-center bg-white">
                <span className="text-[13px] text-[#505f76]">Showing {filteredIssues.length} of {issues.length} issues</span>
                <div className="flex gap-2">
                  <button className="p-1.5 border border-[#c5c5d7] rounded hover:bg-[#f2f4f6] transition-colors opacity-50 cursor-not-allowed" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="p-1.5 border border-[#c5c5d7] rounded hover:bg-[#f2f4f6] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Kanban View */}
          {view === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kanbanColumns.map((col) => (
                <div key={col.title} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2 mb-1">
                    <h4 className="text-[12px] font-bold uppercase text-[#505f76]">
                      {col.title}{" "}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${col.countClass}`}>{col.count}</span>
                    </h4>
                    <button className="p-1 hover:bg-[#eceef0] rounded transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 min-h-64">
                    {col.cards.map((card) => (
                      <div
                        key={card.id}
                        className={`p-3 rounded-xl border border-[#c5c5d7] shadow-sm transition-all hover:border-[#2036bd] cursor-grab active:cursor-grabbing ${card.resolved ? "bg-[#f2f4f6] grayscale opacity-60" : "bg-white"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-[12px] text-[#757686]">{card.id}</span>
                          {card.resolved ? (
                            <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                          ) : (
                            <span className={`w-2 h-2 rounded-full ${card.dotClass}`}></span>
                          )}
                        </div>
                        <h5 className="text-[14px] font-medium mb-3">{card.title}</h5>
                        <div className="flex justify-between items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${card.assignee.color}`}>
                            {card.assignee.initials}
                          </div>
                          {card.resolved ? (
                            <span className="text-emerald-600 text-[11px] font-semibold">Done</span>
                          ) : (
                            <div className="flex items-center gap-1 text-[#757686] text-[13px]">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              <span>{card.date}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-[#c5c5d7] p-4 flex flex-col gap-6 overflow-y-auto min-h-screen">
          {/* Issue Insights */}
          <section>
            <h4 className="text-lg font-semibold mb-4">Issue Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#f2f4f6] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2036bd]">timer</span>
                  <span className="text-[13px]">Avg Resolution</span>
                </div>
                <span className="text-[12px] font-bold">4.2h</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#f2f4f6] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">trending_up</span>
                  <span className="text-[13px]">Team Velocity</span>
                </div>
                <span className="text-[12px] font-bold">42 pts</span>
              </div>
            </div>
          </section>

          {/* Priority Load */}
          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-4">Priority Load</h4>
            <div className="space-y-3">
              {priorityLoad.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold">{p.label}</span>
                    <span className="text-[#505f76]">{p.count}</span>
                  </div>
                  <div className="w-full bg-[#e6e8ea] h-1.5 rounded-full">
                    <div className={`h-1.5 rounded-full ${p.barClass} ${p.widthClass}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Timeline */}
          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-4">Activity Timeline</h4>
            <div className="space-y-4 border-l-2 border-[#e6e8ea] ml-2 pl-4 relative">
              {activityTimeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${item.color}`}></div>
                  <p className="text-[13px] font-medium">{item.title}</p>
                  <p className="text-[11px] text-[#757686]">{item.time}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Issue Analyzer */}
          <section className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#2036bd] text-[20px]">psychology</span>
              <h4 className="text-[12px] font-bold text-[#2036bd]">AI Issue Analyzer</h4>
            </div>
            <p className="text-[12px] text-[#505f76] mb-3 leading-snug">
              Paste a bug report or description to get instant classification and routing recommendations.
            </p>
            <textarea
              className="w-full bg-white border border-[#c5c5d7] rounded-lg p-2 text-[13px] mb-3 focus:ring-1 focus:ring-[#2036bd] outline-none resize-none"
              placeholder="Enter issue details..."
              rows={3}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              className="w-full bg-[#2036bd] text-white py-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Analyze Issue
            </button>
            {aiResult && (
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-2">Recommendation</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold">Priority: High</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">Assign: Infrastructure</span>
                </div>
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
     </div>
  );
}