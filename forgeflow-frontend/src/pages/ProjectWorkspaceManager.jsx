import React, { useState } from "react";

// =========================================================
// Hardcoded data, shaped so it can be swapped for API
// responses later without touching the JSX below.
// =========================================================
const project = {
  name: "Project Workspace",
  code: "PRJ-2024-001",
  icon: "rocket_launch",
  status: "Active",
  priority: "High Priority",
  progress: 72,
  description:
    "Modernizing the core infrastructure to support multi-cloud deployment strategies. This includes upgrading legacy services to micro-frontend architectures and implementing high-availability database clusters across three primary global regions.",
  timeline: "Jan 1 - Dec 31, 2024",
  visibility: "Private Project",
  department: "Engineering",
  currentUserAvatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9QJy8DA-8SvrvX5QQ9EBNtHCOqV82GUKT2f-GO4qlS8KIkyPs2Db2QAfetvnQBA4f-iy6e-Aray28C7XQekW7F2IidGI9hTU2AroDgR_nh8SnP_-FjiamgYYRCEWa8MSItXVn5L-i6xZdRoYN_62ZgW4TcZPVlZhACnfHT5IO_BjDOu6e7nAykk7Hl--EA0aWVo3QfY1H6cZXarYMnoTaAkOHXTVg9WVoEUfsMBuDNKWKpuyyFrgyjkH8Bliw72yAqj7Ho2u9wHX",
};

const statistics = {
  totalIssues: 124,
  backlog: 32,
  todo: 18,
  inProgress: 14,
  completed: 56,
  overdue: 4,
};

const health = {
  overallPercent: 72,
  riskLevel: "Low",
  overdueTasks: 4,
  blockedIssues: 2,
};

const issues = [
  {
    id: "FF-101",
    title: "Auth service timeout on retry",
    type: "Bug",
    typeIcon: "bug_report",
    typeClass: "text-red-700",
    priority: "CRITICAL",
    priorityClass: "bg-red-100 text-red-900",
    status: "To Do",
    statusClass: "bg-slate-200 text-slate-500",
    assigneeAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAD_iWqX1lY_Fm5eVwWpjAMX4sUql9iNMVYhB41sNvqfiIf3kQPzVtqFZjleXn_A7aZbDgwD-wKEWGJYVKVWFjsCVZH6jYum7UrNT6cjJAqHILCx_VghtAH3cG-SLf4rrddX_C_9TblzkNE9cKh1auNAx0PuJaE5mjwIjKrM5ib3yaWysUhJnN7XvlKzfGKH7XX95KFVGGycgVYRUVBdVrYCTwNAZ0vaevo_UIGxbajjBbW-mJPdCymnImwCFpsOEFqrSybht64FunQ",
  },
  {
    id: "FF-102",
    title: "Update API documentation",
    type: "Task",
    typeIcon: "task_alt",
    typeClass: "text-slate-500",
    priority: "HIGH",
    priorityClass: "bg-orange-100 text-orange-700",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-600",
    assigneeAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQWe63EtadkG1jfgrLtqCaHBcXP9FDyhJGj3KWKsQl1yrnGnNqWfDRm7CgY_076ZwbBq9E6oYcdnOmSZso9rwjMy_dXYIExEUxNnTVIYa_ARPi8QtRf97ojfi6CcMp0exN5NGHMkhAXroKfr5C1WuVomMVy1oeDNqqZfpwws5u30Om8VUm-Jn5f8kNtjxSMXCwZZxkcXG8DX9NdlkGNO6Pbqs9bDDUiP5Qv0BOjEfn-_QZfIX7Pu9kfl9B04cby58xX2d3E0vZBAF",
  },
];

const team = [
  {
    name: "Shakthi Admin",
    role: "Lead Manager",
    online: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxmbOod7OjalP1Pp3pROGxQ8qaLfLv-6K-02mu4j8Kz1YqqwFzvPv3xgrJboupMIHsCEavoCvtlYqbxKpXhsjo3LsvN2afkPoqmx_09Mi52-_7H0MZRMJZKaXfrJ5VennUSVdPylOMkNaPBmmwc9IODCMB16VVYZBgW23VFZe9fOiwOE5TveJMcDqgA08iqmOhhx4AwWqicOOplGei5Qx8QiQ3TkdydD1GVN59qwzPXNSESGIZV5n2zq4CAaGGfGc6I1ac0qyT8xqN",
  },
  {
    name: "Sarah Loren",
    role: "Backend Dev",
    online: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiABAbXVw1-zhYqUhlzppZ1YVUDLzbtkUWjuUCUN7H1k4rOyIpxR115DsfY5ungMR26MXlbZNiVBuWuA_8HiM2VC6M15SqfVshrGGcybJvs8FEErK4gDxVKY_3lq8BgnY1C1jrnZAoFVZY_PrdwXrXP83rkh_ThfqS9rNcaCYMzZfvUwVkquVCpKoUpSIuZi4ummdwTObjDkApfW5sa9s_PpkVYkyj7WhmfH9kXWjXn2fCEmduyg5_w-CnFXuG96RucQVmAiZqyqCO",
  },
  {
    name: "Marco K.",
    role: "UI/UX Designer",
    online: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9G9gWXv5hH__W5Tj8tLoFBc605SG5mXJ2lzPwUq8eYPebgKjNkSV53z-szTjqUJnXTHpNdHeWkduXFIEdrhwKD4aahP1mwCMQfOsZ_PeGcodWGM8m9Iam2lcnqtbTMLJ8egnMiPeFzTxZQ0Xbo5Xbnr44isSH977Sj1kj2Wkj4RnyBDoidXAHefEbBER_KG_jZyWLTZ7a8XxAM33Y3XKZ4-cXW3EBrUUPzmu3WB7wMiPRSG0hGM3qmhqVbBTwGUc46DOzoM8znBTj",
  },
];

const activities = [
  {
    id: 1,
    icon: "add_circle",
    iconBg: "bg-blue-600",
    actorName: "Shakthi Admin",
    actionText: "created a new task",
    targetText: "FF-105: UI Audit",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    icon: "check_circle",
    iconBg: "bg-green-500",
    actorName: "Marco K.",
    actionText: "completed",
    targetText: "FF-098: DB Migration",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    icon: "comment",
    iconBg: "bg-amber-500",
    actorName: "Sarah L.",
    actionText: "commented on",
    targetText: "FF-101",
    timestamp: "Yesterday at 4:30 PM",
  },
];

const deadlines = [
  {
    id: 1,
    title: "Database Migration",
    detail: "Overdue: Oct 24, 2023",
    icon: "event_busy",
    overdue: true,
  },
  {
    id: 2,
    title: "API Security Audit",
    detail: "Due: Nov 15, 2024",
    icon: "calendar_month",
    overdue: false,
  },
  {
    id: 3,
    title: "Client Demo Beta",
    detail: "Due: Dec 01, 2024",
    icon: "calendar_month",
    overdue: false,
  },
];

// =========================================================
// ProjectWorkspaceManager
// =========================================================
export default function ProjectWorkspaceManager() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const healthCircleCircumference = 364.4;
  const healthStrokeDashoffset =
    healthCircleCircumference -
    (healthCircleCircumference * health.overallPercent) / 100;

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-slate-50 border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-semibold leading-8 tracking-tight font-bold text-blue-600">
              ForgeFlow
            </span>
            <div
              className={`hidden md:flex items-center bg-slate-100 border rounded-lg px-3 py-1.5 w-64 ${
                isSearchFocused
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : "border-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-slate-500 text-[20px] mr-2">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-[13px] leading-[18px] w-full"
                placeholder="Search projects..."
                type="text"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white text-xs leading-4 font-semibold tracking-wider px-4 py-2 rounded-lg hover:brightness-110 transition-all scale-95 duration-100 ease-in-out active:scale-90">
              Create Issue
            </button>
            <button className="text-slate-500 hover:bg-slate-200 transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-slate-500 hover:bg-slate-200 transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Current user avatar"
                src={project.currentUserAvatar}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-72px)] py-8 w-64 sticky top-[72px] border-r border-slate-200 bg-slate-100">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined">
                  {project.icon}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-[26px] font-extrabold text-slate-900">
                  {project.name}
                </h2>
                <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                  {project.code}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <a
              className="flex items-center gap-3 bg-slate-200 text-slate-600 border-l-4 border-blue-600 rounded-r-lg px-4 py-3 text-xs leading-4 font-semibold tracking-wider transition-all translate-x-1"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dashboard
              </span>
              <span>Overview</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">list_alt</span>
              <span>Issues</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">view_kanban</span>
              <span>Board</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">event_note</span>
              <span>Timeline</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">history</span>
              <span>Activity</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">folder_open</span>
              <span>Files</span>
            </a>
            <a
              className="flex items-center gap-3 text-slate-500 px-4 py-3 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">insert_chart</span>
              <span>Analytics</span>
            </a>
          </nav>
          <div className="px-4 mt-auto">
            <button className="w-full bg-slate-50 border border-slate-200 text-blue-600 text-xs leading-4 font-semibold tracking-wider py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              Create Issue
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Page Header Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                  {project.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                  {project.priority}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {project.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs leading-4 font-semibold tracking-wider text-blue-600">
                  {project.progress}% Completed
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  person_add
                </span>
                Invite Member
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 text-xs leading-4 font-semibold tracking-wider hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  settings
                </span>
                Project Settings
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Total Issues
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statistics.totalIssues}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Backlog
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statistics.backlog}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                To Do
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statistics.todo}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                In Progress
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statistics.inProgress}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Completed
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statistics.completed}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-red-700 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Overdue
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-red-700">
                {statistics.overdue}
              </h3>
            </div>
          </div>

          {/* Main Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (70%) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview Card */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold leading-[26px] text-slate-900">
                    Project Overview
                  </h3>
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-blue-600">
                    edit
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-5 text-slate-500 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">
                          calendar_today
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                          Timeline
                        </p>
                        <p className="text-[13px] leading-[18px] font-bold">
                          {project.timeline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">
                          visibility_off
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                          Visibility
                        </p>
                        <p className="text-[13px] leading-[18px] font-bold">
                          {project.visibility}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">
                          domain
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                          Department
                        </p>
                        <p className="text-[13px] leading-[18px] font-bold">
                          {project.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Issues Table */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold leading-[26px] text-slate-900">
                    Recent Issues
                  </h3>
                  <button className="text-blue-600 text-xs leading-4 font-semibold tracking-wider hover:underline flex items-center gap-1">
                    View All
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-[11px] leading-[14px] font-medium text-slate-500 uppercase tracking-wider">
                          Assignee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {issues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-[13px] leading-[18px] font-bold text-blue-600">
                            {issue.id}
                          </td>
                          <td className="px-6 py-4 text-[13px] leading-[18px] font-medium">
                            {issue.title}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`flex items-center gap-1.5 text-[12px] font-bold ${issue.typeClass}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {issue.typeIcon}
                              </span>{" "}
                              {issue.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${issue.priorityClass}`}
                            >
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${issue.statusClass}`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-white">
                              <img
                                className="w-full h-full rounded-full object-cover"
                                alt={`${issue.id} assignee avatar`}
                                src={issue.assigneeAvatar}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Activity Timeline */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold leading-[26px] text-slate-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-6 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full ${activity.iconBg} text-white flex items-center justify-center border-4 border-white shadow-sm`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {activity.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] leading-[18px] text-slate-900">
                          <span className="font-bold">
                            {activity.actorName}
                          </span>{" "}
                          {activity.actionText}{" "}
                          <span className="text-blue-600 font-bold">
                            {activity.targetText}
                          </span>
                        </p>
                        <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (30%) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions Card */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xs leading-4 font-semibold tracking-wider text-slate-500 uppercase mb-4 tracking-widest">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all group border border-slate-200">
                    <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                      add_box
                    </span>
                    <span className="text-[11px] leading-[14px] font-bold">
                      New Issue
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all group border border-slate-200">
                    <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                      group_add
                    </span>
                    <span className="text-[11px] leading-[14px] font-bold">
                      Invite
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all group border border-slate-200">
                    <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                      assignment_ind
                    </span>
                    <span className="text-[11px] leading-[14px] font-bold">
                      Assign
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all group border border-slate-200">
                    <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                      upload_file
                    </span>
                    <span className="text-[11px] leading-[14px] font-bold">
                      Upload
                    </span>
                  </button>
                </div>
              </section>

              {/* Project Health Card */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold leading-[26px] text-slate-900 mb-6">
                  Project Health
                </h3>
                <div className="flex items-center justify-center mb-6 relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      className="text-slate-200"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                    ></circle>
                    <circle
                      className="text-blue-600 transition-all duration-1000 ease-out"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r="58"
                      stroke="currentColor"
                      strokeDasharray={healthCircleCircumference}
                      strokeDashoffset={healthStrokeDashoffset}
                      strokeWidth="8"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-semibold leading-8 tracking-tight font-bold text-slate-900">
                      {health.overallPercent}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      Overall
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Risk Level
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-green-600">
                      {health.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Overdue Tasks
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-red-700">
                      {health.overdueTasks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Blocked Issues
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-amber-600">
                      {health.blockedIssues}
                    </span>
                  </div>
                </div>
              </section>

              {/* Team Card */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold leading-[26px] text-slate-900">
                    Team
                  </h3>
                  <span className="text-[11px] leading-[14px] font-bold text-blue-600 cursor-pointer hover:underline">
                    Manage
                  </span>
                </div>
                <div className="space-y-4">
                  {team.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-200">
                            <img
                              className="w-full h-full rounded-full object-cover"
                              alt={`${member.name} avatar`}
                              src={member.avatar}
                            />
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                              member.online ? "bg-green-500" : "bg-slate-300"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <p className="text-[13px] leading-[18px] font-bold">
                            {member.name}
                          </p>
                          <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-500 text-[18px] cursor-pointer">
                        more_vert
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming Deadlines Card */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold leading-[26px] text-slate-900 mb-6">
                  Upcoming Deadlines
                </h3>
                <div className="space-y-4">
                  {deadlines.map((deadline) =>
                    deadline.overdue ? (
                      <div
                        key={deadline.id}
                        className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                      >
                        <div className="mt-0.5 text-red-700">
                          <span className="material-symbols-outlined text-[18px]">
                            {deadline.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] leading-[18px] font-bold text-red-700">
                            {deadline.title}
                          </p>
                          <p className="text-[11px] leading-[14px] font-medium text-red-700">
                            {deadline.detail}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={deadline.id}
                        className="flex items-start gap-3 p-3 bg-slate-100 rounded-lg border border-slate-200"
                      >
                        <div className="mt-0.5 text-blue-600">
                          <span className="material-symbols-outlined text-[18px]">
                            {deadline.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] leading-[18px] font-bold">
                            {deadline.title}
                          </p>
                          <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                            {deadline.detail}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-50">
        <a className="flex flex-col items-center text-blue-600" href="#">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dashboard
          </span>
          <span className="text-[10px] font-bold">Overview</span>
        </a>
        <a className="flex flex-col items-center text-slate-500" href="#">
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] font-bold">Issues</span>
        </a>
        <a className="flex flex-col items-center text-slate-500" href="#">
          <span className="material-symbols-outlined">view_kanban</span>
          <span className="text-[10px] font-bold">Board</span>
        </a>
        <a className="flex flex-col items-center text-slate-500" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Team</span>
        </a>
      </nav>
    </div>
  );
}