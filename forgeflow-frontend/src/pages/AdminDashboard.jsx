
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path to your AuthContext
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import { getDashboardStats } from "../services/dashboard.service";
import { getProjects } from "../services/projects.service";
import { createProject } from "../services/projects.service";
import { createIssue } from "../services/issues.service";
import { getUsers } from "../services/users.service";
import {getRecentActivity} from "../services/activity.service";
import {getIssuesByStatus,getIssuesByPriority,} from "../services/dashboard.service";
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

const QUICK_ACTIONS = [
  {
    icon: "add_box",
    label: "Create Proj",
    action: "createProject",
  },

  {
    icon: "bug_report",
    label: "New Issue",
    action: "createIssue",
  },

  {
    icon: "person_add",
    label: "Invite User",
    action: "inviteUser",
  },

  {
    icon: "assignment_ind",
    label: "Assign Task",
    action: "assignTask",
  },
];
// ─── Sub-components ─────────────────────────────────────────────────────

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
          {(avatars || []).map((src, i) => (
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

  // ── API-ready state (populate via useEffect once backend exists) ──────────
  const [stats, setStats]         = useState(STATS_DATA);
  const [projects, setProjects]   = useState(PROJECTS_DATA);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [aiPrompt, setAiPrompt]   = useState("");
  const [showCreateProjectModal, setShowCreateProjectModal] =useState(false);
  const [projectName, setProjectName] =useState("");
  const [showCreateIssueModal,setShowCreateIssueModal,] = useState(false);
  const [issueTitle,setIssueTitle,] = useState("");
  const [selectedProject,setSelectedProject,] = useState("");
  const [issuePriority,setIssuePriority,] = useState("medium");
  const [users, setUsers] =useState([]);
  const [assignedUser, setAssignedUser] =useState("");
  const [dueDate, setDueDate] =useState("");
  const [activities,setActivities] = useState([]);
  const [statusData, setStatusData] =useState([]);
  const [priorityData, setPriorityData] =useState([]);
  const fetchProjects = async () => {
  try {
  const response = await getProjects();

  const projectsData = response.data;

  setProjects(
    projectsData.map((project) => ({
      id: project.id,

      title: project.name,

      status: "Active",

      statusBg: "bg-[#3e52d5]",

      statusText: "text-[#d7daff]",

      description: "Project managed in ForgeFlow",

      avatars: [],

      progress: project.progress,

      progressColor:
  project.progress < 40
    ? "bg-red-500"
    : project.progress <= 70
    ? "bg-blue-600"
    : "bg-green-500",

      issueCount: project.issueCount,

      completedIssues: project.completedIssues,

      updatedAt: new Date(
        project.updated_at
      ).toLocaleDateString(),
    }))
  );
} catch (error) {
  console.error("Projects Error:", error);
}
  };
const fetchUsers = async () => {
  try {
    const response =
      await getUsers();

    setUsers(response.data);

  } catch (error) {
    console.error(
      "Users Error:",
      error
    );
  }
};
const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();

      const data = response.data;

      setStats([
        {
          id: "total-projects",
          icon: "folder",
          iconColor: "text-[#2036bd]",
          iconBg: "bg-[#dfe0ff]",
          label: "Total Projects",
          value: data.totalProjects,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },

        {
          id: "total-issues",
          icon: "bug_report",
          iconColor: "text-[#505f76]",
          iconBg: "bg-[#d0e1fb]",
          label: "Total Issues",
          value: data.totalIssues,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },

        {
          id: "open-issues",
          icon: "emergency",
          iconColor: "text-[#ba1a1a]",
          iconBg: "bg-[#ffdad6]",
          label: "Open Issues",
          value: data.openIssues,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },

        {
          id: "closed-issues",
          icon: "check_circle",
          iconColor: "text-[#7e3100]",
          iconBg: "bg-[#ffdbcc]",
          label: "Closed Issues",
          value: data.closedIssues,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },

        {
          id: "high-priority",
          icon: "priority_high",
          iconColor: "text-[#7a2f00]",
          iconBg: "bg-[#ffb694]",
          label: "High Priority",
          value: data.highPriorityIssues,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },

        {
          id: "active-users",
          icon: "person",
          iconColor: "text-[#1d34ba]",
          iconBg: "bg-[#dfe0ff]",
          label: "Active Users",
          value: data.activeUsers,
          trend: "",
          trendIcon: null,
          trendColor: "",
        },
      ]);
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };
  const fetchActivities = async () => {
  try {

    const response =
      await getRecentActivity();

    const activityData =
      response.data;

    const formatted =
      activityData.map(
        (activity) => {

          let icon =
            "info";

          let iconBg =
            "bg-[#d0e1fb]";

          let iconColor =
            "text-[#54647a]";

          switch (
            activity.action
          ) {

            case "project_created":
              icon =
                "folder";
              iconBg =
                "bg-[#dfe0ff]";
              iconColor =
                "text-[#2036bd]";
              break;

            case "issue_created":
              icon =
                "bug_report";
              iconBg =
                "bg-[#ffdad6]";
              iconColor =
                "text-[#ba1a1a]";
              break;

            case "issue_updated":
              icon =
                "edit";
              iconBg =
                "bg-[#ffdbcc]";
              iconColor =
                "text-[#7a2f00]";
              break;

            case "issue_assigned":
              icon =
                "assignment_ind";
              iconBg =
                "bg-[#d0e1fb]";
              iconColor =
                "text-[#54647a]";
              break;

            default:
              break;
          }

          return {
            id: activity.id,

            icon,
            iconBg,
            iconColor,

            content:
              activity.message,

            time:
              new Date(
                activity.createdAt
              ).toLocaleString(),
          };
        }
      );

    setActivities(
      formatted
    );

  } catch (error) {

    console.error(
      "Activity Error:",
      error
    );

  }
};
const fetchIssuesByStatus =
  async () => {

    try {

      const response =
        await getIssuesByStatus();

      setStatusData(
        response.data
      );

    } catch (error) {

      console.error(
        "Status Error:",
        error
      );

    }
};
const fetchIssuesByPriority =
  async () => {

    try {

      const response =
        await getIssuesByPriority();

      setPriorityData(
        response.data
      );

    } catch (error) {

      console.error(
        "Priority Error:",
        error
      );

    }
};

useEffect(() => { 
  fetchDashboardStats();
  fetchProjects();
  fetchUsers();
  fetchActivities();
  fetchIssuesByStatus();
  fetchIssuesByPriority();
}, []);

const handleCreateProject = async () => {
  try {
    await createProject({
      name: projectName,
    });

    await fetchProjects();
    await fetchDashboardStats();

    setProjectName("");

    setShowCreateProjectModal(false);
  } catch (error) {
    console.error("Create Project Error:", error);
  }
};
const handleCreateIssue =
  async () => {
    try {

      await createIssue({
        title: issueTitle,
        projectId: selectedProject,
        priority: issuePriority,
        assignedTo:assignedUser || undefined,
        dueDate:dueDate || undefined,
      });
      await fetchDashboardStats();
      await fetchProjects();
      await fetchActivities();
      await fetchIssuesByStatus();
      await fetchIssuesByPriority();
      setIssueTitle("");
      setSelectedProject("");
      setIssuePriority("medium");

      setShowCreateIssueModal(false);

    } catch (error) {
      console.error(
        "Create Issue Error:",
        error
      );
    }
  };

const handleQuickAction = (action) => {
  switch (action) {
    case "createProject":
      setShowCreateProjectModal(true);
      break;

    case "createIssue":
      setShowCreateIssueModal(true);
      break;

    case "inviteUser":
      console.log("Invite User");
      break;

    case "assignTask":
      console.log("Assign Task");
      break;

    default:
      break;
  }
};
const statusBars = [
  {
    label: "todo",
    count:
      statusData.find(
        s => s.status === "todo"
      )?.count || 0,
  },
  {
    label: "in_progress",
    count:
      statusData.find(
        s => s.status === "in_progress"
      )?.count || 0,
  },
  {
    label: "done",
    count:
      statusData.find(
        s => s.status === "done"
      )?.count || 0,
  },
];  
const priorityBars = [
  {
    label: "critical",
    count:
      priorityData.find(
        p => p.priority === "critical"
      )?.count || 0,
  },
  {
    label: "high",
    count:
      priorityData.find(
        p => p.priority === "high"
      )?.count || 0,
  },
  {
    label: "medium",
    count:
      priorityData.find(
        p => p.priority === "medium"
      )?.count || 0,
  },
  {
    label: "low",
    count:
      priorityData.find(
        p => p.priority === "low"
      )?.count || 0,
  },
];
  const maxStatusCount = Math.max(
  ...statusData.map(item => item.count),
  1
);

const maxPriorityCount = Math.max(
  ...priorityData.map(item => item.count),
  1
);
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-['Inter',sans-serif] min-h-screen">

      {/* ── Sidebar ── */}
      <Sidebar />
      {/* ── Top Navbar ── */}
      <Navbar />
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

  <div className="h-56 flex items-end justify-between gap-6 px-4">

  {statusBars.map(({ label, count }) => (

    <div
      key={label}
      className="flex flex-col items-center flex-1 h-full"
    >

      {/* Count */}
      <span className="text-sm font-semibold text-[#454654] mb-2">
        {count}
      </span>

      {/* Bar Container */}
      <div className="flex items-end h-full w-full">

        <div
          className={`w-full rounded-t-md transition-all duration-1000 ${
            label === "done"
              ? "bg-green-500"
              : label === "in_progress"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
          style={{
            height: `${
              count === 0
                ? 8
                : (count / maxStatusCount) * 100
            }%`,
          }}
        />

      </div>

      {/* Label */}
      <span className="mt-3 text-xs font-semibold uppercase text-[#454654]">
        {label.replace("_", " ")}
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

    {priorityBars.map(({ label, count }) => (

      <div
        key={label}
        className="flex flex-col gap-1"
      >

        <div className="flex justify-between text-[11px] leading-[14px] tracking-tight font-semibold uppercase">

          <span className="font-bold">
            {label}
          </span>

          <span>
            {count}
          </span>

        </div>

        <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">

          <div
            className={`h-full ${
              label === "critical"
                ? "bg-[#ba1a1a]"
                : label === "high"
                ? "bg-[#7a2f00]"
                : label === "medium"
                ? "bg-[#54647a]"
                : "bg-[#757686]"
            }`}
            style={{
              width: `${(count / maxPriorityCount) * 100}%`
            }}
          />

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
                {QUICK_ACTIONS.map(({ icon, label, action }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickAction(action)}
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
                  {[].map((text) => (
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
      {
  showCreateProjectModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-semibold mb-4">
          Create Project
        </h2>

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={() =>
              setShowCreateProjectModal(false)
            }
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-[#2036bd] text-white rounded-lg"
          >
            Create
          </button>

        </div>

      </div>
    </div>
  )
}
{showCreateIssueModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[450px]">

      <h2 className="text-xl font-semibold mb-4">
        Create Issue
      </h2>

      <input
        type="text"
        placeholder="Issue Title"
        value={issueTitle}
        onChange={(e) =>
          setIssueTitle(
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-4"
      />

      <select
        value={selectedProject}
        onChange={(e) =>
          setSelectedProject(
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-4"
      >

        <option value="">
          Select Project
        </option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.id}
          >
            {project.title}
          </option>
        ))}

      </select>
      {/* Priority */}

<select
  value={issuePriority}
  onChange={(e) =>
    setIssuePriority(
      e.target.value
    )
  }
  className="w-full border p-2 rounded mb-4"
>
  <option value="low">
    Low Priority
  </option>

  <option value="medium">
    Medium Priority
  </option>

  <option value="high">
    High Priority
  </option>

  <option value="critical">
    Critical Priority
  </option>
</select>

{/* Due Date */}

<input
  type="date"
  value={dueDate}
  onChange={(e) =>
    setDueDate(
      e.target.value
    )
  }
  className="w-full border p-2 rounded mb-4"
/>

{/* Assign User */}

<select
  value={assignedUser}
  onChange={(e) =>
    setAssignedUser(
      e.target.value
    )
  }
  className="w-full border p-2 rounded mb-4"
>
  <option value="">
    Select User
  </option>

  {users.map((user) => (
    <option
      key={user.id}
      value={user.id}
    >
      {user.name}
    </option>
  ))}
</select>

      <div className="flex justify-end gap-2">

        <button
          onClick={() =>
            setShowCreateIssueModal(
              false
            )
          }
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={
            handleCreateIssue
          }
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}
