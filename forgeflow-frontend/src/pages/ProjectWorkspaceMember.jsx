import React from "react";

// =========================================================
// Material Symbols Icon helper
// =========================================================
function Icon({ name, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined align-middle inline-block ${className}`}
      style={{
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

// =========================================================
// BACKEND-READY DATA CONSTANTS
// Replace these with real API responses later.
// =========================================================

const currentUser = {
  name: "Alex Rivera",
  role: "Team Member",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChE3LKai-9bfJomrqGshUGCUZqtEqVSeNDRyysqBqaiwOmLtxOZb8W2jlkWTHHgw6B-rbcNYG7RXJQsBV81VBJDeq_eUk6zdiIoiHaf28lD8edSdsNMRVf8PUOGXjhdtsDen_CQjBNLmhdssXEa1Mvdm7MJZBvQXEv_eNwWBpYAU30pDnf-BPeSqM-kVtcR8xDRmeNi758YPI0h9F1i4Qb6ciAchLx5YyrOhCFYpyNSjk878dXntwhIDZffyrRUDfEeWL5xU7ugvkX",
  avatarAlt:
    "A professional headshot of a young male software engineer with short dark hair and a friendly expression, set against a soft blue professional office background. Minimalist and corporate styling.",
};

const project = {
  name: "Project Alpha",
  code: "PRJ-2024-001",
  status: "Active",
  priority: "High Priority",
  progress: 72,
  lastUpdated: "2 hours ago",
  userRoleBadge: "Team Member",
};

const myStatistics = [
  {
    id: "assigned",
    label: "Assigned to Me",
    value: 12,
    icon: "assignment",
    meta: "+2 from yesterday",
    metaClass: "text-slate-500",
    iconWrapClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
  {
    id: "completed",
    label: "Completed",
    value: 45,
    icon: "check_circle",
    meta: "85% rate",
    metaClass: "text-green-600 font-medium",
    iconWrapClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    id: "pending",
    label: "Pending",
    value: 8,
    icon: "pending",
    meta: "Review required",
    metaClass: "text-slate-500",
    iconWrapClass: "bg-yellow-100",
    iconClass: "text-yellow-600",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 2,
    icon: "error",
    meta: "Action Needed",
    metaClass: "text-red-600 font-bold",
    iconWrapClass: "bg-red-100",
    iconClass: "text-red-600",
    borderAccent: true,
  },
];

const assignedIssues = [
  {
    id: "FF-104",
    title: "Implement Auth Middleware",
    type: "Task",
    typeIcon: "task",
    typeIconClass: "text-blue-500",
    priority: "High",
    priorityClass: "bg-orange-100 text-orange-700",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-700",
    due: "Oct 24",
  },
  {
    id: "FF-109",
    title: "Refactor API Headers",
    type: "Bug",
    typeIcon: "bug_report",
    typeIconClass: "text-red-500",
    priority: "Critical",
    priorityClass: "bg-red-100 text-red-700",
    status: "To Do",
    statusClass: "bg-slate-200 text-slate-600",
    due: "Oct 26",
  },
  {
    id: "FF-92",
    title: "UI Review: Dashboards",
    type: "Design",
    typeIcon: "palette",
    typeIconClass: "text-purple-500",
    priority: "Medium",
    priorityClass: "bg-slate-200 text-slate-600",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-700",
    due: "Oct 28",
  },
];

const recentActivities = [
  {
    id: 1,
    text: (
      <>
        You updated status of <span className="text-blue-600 font-bold">FF-104</span> to{" "}
        <span className="font-bold">In Progress</span>
      </>
    ),
    time: "10 minutes ago",
    dotClass: "bg-blue-600",
    ringClass: "bg-blue-100",
  },
  {
    id: 2,
    text: (
      <>
        You added a comment on <span className="text-blue-600 font-bold">FF-98</span>
      </>
    ),
    time: "1 hour ago",
    dotClass: "bg-slate-500",
    ringClass: "bg-slate-200",
  },
  {
    id: 3,
    text: (
      <>
        You uploaded <span className="font-bold">'schema_v2.png'</span>
      </>
    ),
    time: "3 hours ago",
    dotClass: "bg-slate-500",
    ringClass: "bg-slate-200",
  },
];

const recentComments = [
  {
    id: "FF-98",
    time: "2h ago",
    text: "\"I've finished the initial draft of the API documentation. Please let me know if...\"",
  },
  {
    id: "FF-101",
    time: "Yesterday",
    text: "\"Wait, I think we should reconsider the dependency injection pattern here.\"",
  },
];

const myProgress = {
  percent: 85,
  radius: 58,
  circumference: 364.42,
  dashOffset: 54.66,
};

const focusItems = [
  { id: 1, text: "Resolve critical bug FF-109" },
  { id: 2, text: "Sync with Elena on API schema" },
  { id: 3, text: "Auth Middleware PR Review" },
];

const deadlines = [
  {
    id: "FF-109",
    label: "FF-109 Refactor API",
    due: "Due Today",
    urgent: true,
  },
  {
    id: "FF-104",
    label: "FF-104 Auth Middleware",
    due: "Tomorrow",
    urgent: false,
  },
  {
    id: "retro",
    label: "Sprint Retrospective",
    due: "Friday, 3:00 PM",
    urgent: false,
  },
];

const quickActions = [
  { id: "update-status", label: "Update Status", icon: "edit_square" },
  { id: "add-comment", label: "Add Comment", icon: "add_comment" },
  { id: "upload-file", label: "Upload File", icon: "upload_file" },
  { id: "log-time", label: "Log Time", icon: "schedule" },
];

const team = {
  managers: [
    {
      id: "sarah",
      name: "Sarah Loren",
      role: "Product Lead",
      online: true,
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBh6JEucOMhAGHj08UsKLpBmsKZ-0XxjUUmD9iz4GrIgDPjI3GrP71we5Que-k5bqptuKIHYsh4GBrIpg-4i3h-h6anbfzRA_4iTIqbhCd_vLZvWO3C9S6hjluHCZPOuiBEug-7Mtg_CXhEdlLmD20mIUmmZLQSfLRb8lvSne39ioX8E_ZX5BrY9hMjPE_OuMk7NtYcUUnknhmd8jcm4y2DoTCPSS2qTX29w_ZPJ5cClkDHkUsq3g-z11lehseHr8TKIvwPmrd8kcG-",
      avatarAlt:
        "A portrait of a senior female project manager, professional attire, warm and authoritative expression, high-end corporate office setting with soft natural lighting and glass partitions in the background.",
    },
  ],
  members: [
    {
      id: "marco",
      name: "Marco K.",
      role: "Frontend Dev",
      online: true,
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD7B5J30Eb8aAXUiOg7kn-tYxV3XTqiKN1QcsIOoGL_G8oz2Ozq2lu2q3fS-xS1HUaOq-RraS4qMpKc0lFrQ92URqbOHKd1S54Jd_j01fggTcUPY0q4NWuH_loMlB-Q8IJrwjJHDjezo9ob5AEYau5-9PJBjuAwT16d6m7TVyBdLFWl81KVThaFisDcXhjxzuLHfTd6zCHczSffZLa6sjPb1NcGubJWhG-xCzqKOJPgC4a2KRP53PYRC591__f3h4BVIrO2HIKrjZGa",
      avatarAlt:
        "Close-up headshot of a professional male developer with glasses, focused expression, modern creative workspace background with colorful ambient light, high resolution corporate photography style.",
    },
    {
      id: "elena",
      name: "Elena V.",
      role: "Backend Arch",
      online: false,
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPkcKMxUpyl0tXjJ7dUZrncEqiLgIPTNFy1_OILGTTHgmAGRLlHXJ6dGqAsYPkH1WgbLxGxYFZLmGHqcHAlYEp2JAdsBFb0oVH-gCRsAbP8hvXfjd25_1PkasvmnQt-oFBV4uMp-N6Dcb5uK-VZg_sRkg2nCrDZ1Jic7SDrGPnOsN-cZIK-c8Ts8LzitbLwuMM5tuDgrZ0eSuU4Q2tgJR71C0xGOmLmojA6Wnd-IU4UfGEPMqj19thcRwQ_cvKcFmTtjUsJlf58TP3",
      avatarAlt:
        "Professional headshot of a female software architect with a thoughtful and intellectual expression, minimalist white studio background, clean lighting, premium business aesthetic.",
    },
  ],
};

const teamCapacity = {
  percent: 75,
  label: "75% Assigned",
};

// =========================================================
// COMPONENT
// =========================================================

export default function ProjectWorkspaceMember() {
  return (
    <div className="bg-slate-50 text-slate-900 text-sm overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold text-blue-600">ForgeFlow</span>
            <div className="hidden md:flex relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-64 transition-all"
                placeholder="Search workspace..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <button className="hover:bg-slate-100 hover:text-blue-600 transition-colors p-2 rounded-full">
                <Icon name="notifications" className="text-slate-500" />
              </button>
              <button className="hover:bg-slate-100 hover:text-blue-600 transition-colors p-2 rounded-full">
                <Icon name="settings" className="text-slate-500" />
              </button>
              <button className="hover:bg-slate-100 hover:text-blue-600 transition-colors p-2 rounded-full">
                <Icon name="help" className="text-slate-500" />
              </button>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold tracking-wide text-slate-900">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {currentUser.role}
                </p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover"
                alt={currentUser.avatarAlt}
                src={currentUser.avatarUrl}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto min-h-screen">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col h-screen py-8 w-64 z-40 bg-slate-50 border-r border-slate-200 fixed">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">{project.name}</h2>
            </div>
            <p className="text-slate-500 text-[11px] font-medium">{project.code}</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <a
              className="flex items-center gap-3 bg-blue-100 text-slate-700 border-l-4 border-blue-600 rounded-r-lg px-4 py-3 translate-x-1 transition-transform duration-200"
              href="#"
            >
              <Icon name="dashboard" />
              <span className="text-[11px] font-semibold">Overview</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200 transition-all"
              href="#"
            >
              <Icon name="list_alt" />
              <span className="text-[11px] font-semibold">My Issues</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200 transition-all"
              href="#"
            >
              <Icon name="view_kanban" />
              <span className="text-[11px] font-semibold">Board</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200 transition-all"
              href="#"
            >
              <Icon name="event_note" />
              <span className="text-[11px] font-semibold">Timeline</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200 transition-all"
              href="#"
            >
              <Icon name="history" />
              <span className="text-[11px] font-semibold">Activity</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200 transition-all"
              href="#"
            >
              <Icon name="folder_open" />
              <span className="text-[11px] font-semibold">Files</span>
            </a>
          </nav>
          <div className="mt-auto px-6 py-4">
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                Team Capacity
              </p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${teamCapacity.percent}%` }}
                ></div>
              </div>
              <p className="text-[11px] mt-2 text-slate-500">{teamCapacity.label}</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-8">
          {/* Page Header Area */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <span>Projects</span>
                <Icon name="chevron_right" className="text-[16px]" />
                <span className="text-blue-600 font-medium">{project.name}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900">
                  {project.name}{" "}
                  <span className="text-slate-500 font-normal ml-2">{project.code}</span>
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-slate-700 text-xs font-semibold rounded-full">
                  {project.userRoleBadge}
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 border-l border-slate-200 pl-4">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {project.status} Status
                </div>
                <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                  <Icon name="priority_high" className="text-[18px]" /> {project.priority}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase">Progress</span>
                  <span className="text-sm font-bold text-slate-900">
                    {project.progress}% Completed
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase">Last Updated</span>
                  <span className="text-sm font-medium text-slate-900">
                    {project.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Icon name="view_kanban" className="text-[20px]" />
                View Board
              </button>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all scale-95 duration-100 flex items-center gap-2">
                <Icon name="task_alt" className="text-[20px]" />
                My Tasks
              </button>
            </div>
          </div>

          {/* Personal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {myStatistics.map((stat) => (
              <div
                key={stat.id}
                className={`bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${
                  stat.borderAccent ? "border-l-4 border-l-red-600" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${stat.iconWrapClass}`}>
                    <Icon name={stat.icon} className={stat.iconClass} />
                  </div>
                  <span className={`text-[11px] ${stat.metaClass}`}>{stat.meta}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Column (70%) */}
            <div className="lg:col-span-7 space-y-8">
              {/* My Assigned Issues Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900">My Assigned Issues</h3>
                  <a
                    className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1"
                    href="#"
                  >
                    View All My Issues <Icon name="arrow_forward" className="text-[14px]" />
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          ID
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Title
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Due
                        </th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {assignedIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-slate-100 transition-colors group"
                        >
                          <td className="px-6 py-4 font-bold text-blue-600 text-sm">
                            {issue.id}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900 text-sm">
                            {issue.title}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Icon
                                name={issue.typeIcon}
                                className={`text-[18px] ${issue.typeIconClass}`}
                              />{" "}
                              {issue.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${issue.priorityClass}`}
                            >
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${issue.statusClass}`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{issue.due}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 rounded transition-all">
                              <Icon name="visibility" className="text-slate-500 text-[20px]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity & Comments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity Timeline */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
                  <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/60">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="relative pl-8">
                        <div
                          className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${activity.ringClass}`}
                        >
                          <div className={`w-2 h-2 rounded-full ${activity.dotClass}`}></div>
                        </div>
                        <p className="text-sm text-slate-900 font-medium">{activity.text}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Recent Comments */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    My Recent Comments
                  </h3>
                  <div className="space-y-4">
                    {recentComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 bg-slate-100 rounded-lg border border-slate-200/60"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold text-blue-600">
                            {comment.id}
                          </span>
                          <span className="text-[10px] text-slate-500">{comment.time}</span>
                        </div>
                        <p className="text-sm text-slate-900 italic line-clamp-2">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (30%) */}
            <div className="lg:col-span-3 space-y-8">
              {/* My Progress Indicator */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 w-full">My Progress</h3>
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-slate-200"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={myProgress.radius}
                      stroke="currentColor"
                      strokeWidth="10"
                    />
                    <circle
                      className="text-blue-600 transition-all duration-1000 ease-out"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={myProgress.radius}
                      stroke="currentColor"
                      strokeDasharray={myProgress.circumference}
                      strokeDashoffset={myProgress.dashOffset}
                      strokeWidth="10"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-slate-900">
                      {myProgress.percent}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Done</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Individual completion for current sprint tasks.
                </p>
              </div>

              {/* Today's Focus */}
              <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="stars" /> Today's Focus
                </h3>
                <ul className="space-y-4">
                  {focusItems.map((item, index) => (
                    <li key={item.id} className="flex gap-3">
                      <span className="w-5 h-5 flex-shrink-0 rounded bg-white/20 flex items-center justify-center text-[12px] font-bold">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Deadlines</h3>
                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-bold ${
                            deadline.urgent ? "text-red-600" : "text-slate-900 font-medium"
                          }`}
                        >
                          {deadline.label}
                        </span>
                        <span className="text-[11px] text-slate-500">{deadline.due}</span>
                      </div>
                      {deadline.urgent && (
                        <Icon
                          name="warning"
                          className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col items-center gap-2 hover:bg-slate-100 transition-all group"
                  >
                    <Icon
                      name={action.icon}
                      className="text-blue-600 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[11px] font-bold">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Project Team */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Team</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">
                      Managers
                    </p>
                    {team.managers.map((person) => (
                      <div key={person.id} className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            className="w-8 h-8 rounded-full border border-slate-200"
                            alt={person.avatarAlt}
                            src={person.avatarUrl}
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                              person.online ? "bg-green-500" : "bg-slate-300"
                            }`}
                          ></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{person.name}</span>
                          <span className="text-[10px] text-slate-500">{person.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">
                      Members
                    </p>
                    <div className="space-y-4">
                      {team.members.map((person) => (
                        <div key={person.id} className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              className="w-8 h-8 rounded-full border border-slate-200"
                              alt={person.avatarAlt}
                              src={person.avatarUrl}
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                                person.online ? "bg-green-500" : "bg-slate-300"
                              }`}
                            ></span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">
                              {person.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{person.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}