import React from "react";
import { useNavigate } from "react-router-dom";


const currentUser = {
  name: "Shakthi Admin",
  role: "Enterprise Manager",
  firstName: "Shakthi",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1BP_ylgHo2WeRTtDETP14kuzU7lobf1PLmTr31DrWyIH_epi5XDhCW7haSmtaGyczd9al438ysiqvg68uBKpEwfoBHEYnPg-qc7-tX1KLJp5VsyVVa_f9zH-UpasXeZL9FBYm2QfFimfbRNmg6qe1RIy9XQOI5X3w19k2WevTuVuNethUkoM1tX7DwWvbm_PiEM2EoDzz_n4MkllmDMI2k0lICwLxiKo_DbAit3uS4xz2ufL49rAe-rNvttlcaDQusdmJu299FvcV",
};

const dashboard = {
  assignedIssues: 24,
  completedIssues: 142,
  pendingIssues: 12,
  overdueIssues: 3,
};

const projects = [
  {
    id: 1,
    name: "Inkbot-rag",
    description:
      "Enterprise-grade retrieval augmented generation engine for internal knowledge bases.",
    icon: "rocket_launch",
    permission_role: "manager",
    progress: 68,
    issues: 45,
    members: 12,
  },
  {
    id: 2,
    name: "ForgeFlow Frontend",
    description:
      "Main web dashboard refactor using the new design system components.",
    icon: "web",
    permission_role: "member",
    progress: 85,
    issues: 124,
    members: 8,
  },
  {
    id: 3,
    name: "Mobile App Redesign",
    description:
      "Updating the iOS and Android applications to match current branding guidelines.",
    icon: "smartphone",
    permission_role: "member",
    progress: 40,
    issues: 56,
    members: 5,
  },
];


const activities = [
  {
    id: 1,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMBHW35O1RDcjmpAIO9kIyVyFyI2aEjStxpozwsoxUT1Yy-URCeV0c4vhAv4oojEc8uXEPxbckEQ2ccYFqHfFq7I6Hh4Wg9EPzxrIwuUmJ_80EZirQ_h8tic2J7DXNPcFK6GQnJKaesTBHMpz5DL3Xr2C7imA6tYMRMspO5oCjIuYL49dAkvPCKQnf70pL7PWwVXCWLMjO5TK6DmbLrJBSZ6usHxLc8Q1c0tI4iuE5QNOtFpJcAl0eXps0ppXSjzY91QMFFncx8lk3",
    actorName: "Elena Vance",
    actionText: "pushed 4 commits to",
    targetText: "ForgeFlow Frontend",
    timestamp: "20 minutes ago",
    quote: "Updated the navigation logic for responsive breakpoints.",
  },
  {
    id: 2,
    icon: "add_comment",
    actorName: "Marcus Thorne",
    actionText: "commented on issue",
    targetText: "#412",
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtS3BOrzcgfEJeYPmVXLvC9X1UEz-I_nDFwCSTCxa_91xq5h9jtwh-0uvFuYbMmMdIe8BnhsGtcXjvyVd-Xg9Nvmg5zw-ws7sjtCMrxjmMjiwPQ4XWLthYHWzov1qoWfle0zDqJDXDOZYRgy2UkxOycxIkamK9-eVn7BwqySpT5A95f-5xq7ryOP1_mqanxeUtQJ0yM-QxuaEr8aisKGwDA3ykQpSnRj06N2ba9TfTG1afnQUB3YW46qbwBj_-tfezsKaRLipvCEBD",
    actorName: "Julian Rossi",
    actionText: "completed task",
    targetText: "Mobile Brand Audit",
    timestamp: "3 hours ago",
  },
];

const taskDistribution = {
  total: 178,
  inProgressPercent: 75,
  inReviewPercent: 15,
  overduePercent: 10,
};

// =========================================================
// Dashboard
// =========================================================
export default function UserDashboard() {
  const navigate = useNavigate();
  const handleOpenProject = (project) => {

  if (project.permission_role === "manager") {

    navigate("/manager-workspace");

  } else {

    navigate("/member-workspace");

  }

};

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Side Navigation Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col h-full py-8 z-50">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight font-bold text-blue-600">
            ForgeFlow
          </h1>
          <p className="text-sm leading-5 text-slate-500">Enterprise Hub</p>
        </div>
        <nav className="flex-1 space-y-1">
          {/* Dashboard (Active) */}
          <a
            className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-slate-200/50 border-l-4 border-blue-600 transition-all active:scale-95 duration-150"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm leading-5">Dashboard</span>
          </a>
          {/* My Projects */}
          <a
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-150"
            href="#"
          >
            <span className="material-symbols-outlined">account_tree</span>
            <span className="text-sm leading-5">My Projects</span>
          </a>
          {/* My Tasks */}
          <a
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-150"
            href="#"
          >
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-sm leading-5">My Tasks</span>
          </a>
          {/* Support */}
          <a
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-150"
            href="#"
          >
            <span className="material-symbols-outlined">support_agent</span>
            <span className="text-sm leading-5">Support</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">
          <div className="p-4 bg-blue-600 rounded-xl text-white">
            <p className="text-xs leading-4 font-semibold tracking-wider mb-2">
              Upgrade Plan
            </p>
            <p className="text-[13px] leading-[18px] opacity-90">
              Get advanced analytics and reporting.
            </p>
            <button className="mt-3 w-full bg-white text-blue-600 text-xs leading-4 font-semibold tracking-wider py-2 rounded-lg hover:bg-white/90 transition-all">
              Explore Pro
            </button>
          </div>
        </div>
      </aside>

      {/* Top AppBar Shell */}
      <header className="fixed top-0 right-0 left-64 h-16 bg-slate-50 border-b border-slate-200 z-40">
        <div className="flex justify-between items-center px-6 h-full">
          {/* Search on Left */}
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm leading-5 focus:ring-2 focus:ring-blue-600/20"
              placeholder="Search projects, tasks, or members..."
              type="text"
            />
          </div>
          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            <button className="hover:bg-slate-100 rounded-full p-2 transition-all duration-200">
              <span className="material-symbols-outlined text-slate-500">
                notifications
              </span>
            </button>
            <button className="hover:bg-slate-100 rounded-full p-2 transition-all duration-200">
              <span className="material-symbols-outlined text-slate-500">
                help
              </span>
            </button>
            <button className="hover:bg-slate-100 rounded-full p-2 transition-all duration-200">
              <span className="material-symbols-outlined text-slate-500">
                settings
              </span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-xs leading-4 font-semibold tracking-wider text-slate-900 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                  {currentUser.role}
                </p>
              </div>
              <img
                className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
                alt="User avatar"
                src={currentUser.avatar}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 mt-16 p-8 max-w-[1440px] mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
            Good morning, {currentUser.firstName}
          </h2>
          <p className="text-base leading-6 text-slate-500">
            Here's what's happening across your projects today.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Assigned to Me */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
            <div>
              <p className="text-xs leading-4 font-semibold tracking-wider text-slate-500 uppercase mb-1">
                Assigned to Me
              </p>
              <h3 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {dashboard.assignedIssues}
              </h3>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-lg text-blue-600">
              <span className="material-symbols-outlined">person_check</span>
            </div>
          </div>
          {/* Completed Issues */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
            <div>
              <p className="text-xs leading-4 font-semibold tracking-wider text-slate-500 uppercase mb-1">
                Completed Issues
              </p>
              <h3 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {dashboard.completedIssues}
              </h3>
            </div>
            <div className="p-3 bg-slate-200/50 rounded-lg text-slate-500">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
          </div>
          {/* Pending Issues */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
            <div>
              <p className="text-xs leading-4 font-semibold tracking-wider text-slate-500 uppercase mb-1">
                Pending Issues
              </p>
              <h3 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {dashboard.pendingIssues}
              </h3>
            </div>
            <div className="p-3 bg-indigo-600/10 rounded-lg text-indigo-600">
              <span className="material-symbols-outlined">
                pending_actions
              </span>
            </div>
          </div>
          {/* Overdue Issues */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 h-1 w-full bg-red-700"></div>
            <div>
              <p className="text-xs leading-4 font-semibold tracking-wider text-red-700 uppercase mb-1">
                Overdue Issues
              </p>
              <h3 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {dashboard.overdueIssues}
              </h3>
            </div>
            <div className="p-3 bg-red-100/50 rounded-lg text-red-700">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
        </section>

        {/* Projects Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900">
            My Projects
          </h3>
          <div className="flex gap-2">
            <button className="bg-slate-100 px-4 py-2 rounded-lg text-xs leading-4 font-semibold tracking-wider text-slate-500 hover:bg-slate-200 transition-colors">
              Filter
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-blue-500 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              New Project
            </button>
          </div>
        </div>

        {/* Project Cards Grid (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project 1: Manager View */}
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-600/10 rounded-xl">
                <span
                  className="material-symbols-outlined text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {projects[0].icon}
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[11px] leading-[14px] font-medium uppercase">
                {projects[0].role}
              </span>
            </div>
            <h4 className="text-lg font-semibold leading-[26px] text-slate-900 mb-1">
              {projects[0].name}
            </h4>
            <p className="text-[13px] leading-[18px] text-slate-500 mb-6">
              {projects[0].description}
            </p>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] leading-[14px] font-medium text-slate-500">
                  Project Progress
                </span>
                <span className="text-[11px] leading-[14px] font-medium text-slate-900 font-bold">
                  {projects[0].progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${projects[0].progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  assignment
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[0].issues}
                  </strong>{" "}
                  Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  group
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[0].members}
                  </strong>{" "}
                  Members
                </span>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <button

  onClick={() =>
    handleOpenProject(
      projects[0]
    )
  }

  className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-blue-500 transition-colors"
>

  Open Project

</button>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-slate-100 text-slate-500 py-2.5 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-colors">
                  Create Issue
                </button>
                <button className="bg-slate-100 text-slate-500 py-2.5 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-colors">
                  Manage Team
                </button>
              </div>
            </div>
          </article>

          {/* Project 2: Member View */}
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-200/50 rounded-xl text-slate-600">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {projects[1].icon}
                </span>
              </div>
              <span className="px-3 py-1 bg-slate-200/30 text-slate-500 rounded-full text-[11px] leading-[14px] font-medium uppercase">
                {projects[1].role}
              </span>
            </div>
            <h4 className="text-lg font-semibold leading-[26px] text-slate-900 mb-1">
              {projects[1].name}
            </h4>
            <p className="text-[13px] leading-[18px] text-slate-500 mb-6">
              {projects[1].description}
            </p>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] leading-[14px] font-medium text-slate-500">
                  Project Progress
                </span>
                <span className="text-[11px] leading-[14px] font-medium text-slate-900 font-bold">
                  {projects[1].progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${projects[1].progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  assignment
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[1].issues}
                  </strong>{" "}
                  Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  group
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[1].members}
                  </strong>{" "}
                  Members
                </span>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <button

  onClick={() =>
    handleOpenProject(
      projects[1]
    )
  }

  className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-blue-500 transition-colors"
>

Open Project

</button>
              <button className="w-full bg-slate-100 text-slate-500 py-2.5 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-colors">
                View My Tasks
              </button>
            </div>
          </article>

          {/* Project 3: Member View Redesign */}
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-600">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {projects[2].icon}
                </span>
              </div>
              <span className="px-3 py-1 bg-slate-200/30 text-slate-500 rounded-full text-[11px] leading-[14px] font-medium uppercase">
                {projects[2].role}
              </span>
            </div>
            <h4 className="text-lg font-semibold leading-[26px] text-slate-900 mb-1">
              {projects[2].name}
            </h4>
            <p className="text-[13px] leading-[18px] text-slate-500 mb-6">
              {projects[2].description}
            </p>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] leading-[14px] font-medium text-slate-500">
                  Project Progress
                </span>
                <span className="text-[11px] leading-[14px] font-medium text-slate-900 font-bold">
                  {projects[2].progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${projects[2].progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  assignment
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[2].issues}
                  </strong>{" "}
                  Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  group
                </span>
                <span className="text-[13px] leading-[18px] text-slate-500">
                  <strong className="text-slate-900">
                    {projects[2].members}
                  </strong>{" "}
                  Members
                </span>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <button

  onClick={() =>
    handleOpenProject(
      projects[2]
    )
  }

  className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-blue-500 transition-colors"
>

Open Project

</button>
              <button className="w-full bg-slate-100 text-slate-500 py-2.5 rounded-lg text-xs leading-4 font-semibold tracking-wider hover:bg-slate-200 transition-colors">
                View My Tasks
              </button>
            </div>
          </article>
        </section>

        {/* Secondary Insights / Activity (Bento Grid Expansion) */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold leading-[26px] mb-6">
              Recent Activity
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <img
                  className="h-10 w-10 rounded-full object-cover mt-1"
                  alt="Elena Vance avatar"
                  src={activities[0].avatar}
                />
                <div>
                  <p className="text-sm leading-5 text-slate-900">
                    <span className="font-bold">
                      {activities[0].actorName}
                    </span>{" "}
                    {activities[0].actionText}{" "}
                    <span className="text-blue-600 font-medium">
                      {activities[0].targetText}
                    </span>
                  </p>
                  <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                    {activities[0].timestamp}
                  </p>
                  <div className="mt-2 p-3 bg-slate-100 rounded-lg border-l-4 border-blue-600/40 text-[13px] leading-[18px] italic text-slate-500">
                    "{activities[0].quote}"
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-blue-600 mt-1">
                  <span className="material-symbols-outlined">
                    {activities[1].icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm leading-5 text-slate-900">
                    <span className="font-bold">
                      {activities[1].actorName}
                    </span>{" "}
                    {activities[1].actionText}{" "}
                    <span className="text-blue-600 font-medium">
                      {activities[1].targetText}
                    </span>
                  </p>
                  <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                    {activities[1].timestamp}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <img
                  className="h-10 w-10 rounded-full object-cover mt-1"
                  alt="Julian Rossi avatar"
                  src={activities[2].avatar}
                />
                <div>
                  <p className="text-sm leading-5 text-slate-900">
                    <span className="font-bold">
                      {activities[2].actorName}
                    </span>{" "}
                    {activities[2].actionText}{" "}
                    <span className="text-blue-600 font-medium">
                      {activities[2].targetText}
                    </span>
                  </p>
                  <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                    {activities[2].timestamp}
                  </p>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-2 text-xs leading-4 font-semibold tracking-wider text-blue-600 border border-blue-600/20 rounded-lg hover:bg-blue-600/5 transition-all">
              View All Activity
            </button>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold leading-[26px] mb-6">
              Task Distribution
            </h4>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative h-48 w-48 mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    className="stroke-slate-200"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeWidth="3"
                  ></circle>
                  <circle
                    className="stroke-blue-600"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray={`${taskDistribution.inProgressPercent}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></circle>
                  <circle
                    className="stroke-indigo-600"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray={`${taskDistribution.inReviewPercent}, 100`}
                    strokeDashoffset={`-${taskDistribution.inProgressPercent}`}
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></circle>
                  <circle
                    className="stroke-red-700"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray={`${taskDistribution.overduePercent}, 100`}
                    strokeDashoffset={`-${
                      taskDistribution.inProgressPercent +
                      taskDistribution.inReviewPercent
                    }`}
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold leading-8 tracking-tight leading-none text-slate-900">
                    {taskDistribution.total}
                  </span>
                  <span className="text-[11px] leading-[14px] font-medium text-slate-500">
                    Total
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="text-[13px] leading-[18px]">
                      In Progress
                    </span>
                  </div>
                  <span className="text-xs leading-4 font-semibold tracking-wider">
                    {taskDistribution.inProgressPercent}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                    <span className="text-[13px] leading-[18px]">
                      In Review
                    </span>
                  </div>
                  <span className="text-xs leading-4 font-semibold tracking-wider">
                    {taskDistribution.inReviewPercent}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-700"></span>
                    <span className="text-[13px] leading-[18px]">
                      Overdue
                    </span>
                  </div>
                  <span className="text-xs leading-4 font-semibold tracking-wider">
                    {taskDistribution.overduePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button Contextual Logic */}
      <button className="fixed bottom-8 right-8 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
}