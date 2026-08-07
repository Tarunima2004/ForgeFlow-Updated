import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import {DragDropContext,Droppable,Draggable,} from "@hello-pangea/dnd";
import api from "../api/axios";
import IssueWorkspace from "../components/issues/IssueWorkspace";
import {getIssues, createIssue,getIssueKPIs,getProjectIssues,} from "../services/issues.service";
import { buildHierarchyTree } from "../utils/buildHierarchyTree";
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

export default function IssueContainer({scope = "admin",projectId = null,}) {
    console.log({
    scope,
    projectId,
});
    const isAdmin = scope === "admin";
    const isManager = scope === "manager";
    const isMember = scope === "member";
  const [view, setView] = useState("table");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("Everyone");
  const [filterProject, setFilterProject] = useState("All");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] =useState(false);
  const [projects, setProjects] =useState([]);
  const [users, setUsers] =useState([]);
  const [showEditModal, setShowEditModal] =useState(false);
  const [editingIssue, setEditingIssue] =useState(null);
  const [selectedProject,setSelectedProject] = useState(null);
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const [newIssue, setNewIssue] =
  useState({
    title: "",
    projectId: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });
  const toggleExpand = (issueId) => {
    setExpandedIssues((prev) => {
        const next = new Set(prev);

        if (next.has(issueId)) {
            next.delete(issueId);
        } else {
            next.add(issueId);
        }

        return next;
    });
};
const onExpandAll = () => {
    const ids = new Set();

    const collect = (issues) => {
        issues.forEach((issue) => {
            if (issue.hasChildren) {
                ids.add(issue.id);
            }

            if (issue.children?.length) {
                collect(issue.children);
            }
        });
    };

    collect(buildHierarchyTree(filteredIssues));

    setExpandedIssues(ids);
};
const onCollapseAll = () => {
    setExpandedIssues(new Set());
};
  const [issueKPIs, setIssueKPIs] =
  useState({
    totalIssues: 0,
    openIssues: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    overdue: 0,
  });
  const kpiCards = [
  { icon: "list_alt", iconClass: "text-blue-700 bg-blue-50", label: "Total Issues", value: issueKPIs.totalIssues, trend: "+12%", trendClass: "text-emerald-600" },
  { icon: "radio_button_checked", iconClass: "text-blue-600 bg-blue-50", label: "Open Issues", value:  issueKPIs.openIssues, trend: "+4%", trendClass: "text-red-600" },
  { icon: "pending", iconClass: "text-amber-600 bg-amber-50", label: "In Progress", value: issueKPIs.inProgress, trend: "~0%", trendClass: "text-slate-500" },
  { icon: "check_circle", iconClass: "text-emerald-600 bg-emerald-50", label: "Resolved", value: issueKPIs.resolved, trend: "+18%", trendClass: "text-emerald-600" },
  { icon: "priority_high", iconClass: "text-red-600 bg-red-50", label: "Critical", value:  issueKPIs.critical, trend: "+2%", trendClass: "text-red-600" },
  { icon: "event_busy", iconClass: "text-purple-600 bg-purple-50", label: "Overdue", value:  issueKPIs.overdue, trend: "+1%", trendClass: "text-red-600" },
];

  const onDragEnd = async (result) => {

  const {
    source,
    destination,
  } = result;

  if (!destination) {
    return;
  }

  const sourceProject =
    source.droppableId.substring(
      0,
      source.droppableId.lastIndexOf("-")
    );

  const sourceStatus =
    source.droppableId.substring(
      source.droppableId.lastIndexOf("-") + 1
    );

  const destinationProject =
    destination.droppableId.substring(
      0,
      destination.droppableId.lastIndexOf("-")
    );

  const destinationStatus =
    destination.droppableId.substring(
      destination.droppableId.lastIndexOf("-") + 1
    );

  if (
    sourceProject !==
    destinationProject
  ) {

    alert(
      "Moving issues between projects is not allowed"
    );

    return;

  }

  const boardCopy =
    JSON.parse(
      JSON.stringify(
        projectBoards[
          sourceProject
        ]
      )
    );

  const sourceColumn =
    boardCopy[
      sourceStatus
    ];

  const destinationColumn =
    boardCopy[
      destinationStatus
    ];

  const limit =
    wipLimits[
      destinationStatus
    ];

  if (
    sourceStatus !==
      destinationStatus &&
    destinationColumn.length >=
      limit
  ) {

    alert(
      `WIP Limit reached for ${destinationStatus}`
    );

    return;

  }

  const [movedCard] =
    sourceColumn.splice(
      source.index,
      1
    );

  movedCard.status =
    destinationStatus;

  destinationColumn.splice(
    destination.index,
    0,
    movedCard
  );

  const reorderedIssues = [];

  Object.entries(
    boardCopy
  ).forEach(
    ([status, issues]) => {

      issues.forEach(
        (
          issue,
          index
        ) => {

          reorderedIssues.push({
            issueId:
              issue.id,
            status,
            rank:
              index + 1,
          });

        }
      );

    }
  );

  try {

    await api.patch(
      "/issues/reorder",
      {
        issues:
          reorderedIssues,
      }
    );

    await loadIssues();

  } catch (error) {

    console.error(
      "Failed to reorder board",
      error
    );

  }

};
const projectMap =
  Object.fromEntries(
    projects.map((project) => [
      project.id,
      project.project_name,
    ])
  );
  const projectBoards = {};

issues.forEach((issue) => {

  const projectName =
    projectMap[
      issue.project_id
    ] || "Unknown Project";

  if (!projectBoards[projectName]) {

    projectBoards[projectName] = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
    };

  }

  projectBoards[
    projectName
  ][issue.status].push(issue);

});

Object.values(projectBoards).forEach(
  (board) => {

    Object.values(board).forEach(
      (column) => {

        column.sort(
          (a, b) =>
            (a.rank || 999999) -
            (b.rank || 999999)
        );

      }
    );

  }
);
const columnConfig = [
  {
    key: "todo",
    title: "TODO",
    countClass:
      "bg-blue-100 text-blue-700",
  },
  {
    key: "in_progress",
    title: "IN PROGRESS",
    countClass:
      "bg-yellow-100 text-yellow-700",
  },
  {
    key: "done",
    title: "DONE",
    countClass:
      "bg-emerald-100 text-emerald-700",
  },
  {
  key: "backlog",
  title: "Backlog",
  countClass:
    "bg-slate-100 text-slate-700",
},
];
const wipLimits = {
  backlog: Infinity,
  todo: 3,
  in_progress: 5,
  done: Infinity,
};
const priorityStyles = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};
  const userMap =
  Object.fromEntries(
    users.map((user) => [
      user.id,
      user.name,
    ])
  );
  const filteredIssues = issues.filter((issue) => {
    const keyword = filterKeyword.toLowerCase();
    const matchesKeyword =
  !keyword ||
  (issue.title || "")
    .toLowerCase()
    .includes(keyword) ||
  String(issue.id || "")
    .toLowerCase()
    .includes(keyword);
    const matchesStatus = filterStatus === "All" || issue.status === filterStatus;
    const matchesPriority = filterPriority === "All" || issue.priority === filterPriority;
   const matchesProject =
    isAdmin
        ? (
            filterProject === "All" ||
            projectMap[issue.project_id] === filterProject
        )
        : true;
   const matchesAssignee =filterAssignee === "Everyone" ||( filterAssignee ==="Unassigned" &&!issue.assigned_to  ) ||issue.assigned_to ===filterAssignee;
    return matchesKeyword && matchesStatus && matchesPriority && matchesProject && matchesAssignee ;
  });
const backlogIssues = issues
  .filter(
    (issue) =>
      issue.status === "backlog"
  )
  .sort(
    (a, b) =>
      (a.rank || 0) -
      (b.rank || 0)
  );

projects.forEach((project) => {
  projectMap[project.id] =
    project.project_name;
});
  const backlogProjects = {};

backlogIssues.forEach((issue) => {

  const projectName =
    projectMap[
      issue.project_id
    ] || "Unknown Project";

  if (
    !backlogProjects[
      projectName
    ]
  ) {
    backlogProjects[
      projectName
    ] = [];
  }

  backlogProjects[
    projectName
  ].push(issue);

});
const kanbanBoards = Object.entries(projectBoards).map(
  ([projectName, board]) => ({

    projectName,

    columns: columnConfig.map((column) => {

      const columnIssues =
        board[column.key] || [];

      return {

        ...column,

        issues: columnIssues,

        hierarchyTree:
          buildHierarchyTree(
            columnIssues
          ),

      };

    }),

  })
);
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
async function loadIssues() {
  try {
    setLoading(true);

    let response;

    if (isAdmin) {

      console.log("ADMIN");

      response = await getIssues();

    } else {

      console.log("MANAGER");

      console.log("Project Id:", projectId);

      response = await getProjectIssues(projectId);

    }

    console.log("Response");
    console.log(response);

    setIssues(response.data || []);

  } catch (err) {

    console.error("LOAD ISSUES ERROR");
    console.error(err);

  } finally {

    setLoading(false);

  }
}async function loadProjects() {
  try {
    const response = await api.get(
      "/projects?limit=100"
    );

    setProjects(
      response.data.data || []
    );
  } catch (error) {
    console.error(
      "Failed to load projects",
      error
    );
  }
}

async function loadUsers() {
  try {
    const response = await api.get(
      "/users?limit=100"
    );

    setUsers(
      response.data.data || []
    );
  } catch (error) {
    console.error(
      "Failed to load users",
      error
    );
  }
}
async function handleCreateIssue() {
  try {
    if (
      !newIssue.title ||
      !newIssue.projectId
    ) {
      alert(
        "Title and Project are required"
      );

      return;
    }

    await createIssue({
      title: newIssue.title,
      projectId: isAdmin
    ? newIssue.projectId
    : projectId,
      priority:
        newIssue.priority,
      dueDate:
        newIssue.dueDate || null,
      assignedTo:
        newIssue.assignedTo || null,
    });

    await loadIssues();

    setShowCreateModal(false);

    setNewIssue({
      title: "",
      projectId: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
    });

  } catch (error) {

    console.error(
      "Failed to create issue",
      error
    );

  }
}
const loadIssueKPIs =
  async () => {

    try {

      const response =
        await getIssueKPIs();

      setIssueKPIs(
        response.data
      );

    } catch (error) {

      console.error(
        "Failed to load KPI data",
        error
      );

    }

  };
  async function initializeIssueModule() {
  try {

    if (isAdmin) {

      await Promise.all([
        loadIssues(),
        loadProjects(),
        loadUsers(),
        loadIssueKPIs(),
      ]);

      return;
    }

    if (isManager) {
        await Promise.all([
        loadIssues(),
        loadProjects(),
        loadUsers(),
        loadIssueKPIs(),
    ]);

    return;
    }

    if (isMember) {

      // Member initialization
      // We'll implement this later.

      return;
    }

  } catch (error) {

    console.error(
      "Issue module initialization failed:",
      error
    );

  }
}
  useEffect(() => {
  initializeIssueModule();
}, []);
  const onBacklogDragEnd = async (
  result
) => {

  const {
    destination,
    source,
  } = result;

  if (!destination) {
    return;
  }

  if (
    source.droppableId !==
    destination.droppableId
  ) {
    return;
  }

  const projectName =
    source.droppableId.replace(
      "backlog-",
      ""
    );

  const issues =
    [...backlogProjects[projectName]];

  const [movedIssue] =
    issues.splice(source.index, 1);

  issues.splice(
    destination.index,
    0,
    movedIssue
  );

  const reorderedIssues =
    issues.map(
      (issue, index) => ({
        issueId: issue.id,
        status: "backlog",
        rank: index + 1,
      })
    );

  try {

    await api.patch(
      "/issues/reorder",
      {
        issues:
          reorderedIssues,
      }
    );

    await loadIssues();

  } catch (error) {

    console.error(
      "Backlog reorder failed",
      error
    );

  }
};
const openEditModal = (issue) => {
  setEditingIssue({
    ...issue,
    dueDate: issue.due_date
      ? issue.due_date.split("T")[0]
      : "",
  });

  setShowEditModal(true);
};
const handleUpdateIssue =
  async () => {
    try {
      await api.patch(
        `/issues/${editingIssue.id}`,
        {
          title:
            editingIssue.title,

          priority:
            editingIssue.priority,

          dueDate:
            editingIssue.dueDate,

          assignedTo:
            editingIssue.assigned_to,
        }
      );

      setShowEditModal(false);

      await loadIssues();

    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteIssue =
  async () => {

  const confirmed =
    window.confirm(
      "Are you sure you want to delete this issue?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await api.delete(
      `/issues/${editingIssue.id}`
    );

    setShowEditModal(false);

    setEditingIssue(null);

    await loadIssues();

  } catch (error) {

    console.error(
      "Delete failed",
      error
    );

    alert(
      "Failed to delete issue"
    );
  }
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
              <h1 className="text-3xl font-semibold tracking-tight leading-tight">{isAdmin
        ? "Issues Management"
        : "Project Issues"}</h1>
              <p className="text-sm text-[#505f76] mt-0.5">{isAdmin
        ? "Track, prioritize and resolve issues across all projects"
        : "Track and manage issues for this project"}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c5c5d7] text-[#505f76] rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Issues
              </button>
              )}
              <button 
              onClick={() =>
    setShowCreateModal(true)}
    className="flex items-center gap-2 px-4 py-2 bg-[#2036bd] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-semibold shadow-sm">
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
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">Priority: All</option>
             <option value="critical">Critical</option>
             <option value="high">High</option>
             <option value="medium">Medium</option>
             <option value="low">Low</option>
            </select>
            <select
              className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white focus:ring-1 focus:ring-[#2036bd] outline-none"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value="Everyone">
                Assignee: Everyone
              </option>
          <option value="Unassigned">
              Unassigned
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
           {isAdmin && (
    <select
      value={filterProject}
      onChange={(e) =>
        setFilterProject(e.target.value)
      }
      className="border border-[#c5c5d7] rounded-lg px-3 py-1.5 text-[13px] bg-white"
    >
      <option value="All">
        Project: All
      </option>

      {projects.map(project => (
        <option
          key={project.id}
          value={project.project_name}
        >
          {project.project_name}
        </option>
      ))}
    </select>
)}
  
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
            <button
  onClick={() => setView("backlog")}
  className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
    view === "backlog"
      ? "bg-white shadow-sm text-[#2036bd]"
      : "text-[#505f76] hover:text-[#191c1e]"
  }`}
>
  Backlog
</button>
          </div>

          <IssueWorkspace
    view={view}
    issues={filteredIssues}
    loading={loading}
    expandedIssues={expandedIssues}
    toggleExpand={toggleExpand}
    onExpandAll={onExpandAll}
    onCollapseAll={onCollapseAll}
    projects={projects}
    users={users}
    projectMap={projectMap}
    userMap={userMap}

    kanbanColumns={kanbanBoards}
    backlogItems={backlogProjects}

    selectedProject={selectedProject}
    setSelectedProject={setSelectedProject}

    onDragEnd={onDragEnd}
    onBacklogDragEnd={onBacklogDragEnd}

    openEditModal={openEditModal}

    priorityStyles={priorityStyles}
    columnConfig={columnConfig}
    wipLimits={wipLimits}
/>
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
       {showCreateModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-[500px]">

      <h2 className="text-2xl font-bold mb-4">
        Create Issue
      </h2>

      <div className="space-y-4">

        {/* Title */}
        <input
          type="text"
          placeholder="Issue Title"
          value={newIssue.title}
          onChange={(e) =>
            setNewIssue({
              ...newIssue,
              title: e.target.value,
            })
          }
          className="w-full border rounded-lg p-3"
        />

        {/* Project */}
        {isAdmin ? (

    <select
        value={newIssue.projectId}
        onChange={(e) =>
            setNewIssue({
                ...newIssue,
                projectId: e.target.value,
            })
        }
        className="w-full border rounded-lg p-3"
    >
        <option value="">
            Select Project
        </option>

        {projects.map((project) => (
            <option
                key={project.id}
                value={project.id}
            >
                {project.project_name}
            </option>
        ))}
    </select>

) : (

    <input
        type="text"
        value={
            projects.find(
                (p) => p.id === projectId
            )?.project_name || ""
        }
        disabled
        className="w-full border rounded-lg p-3 bg-gray-100"
    />

)}
        {/* Priority */}
        <select
          value={newIssue.priority}
          onChange={(e) =>
            setNewIssue({
              ...newIssue,
              priority: e.target.value,
            })
          }
          className="w-full border rounded-lg p-3"
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
          value={newIssue.dueDate}
          onChange={(e) =>
            setNewIssue({
              ...newIssue,
              dueDate: e.target.value,
            })
          }
          className="w-full border rounded-lg p-3"
        />
        
        {/* Assignee */}
        <select
          value={newIssue.assignedTo}
          onChange={(e) =>
            setNewIssue({
              ...newIssue,
              assignedTo: e.target.value,
            })
          }
          className="w-full border rounded-lg p-3"
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

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={() =>
              setShowCreateModal(false)
            }
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
           onClick={handleCreateIssue}
            className="px-4 py-2 bg-[#2036bd] text-white rounded-lg"
          >
            Create
          </button>

        </div>

      </div>

    </div>

  </div>
)}
{showEditModal && editingIssue && (
  <div className="
    fixed inset-0
    bg-black/40
    flex items-center
    justify-center
    z-50
  ">
    <div className="
      bg-white
      rounded-xl
      p-6
      w-[500px]
    ">
      <h2 className="
        text-xl
        font-bold
        mb-4
      ">
        Edit Issue
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          value={editingIssue.title}
          onChange={(e) =>
            setEditingIssue({
              ...editingIssue,
              title: e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />

        <select
          value={editingIssue.priority}
          onChange={(e) =>
            setEditingIssue({
              ...editingIssue,
              priority: e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        >
          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>

          <option value="critical">
            Critical
          </option>
        </select>

        <input
          type="date"
          value={
            editingIssue.dueDate
          }
          onChange={(e) =>
            setEditingIssue({
              ...editingIssue,
              dueDate:
                e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />
        <select
  value={
    editingIssue.assigned_to || ""
  }
  onChange={(e) =>
    setEditingIssue({
      ...editingIssue,
      assigned_to: e.target.value,
    })
  }
  className="
    w-full
    border
    rounded-lg
    p-3
  "
>
  <option value="">
    Unassigned
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
        <div className="
  flex justify-end
  gap-2
">

  <button
    onClick={handleDeleteIssue}
    className="
      px-4 py-2
      bg-red-500
      text-white
      rounded-lg
    "
  >
    Delete
  </button>

  <button
    onClick={() =>
      setShowEditModal(false)
    }
    className="
      px-4 py-2
      border
      rounded-lg
    "
  >
    Cancel
  </button>

  <button
    onClick={handleUpdateIssue}
    className="
      px-4 py-2
      bg-[#2036bd]
      text-white
      rounded-lg
    "
  >
    Save
  </button>

</div>
      </div>
    </div>
  </div>
)}
</div>
      </main>
    </div>
  </div>
  );
}