import React, {
  useState,
  useEffect,
} from "react";

import { useParams } from "react-router-dom";

import api from "../api/axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

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
// =========================================================
// ProjectWorkspaceManager
// =========================================================
export default function ProjectWorkspaceManager() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { projectId } = useParams();
  console.log(projectId);

const [projectData, setProjectData] =useState(null);
const [statisticsData, setStatisticsData] =useState(null);
const [healthData, setHealthData] =useState(null);
const [recentIssues, setRecentIssues] =useState([]);
const [teamMembers, setTeamMembers] =useState([]);
const [upcomingDeadlines, setUpcomingDeadlines] =useState([]);
const [activities, setActivities] =useState([]);
const [loading, setLoading] =useState(true);
  async function loadProject() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}`
      );

    setProjectData(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
async function loadStatistics() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/statistics`
      );

    setStatisticsData(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
async function loadHealth() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/health`
      );

    setHealthData(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
async function loadRecentIssues() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/recent-issues`
      );

    setRecentIssues(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
async function loadTeamMembers() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/members`
      );

    setTeamMembers(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }
}
async function loadUpcomingDeadlines() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/upcoming-deadlines`
      );

    setUpcomingDeadlines(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
async function loadActivity() {

  try {

    const response =
      await api.get(
        `/projects/${projectId}/activity`
      );

    setActivities(
      response.data.data
    );

  } catch (error) {

    console.error(error);

  }

}
useEffect(() => {
  async function initialize() {

    setLoading(true);

    await Promise.all([
      loadProject(),
      loadStatistics(),
      loadHealth(),
      loadRecentIssues(),
      loadTeamMembers(),
      loadUpcomingDeadlines(),
      loadActivity(),
    ]);
    setLoading(false);
  }
  initialize();
}, [projectId]);
const projectHealthChart = [
  {
    name: "Completed",
    value: healthData?.completionPercentage ?? 0,
  },

  {
    name: "Remaining",
    value:
      100 -
      (healthData?.completionPercentage ?? 0),
  },

];

const HEALTH_COLORS = [

  "#2563EB",

  "#E2E8F0",

];
function getIssueTypeIcon(type) {

  switch (type?.toLowerCase()) {

    case "bug":
      return "bug_report";

    case "epic":
      return "target";

    case "story":
      return "menu_book";

    case "improvement":
      return "trending_up";

    default:
      return "task";
  }

}

function getIssueTypeClass(type) {

  switch (type?.toLowerCase()) {

    case "bug":
      return "text-red-600";

    case "epic":
      return "text-violet-600";

    case "story":
      return "text-green-600";

    case "improvement":
      return "text-amber-600";

    default:
      return "text-blue-600";
  }

}

function getPriorityClass(priority) {

  switch (priority?.toLowerCase()) {

    case "critical":
      return "bg-red-100 text-red-700";

    case "high":
      return "bg-orange-100 text-orange-700";

    case "medium":
      return "bg-yellow-100 text-yellow-700";

    case "low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-600";
  }

}

function getStatusClass(status) {

  switch (status?.toLowerCase()) {

    case "done":
      return "bg-green-100 text-green-700";

    case "in_progress":
      return "bg-blue-100 text-blue-700";

    case "todo":
      return "bg-amber-100 text-amber-700";

    case "backlog":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-600";
  }

}

function formatLabel(value) {

  if (!value) return "--";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());

}
function getActivityIcon(action) {

  switch (action) {

    case "issue_created":
      return "add_circle";

    case "issue_updated":
      return "edit";

    case "issue_status_changed":
      return "swap_horiz";

    case "issue_completed":
      return "check_circle";

    case "issue_reordered":
      return "drag_indicator";

    default:
      return "history";

  }

}
function getActivityColor(action) {

  switch (action) {

    case "issue_created":
      return "bg-blue-600";

    case "issue_updated":
      return "bg-indigo-600";

    case "issue_status_changed":
      return "bg-green-600";

    case "issue_completed":
      return "bg-emerald-600";

    case "issue_reordered":
      return "bg-violet-600";

    default:
      return "bg-slate-500";

  }

}
  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex">
        {/* Sidebar Navigation */}
<Sidebar
    role="manager"
    projectId={projectId}
/>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          {/* Page Header Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                  {projectData?.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                  {projectData?.priority}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-[38px] tracking-tight text-slate-900">
                {projectData?.project_name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{width: `${projectData?.progress ?? 0}%`,}}
                  ></div>
                </div>
                <span className="text-xs leading-4 font-semibold tracking-wider text-blue-600">
                  {projectData?.progress ?? 0}% Completed
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
                {statisticsData?.totalIssues ?? 0}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Backlog
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statisticsData?.backlog ?? 0}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                To Do
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statisticsData?.todo ?? 0}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                In Progress
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statisticsData?.inProgress ?? 0}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-600 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Completed
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {statisticsData?.done ?? 0}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-red-700 transition-colors group cursor-default">
              <p className="text-[11px] leading-[14px] font-medium text-slate-500 mb-1">
                Overdue
              </p>
              <h3 className="text-2xl font-semibold leading-8 tracking-tight text-red-700">
                {statisticsData?.overdue ?? 0}
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
                    {projectData?.description || "No description available."}
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
                        <p className="font-semibold">

  {projectData?.start_date
    ? new Date(projectData.start_date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "--"}

  {" - "}

  {projectData?.end_date
    ? new Date(projectData.end_date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "--"}

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
                      
                          <p className="font-semibold">
                            {projectData?.visibility || "--"}
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
                        <p className="font-semibold">
                          {projectData?.department || "--"}
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
                      {recentIssues.map((issue) => (
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
                              className={`flex items-center gap-1.5 text-[12px] font-bold ${getIssueTypeClass(issue.issue_type)}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {getIssueTypeIcon(issue.issue_type)}
                              </span>{" "}
                              {formatLabel(issue.issue_type)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityClass(issue.priority)}`}
                            >
                              {formatLabel(issue.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusClass(issue.status)}`}
                            >
                              {formatLabel(issue.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">

  {issue.assignee
    ? issue.assignee.charAt(0).toUpperCase()
    : "U"}

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
                  {activities.map((activity) => {
  const icon = getActivityIcon(activity.action);
  const iconBg = getActivityColor(activity.action);

  return (
    <div
      key={activity.id}
      className="flex gap-4 relative z-10"
    >
      <div
        className={`w-10 h-10 rounded-full ${iconBg} text-white flex items-center justify-center border-4 border-white shadow-sm`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {icon}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-[13px] leading-[18px] text-slate-900">
          <span className="font-bold">
            {activity.user_name}
          </span>
        </p>

        <p className="text-[13px] leading-[18px] text-slate-600">
          {activity.message}
        </p>

        <p className="text-[13px] font-semibold text-blue-600">
          {activity.issue_key} • {activity.title}
        </p>

        <p className="text-[11px] leading-[14px] font-medium text-slate-500">
          {new Date(activity.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
})}
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
                  <div className="relative w-full h-64">

  <ResponsiveContainer>

    <PieChart>

      <Pie

        data={projectHealthChart}

        dataKey="value"

        innerRadius={70}

        outerRadius={90}
        startAngle={90}
        endAngle={-270}
        stroke="none"
      >
        {projectHealthChart.map(

          (
            entry,
            index
          ) => (

            <Cell

              key={index}

              fill={
                HEALTH_COLORS[index]
              }

            />

          )

        )}

      </Pie>

    </PieChart>

  </ResponsiveContainer>

  <div className="absolute inset-0 flex flex-col items-center justify-center">

    <h2 className="text-4xl font-bold text-slate-900">

      {healthData?.completionPercentage ?? 0}%

    </h2>

    <p className="text-sm text-slate-500 tracking-wide">

      OVERALL

    </p>

  </div>

</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Risk Level
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-green-600">
                      {"--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Overdue Tasks
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-red-700">
                      {statisticsData?.overdue ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] leading-[18px] text-slate-500">
                      Blocked Issues
                    </span>
                    <span className="text-[13px] leading-[18px] font-bold text-amber-600">
                      {"--"}
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

    {teamMembers.length === 0 ? (

      <div className="py-10 text-center text-slate-500">
        No team members assigned yet.
      </div>

    ) : (

      teamMembers.map((member) => (

        <div
          key={member.id}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {member.name
                  ? member.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-slate-300"></div>

            </div>

            <div>

              <p className="text-[13px] leading-[18px] font-bold">
                {member.name}
              </p>

              <p className="text-[11px] leading-[14px] font-medium text-slate-500">
                {formatLabel(member.permission_role ?? member.role)}

                {member.department && (
                  <> • {member.department}</>
                )}
              </p>

            </div>

          </div>
          <span className="material-symbols-outlined text-slate-500 text-[18px] cursor-pointer">
            more_vert
          </span>
        </div>
      ))
    )}
  </div>
</section>

             {/* Upcoming Deadlines Card */}
<section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  <h3 className="text-lg font-semibold leading-[26px] text-slate-900 mb-6">
    Upcoming Deadlines
  </h3>

  <div className="space-y-4">

    {upcomingDeadlines.map((deadline) => {

      const overdue =
        new Date(deadline.due_date) < new Date();

      return overdue ? (

        <div
          key={deadline.id}
          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
        >
          <div className="mt-0.5 text-red-700">
            <span className="material-symbols-outlined text-[18px]">
              event_busy
            </span>
          </div>

          <div>
            <p className="text-[13px] leading-[18px] font-bold text-red-700">
              {deadline.title}
            </p>

            <p className="text-[11px] leading-[14px] font-medium text-red-700">
              Due:{" "}
              {new Date(deadline.due_date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
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
              calendar_month
            </span>
          </div>

          <div>
            <p className="text-[13px] leading-[18px] font-bold">
              {deadline.title}
            </p>

            <p className="text-[11px] leading-[14px] font-medium text-slate-500">
              Due:{" "}
              {new Date(deadline.due_date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        </div>

      );

    })}

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