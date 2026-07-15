import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getMyProjects } from "../services/projects.service";
import Navbar from "../components/dashboard/Navbar";
import {getMyActivity} from "../services/activity.service";
import {getDashboardStats,} from "../services/issues.service";

const currentUser = {
  name: "Shakthi Admin",
  role: "Enterprise Manager",
  firstName: "Shakthi",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1BP_ylgHo2WeRTtDETP14kuzU7lobf1PLmTr31DrWyIH_epi5XDhCW7haSmtaGyczd9al438ysiqvg68uBKpEwfoBHEYnPg-qc7-tX1KLJp5VsyVVa_f9zH-UpasXeZL9FBYm2QfFimfbRNmg6qe1RIy9XQOI5X3w19k2WevTuVuNethUkoM1tX7DwWvbm_PiEM2EoDzz_n4MkllmDMI2k0lICwLxiKo_DbAit3uS4xz2ufL49rAe-rNvttlcaDQusdmJu299FvcV",
};

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
  const [projects, setProjects] =React.useState([]);
  const [activities, setActivities] =React.useState([]);
  const [dashboardStats, setDashboardStats] = React.useState({

  assignedToMe: 0,

  completedIssues: 0,

  pendingIssues: 0,

  overdueIssues: 0,

});
  const navigate = useNavigate();
/**
 * Handles opening a project and redirects user to appropriate workspace
 * based on their permission role
 * @param {Object} project - The project object containing permission information
 */
  const handleOpenProject = (project) => {

  // Check if user has manager role for the project
  if (project.permission_role === "manager") {

    navigate("/manager-workspace");

  } else {

    navigate("/member-workspace");

  }

};
const loadProjects = async () => {

  try {

    const data =
      await getMyProjects();

    setProjects(data);

    console.log(data);

  } catch (error) {

    console.error(
      "Failed to load projects",
      error
    );
  }
};
const loadRecentActivity =
    async () => {

    try {

        const data =
            await getMyActivity();

        setActivities(data);

    } catch (error) {

        console.error(
            "Failed to load activity",
            error
        );

    }

};
const loadDashboardStats = async () => {

  try {

    const data =
      await getDashboardStats();

    setDashboardStats(data);

  } catch (error) {

    console.error(
      "Failed to load dashboard stats",
      error
    );

  }

};
useEffect(() => {
  loadProjects();
  loadRecentActivity();
  loadDashboardStats();
}, []);

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
            <span className="text-sm leading-5">HR</span>
          </a>
          {/* Support */}
          <a
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-150"
            href="#"
          >
            <span className="material-symbols-outlined">support_agent</span>
            <span className="text-sm leading-5">Report</span>
          </a>
        </nav>
      </aside>

      {/* Top AppBar Shell */}
      <Navbar />
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
                {dashboardStats.assignedToMe}
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
                {dashboardStats.completedIssues}
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
                {dashboardStats.pendingIssues}
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
                {dashboardStats.overdueIssues}
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
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  {projects.map((project) => (

    <article
      key={project.id}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow"
    >

      <div className="flex justify-between items-start mb-4">

        <div className="p-3 bg-blue-600/10 rounded-xl">

          <span
            className="material-symbols-outlined text-blue-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            folder
          </span>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] leading-[14px] font-medium uppercase ${
            project.permission_role === "manager"
              ? "bg-blue-600/10 text-blue-600"
              : "bg-slate-200/40 text-slate-600"
          }`}
        >
          {project.permission_role}
        </span>

      </div>

      <h4 className="text-lg font-semibold leading-[26px] text-slate-900 mb-1">
        {project.project_name}
      </h4>

      <p className="text-[13px] leading-[18px] text-slate-500 mb-6">
        {project.description}
      </p>

      <div className="mb-6">

        <div className="flex justify-between items-center mb-2">

          <span className="text-[11px] font-medium text-slate-500">
            Project Progress
          </span>

          <span className="text-[11px] font-bold text-slate-900">
            {project.progress}%
          </span>

        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-blue-600 rounded-full"
            style={{
              width: `${project.progress}%`,
            }}
          />

        </div>

      </div>

      <div className="flex items-center gap-6 mb-8">

        <div className="flex items-center gap-2">

          <span className="material-symbols-outlined text-slate-500 text-[20px]">
            assignment
          </span>

          <span className="text-[13px] text-slate-500">

            <strong className="text-slate-900">

              {project.issueCount}

            </strong>{" "}

            Issues

          </span>

        </div>

        <div className="flex items-center gap-2">

          <span className="material-symbols-outlined text-slate-500 text-[20px]">
            group
          </span>

          <span className="text-[13px] text-slate-500">

            <strong className="text-slate-900">

              {project.memberCount}

            </strong>{" "}

            Members

          </span>

        </div>

      </div>

      <div className="mt-auto space-y-2">

        <button
          onClick={() =>
            handleOpenProject(project)
          }
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs font-semibold tracking-wider hover:bg-blue-500 transition-colors"
        >
          Open Project
        </button>
        {project.permission_role === "manager" ? (

          <div className="grid grid-cols-2 gap-2">

            <button className="bg-slate-100 text-slate-600 py-2.5 rounded-lg text-xs font-semibold">
              Create Issue
            </button>

            <button className="bg-slate-100 text-slate-600 py-2.5 rounded-lg text-xs font-semibold">
              Manage Team
            </button>
          </div>
        ) : (
          <button className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-lg text-xs font-semibold">
            View My Tasks
          </button>
        )}
      </div>
    </article>
  ))}
</section>
        {/* Secondary Insights / Activity (Bento Grid Expansion) */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-semibold leading-[26px] mb-6">
              Recent Activity
            </h4>

            <div className="space-y-6">

  {activities.length === 0 ? (

    <p className="text-sm text-slate-500">
      No recent activity found.
    </p>

  ) : (

    activities.map((activity) => (

      <div
        key={activity.id}
        className="flex gap-4"
      >

        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

          {activity.performed_by_name
            ? activity.performed_by_name.charAt(0).toUpperCase()
            : "?"}

        </div>

        <div className="flex-1">

          <p className="text-sm text-slate-900">

            <span className="font-bold">

              {activity.performed_by_name || "Unknown User"}

            </span>{" "}

            <span className="text-slate-600">

              {activity.message}

            </span>

          </p>

          <p className="text-xs text-slate-500 mt-1">

            Project :

            <span className="font-medium text-blue-600">

              {" "}
              {activity.project_name}

            </span>

          </p>

          <p className="text-[11px] text-slate-400 mt-1">

            {new Date(
              activity.created_at
            ).toLocaleString()}

          </p>

        </div>

      </div>

    ))
  )}
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

  
    </div>
  );
}