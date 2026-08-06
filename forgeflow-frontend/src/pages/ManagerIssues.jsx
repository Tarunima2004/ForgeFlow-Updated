import { useState, useMemo } from "react";
import { FiSearch, FiBell, FiSettings, FiFolder, FiHelpCircle, FiUser } from "react-icons/fi";
import {MdAdd,MdDashboard,MdListAlt,MdViewColumn,MdTimeline,MdHistory,MdBarChart,MdUnfoldMore,MdExpandMore,MdCheckBox,MdTrendingUp,MdLink,MdMoreHoriz,MdClose,MdEdit,MdRemove,} from "react-icons/md";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import { useParams } from "react-router-dom";
import {HiBolt,HiBookmark,HiOutlineChatBubbleLeftRight,HiOutlineChatBubbleLeft,HiChevronDoubleUp,} from "react-icons/hi2";
import { FaBug } from "react-icons/fa6";

// ---------------------------------------------------------------------------
// Mock data — shaped to mirror a future API response. Each epic owns stories,
// each story owns children (task | bug | improvement).
// ---------------------------------------------------------------------------
const epics = [
  {
    id: "PA-99",
    title: "Authentication System Overhaul",
    progress: 72,
    dueDate: "Oct 15",
    storiesCount: 4,
    tasksCount: 18,
    assignees: [
      {
        name: "Team member",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD_CzfuGAbwBDnd2lNwNvGg4WiSknuYYHErx3vlVuMp2Cq5SIgVtEyoPsxZElIvTfF2g4jgye4gGuiadxmEkw6u_ZLwpvlLwP8NdFoAiupwGNgYDZnnpR1aGLXuMtbFMGAtINvEqXkSRSLT1ANq5DVqjWgdWF7HOCTALxIgo9QeO_YXBx6WM5rTey7hz-y78xKVPDgBzRJXTB3fz1940GP-qVWiptbKkkatDBvFlu9FWaYRELbRGdHAUA",
      },
      {
        name: "Team member",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDzYb7g3auBGBG1R2UEpMVjLOrex9jYwePH009chH7QfDAQHSdKU20c6AMXH7WbIH01rD7CccFeClV7gsjivYO56mwHzPnGIA4uoxJZoHw9NqPuALoMAWvXMbIQyqR95e-dn49E6ldS_cVlHcf9czGxKDYswOmE25qxzNVfMJo-L1WQFzT-kVC3w00oMjlC9y1N-HNXzClmbG79FP_7HcdytiW6Ag7T2u-jWINz5c_4I_5O_kIFhdVM4A",
      },
    ],
    extraAssignees: 2,
    stories: [
      {
        id: "FF-100",
        title: "User Login Flow Implementation",
        status: "In Progress",
        progress: 40,
        assignee: {
          name: "Assignee",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDgcJvo10jsx4uqB3CYvm8p_d9roZMKOcfxyivwsYSHx96e-umtXjHUjVNrijWgvD1UBauhSDQrBm_x9wHcV6d1-rjs2jmDZLP6en_Qch8rVXEfN1L-wU9NOORx8caOoc4oaKjTLfy-WegJ7VttfZ4TnRwvZsq07a8KAwhWOti5xOwuxwXDmqEvpbSm6kirsTMtnAJ2K3VPITOUKvs7DOH6PwdmlFqp5VJAb67xYmnbWDKlMv7UfXxqqw",
        },
        children: [
          {
            id: "FF-101",
            type: "task",
            title: "Design login screen UI components",
            status: "Done",
            priority: "none",
            storyPoints: 3,
            comments: 0,
            assignee: {
              name: "Assignee",
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA_JPQNicijCyIoDs7fgFX1i-u8UeXztxadc7uFG6R0gfHZce_0WNYOrC0siTttCVMY0AOMijFj6a-jTyeRPOXxUXaTABJaTopl3yChXQEoBHuwvFPZuRJBNFUTIcRr9V7TZSp4swtjWyZUs_SBQZWXxk8N0xgmSCCD2NEIn1OsBnErBHR03h9siEk7IJugtdsyLbVfZwhCyFK83N85M5OBgfxcvEJAm1Xj95eGLaysIreMY3ofw2w6OQ",
            },
          },
          {
            id: "FF-102",
            type: "task",
            title: "Refactor Login API to support OAuth2",
            status: "In Progress",
            priority: "highest",
            storyPoints: 5,
            comments: 3,
            assignee: {
              name: "Sarah Jenkins",
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDnGliSi9QUNlTQ2QbqdCR90S38bFC0c89YraSgxnjp6VViBUccwViBOw18nOA5uWe3a5Nk44x3cpwV5Mexu3RKxfqY_LgA6RPfVaRWgZUgZwBaAUTWZokpnR3bQvmQZ14HdOj52Oy48A4QnuM_6ZdYJQf2aeZV-JBH2fGhEf0Z5xxEkpSzrNjxz5ZWPWutyJfxO7D6WazaGoHtbONz1qkJlV6enKNYp5w1lgSiZhIJAh54EuByU2cfaQ",
            },
            reporter: {
              name: "Mike Chen",
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkF8-BHAzFfIxHNBqE6fMcaBjn5EN27mceJViYoR6ez6OfFjdsYoC4EVHHEAzRd_ISQ1Cuq5MftZ0PK80SN741UT3Qm5VRSQZ5L5Xk49cAbfJiryFjraY4iZctqdYzaJCJugN75G0wr_Rjk65aJpUW9QkuZX76qCqqtc0_e9upmXd_-0E1suNeefEOagGbw_hcxKQxeiauQ8GoJHJ0T9LLKpxO58U9y_phq93c-UIsIOB-sG4lX1-5A",
            },
            description: {
              intro:
                "We need to update the core authentication API endpoints to support OAuth2 flows, specifically preparing for Google and GitHub SSO integration in the next sprint.",
              bullets: [
                "Update user schema to handle external provider IDs",
                "Implement JWT token generation aligned with new security policies",
                "Create fallback mechanisms for legacy basic auth during migration",
              ],
              acceptance:
                "All existing tests must pass, plus new coverage for the OAuth callback handlers. Performance must not degrade below 150ms p95 response time.",
            },
            activity: [
              {
                id: "c1",
                author: "Alex Rivera",
                avatar:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDh1r-55oS-0udaHyTJO-f_bk0yDQzREI20uNZi6MMWatYD2tIZSyd6DMsyQAFbPPCmN_v_-1XWjJcYy3EvjgFpMnPmS6AuYGOoMJsM6J7SmYbaj3hN-p29d7kwijjLEgXRTfjfxUdfalbg_R5qfh0ArvspTptBkaEN7alCjLUwXCIQmtK3VWSbZYXIsi-MjxN7cW2B1LSOv_1hdSnNDuBv7edEi_4UvQxVcgfBT0PJ1ECjywJot7fSRQ",
                timestamp: "2 hours ago",
                content:
                  "I've pushed the initial schema changes to the feature branch. Ready for review before I tackle the JWT generation.",
              },
              {
                id: "c2",
                author: "Sarah Jenkins",
                avatar:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyM3sbE5aAHw4u0hfp1JLtmmUwNQPA_9S8YOsvSdaAlaElXwUL90n_oSo9KdtXD975xAvlogZTLHjgmbtsIji2GO6I_NGiPoRE1SdCmBkMmATImIy3xR2R7H7UA9Xaycy-3QYCDfX5ZGRnVggUkqXLoGuztSEkrjVhcJhrcqaZg8N1H2M6oAcRkOpDnWQTKk39rP9qaxpTQzN8d5pP9JGK0DK8BaOV0P7cjLvp4j_1xPjtNk2N-T4mpg",
                timestamp: "1 hour ago",
                content:
                  "Looking at the schema now. Make sure we index the provider_id column, queries are going to hit it hard on login.",
              },
            ],
          },
          {
            id: "FF-105",
            type: "bug",
            title: "Password reset link expires instantly on mobile",
            status: "Blocked",
            priority: "highest",
            comments: 7,
            assignee: null,
          },
        ],
      },
      {
        id: "FF-112",
        title: "Implement Multi-Factor Authentication",
        status: "To Do",
        progress: 0,
        assignee: {
          name: "Assignee",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCrQFRmEtS4DP0EbjWd9792J_PKrnHj89rFsjiVvR5fKjfucdiuzbWbSoPDLkOZN3KBTCLmtm7bihGHjDy-PFNdllF18D_SGyG7a-faO0o2Z19zxolCrvNnp3Mh9wZSj3aayGVYsILDux9qpwvCTbhcpyzJBfouY-oPuKNXAcert5jGWQUiM4pwqKM6P1TjPDC7JojlN2NEbcom_YDsoxDbTe1q6sCO8FEYjrS8MkFsEQe-LmLKD8RFqA",
        },
        children: [],
      },
    ],
  },
  {
    id: "PA-145",
    title: "Dashboard Analytics Widgets V2",
    progress: 12,
    dueDate: "Nov 02",
    storiesCount: 0,
    tasksCount: 0,
    assignees: [],
    extraAssignees: 0,
    stories: [],
  },
];

// ---------------------------------------------------------------------------
// Static lookup config for icons / colors keyed by issue type, status, and
// priority — keeps row rendering free of duplicated JSX.
// ---------------------------------------------------------------------------
const typeConfig = {
  epic: { icon: HiBolt, color: "text-violet-500", bg: "bg-violet-500/10" },
  story: { icon: HiBookmark, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  task: { icon: MdCheckBox, color: "text-blue-500", bg: "bg-blue-500/10" },
  bug: { icon: FaBug, color: "text-red-500", bg: "bg-red-500/10" },
  improvement: { icon: MdTrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
};

const statusStyles = {
  "In Progress": "bg-sky-100 text-sky-700 border-sky-200",
  Done: "bg-green-100 text-green-800 border-green-200",
  Blocked: "bg-red-100 text-red-700 border-red-200",
  "To Do": "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityConfig = {
  highest: { icon: HiChevronDoubleUp, color: "text-red-500" },
  high: { icon: HiChevronDoubleUp, color: "text-orange-500" },
  medium: { icon: MdRemove, color: "text-amber-500" },
  low: { icon: MdRemove, color: "text-slate-400" },
  none: { icon: MdRemove, color: "text-slate-400" },
};

const getStatusBadgeClasses = (status) => statusStyles[status] || statusStyles["To Do"];
const getPriorityConfig = (priority) => priorityConfig[priority] || priorityConfig.none;

export default function Issues() {
  const { projectId } = useParams();
  const [selectedIssue, setSelectedIssue] = useState(epics[0].stories[0].children[1]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [expandedEpics, setExpandedEpics] = useState({ "PA-99": true, "PA-145": false });
  const [expandedStories, setExpandedStories] = useState({ "FF-100": true, "FF-112": false });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: null, status: null, assignee: null, epic: null });

  const toggleEpic = (id) => setExpandedEpics((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleStory = (id) => setExpandedStories((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const allEpics = {};
    const allStories = {};
    epics.forEach((epic) => {
      allEpics[epic.id] = true;
      epic.stories.forEach((story) => {
        allStories[story.id] = true;
      });
    });
    setExpandedEpics(allEpics);
    setExpandedStories(allStories);
  };

  const openIssue = (issue) => {
    setSelectedIssue(issue);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const filteredEpics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return epics;

    const matches = (text) => text.toLowerCase().includes(query);

    return epics
      .map((epic) => {
        const stories = epic.stories
          .map((story) => {
            const children = story.children.filter((child) => matches(child.title));
            if (matches(story.title) || children.length > 0) {
              return { ...story, children: matches(story.title) ? story.children : children };
            }
            return null;
          })
          .filter(Boolean);

        if (matches(epic.title) || stories.length > 0) {
          return { ...epic, stories: matches(epic.title) ? epic.stories : stories };
        }
        return null;
      })
      .filter(Boolean);
  }, [search]);

  return (
  <div className="min-h-screen bg-slate-50">

    <Sidebar
      role="manager"
      projectId={projectId}
    />

    <Navbar />

    <main className="ml-[240px] pt-[72px]">
          {/* Header Section */}
          <header className="px-6 py-5 shrink-0 bg-white border-b border-slate-200 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900">Project Issues</h1>
              <p className="text-slate-500 mt-1 text-[13px]">Manage Epics, Stories, Tasks, Bugs and Improvements in a hierarchical structure.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => {}} className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 text-[13px] font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                Import Issues
              </button>
              <button onClick={() => {}} className="bg-blue-600 text-white hover:bg-blue-700 text-[13px] font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5">
                <MdAdd className="text-[18px]" /> Create Issue
              </button>
            </div>
          </header>

          {/* Filter Bar */}
          <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 flex flex-wrap items-center gap-3 z-10">
            <div className="relative w-64">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                placeholder="Filter by text..."
                type="text"
              />
            </div>
            <div className="h-5 w-px bg-slate-200 mx-1"></div>

            <button onClick={() => setFilters((prev) => ({ ...prev, type: prev.type ? null : "open" }))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-900 hover:bg-slate-100 transition-colors">
              Type <MdExpandMore className="text-[16px] text-slate-400" />
            </button>
            <button onClick={() => setFilters((prev) => ({ ...prev, status: prev.status ? null : "open" }))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-900 hover:bg-slate-100 transition-colors">
              Status <MdExpandMore className="text-[16px] text-slate-400" />
            </button>
            <button onClick={() => setFilters((prev) => ({ ...prev, assignee: prev.assignee ? null : "open" }))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-900 hover:bg-slate-100 transition-colors">
              Assignee <MdExpandMore className="text-[16px] text-slate-400" />
            </button>
            <button onClick={() => setFilters((prev) => ({ ...prev, epic: prev.epic ? null : "open" }))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-900 hover:bg-slate-100 transition-colors">
              Epic <MdExpandMore className="text-[16px] text-slate-400" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            <button onClick={expandAll} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-slate-500 hover:text-blue-700 transition-colors ml-auto font-medium">
              <MdUnfoldMore className="text-[16px]" /> Expand All
            </button>
          </div>

          {/* List Header */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center shrink-0">
            <div className="w-8 shrink-0"></div>
            <div className="w-10 shrink-0">Type</div>
            <div className="w-20 shrink-0">Key</div>
            <div className="flex-1 min-w-[200px]">Summary</div>
            <div className="w-24 shrink-0 px-2 text-center">Status</div>
            <div className="w-24 shrink-0 px-2 text-center">Priority</div>
            <div className="w-24 shrink-0 px-2">Assignee</div>
            <div className="w-16 shrink-0 text-right pr-4">Metrics</div>
          </div>

          {/* Hierarchy Explorer Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <div className="p-4 pb-20 flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
              {filteredEpics.map((epic) => {
                const EpicIcon = typeConfig.epic.icon;
                const isEpicExpanded = !!expandedEpics[epic.id];

                return (
                  <div key={epic.id} className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                    {/* Epic Header Row */}
                    <div
                      onClick={() => toggleEpic(epic.id)}
                      className="p-4 border-b border-slate-200 bg-white flex items-center cursor-pointer hover:bg-slate-50 transition-colors group"
                    >
                      <button onClick={(e) => { e.stopPropagation(); toggleEpic(epic.id); }} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center mr-2 text-slate-500">
                        <MdExpandMore className={`text-[20px] transition-transform ${isEpicExpanded ? "" : "-rotate-90"}`} />
                      </button>
                      <div className={`w-6 h-6 rounded ${typeConfig.epic.bg} flex items-center justify-center mr-3 shrink-0`}>
                        <EpicIcon className={`text-[16px] ${typeConfig.epic.color}`} />
                      </div>
                      <div className="text-[13px] font-mono text-slate-400 mr-3 w-16">{epic.id}</div>
                      <h2 className="text-[15px] font-semibold text-slate-900 group-hover:text-blue-700 transition-colors flex-1 truncate">
                        {epic.title}
                      </h2>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="flex flex-col w-32">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-500 font-medium">Progress</span>
                            <span className="text-slate-900 font-bold">{epic.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${typeConfig.epic.bg} rounded-full relative`} style={{ width: `${epic.progress}%` }}>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-violet-500 opacity-50"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-slate-500">
                          <div className="flex items-center gap-1" title={`${epic.storiesCount} Stories`}>
                            <HiBookmark className={`text-[14px] ${typeConfig.story.color}`} /> {epic.storiesCount}
                          </div>
                          <div className="flex items-center gap-1" title={`${epic.tasksCount} Tasks`}>
                            <MdCheckBox className={`text-[14px] ${typeConfig.task.color}`} /> {epic.tasksCount}
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          {epic.assignees.map((person, idx) => (
                            <img key={idx} alt={person.name} className="w-6 h-6 rounded-full border border-white" src={person.avatar} />
                          ))}
                          {epic.extraAssignees > 0 && (
                            <div className="w-6 h-6 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-900">
                              +{epic.extraAssignees}
                            </div>
                          )}
                        </div>
                        <div className="text-[12px] text-slate-400 font-medium w-20 text-right">{epic.dueDate}</div>
                      </div>
                    </div>

                    {/* Epic Content / Children */}
                    {isEpicExpanded && (
                      <div className="bg-slate-50 py-2">
                        {epic.stories.map((story) => {
                          const StoryIcon = typeConfig.story.icon;
                          const isStoryExpanded = !!expandedStories[story.id];

                          return (
                            <div key={story.id} className="ml-4 mr-2 mb-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                              {/* Story Header */}
                              <div
                                onClick={() => toggleStory(story.id)}
                                className={`px-3 py-2.5 flex items-center cursor-pointer hover:bg-slate-50 transition-colors group ${isStoryExpanded ? "border-b border-slate-200" : ""}`}
                              >
                                <button onClick={(e) => { e.stopPropagation(); toggleStory(story.id); }} className="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center mr-1 text-slate-500">
                                  <MdExpandMore className={`text-[18px] transition-transform ${isStoryExpanded ? "" : "-rotate-90"}`} />
                                </button>
                                <div className={`w-5 h-5 rounded ${typeConfig.story.bg} flex items-center justify-center mr-2 shrink-0`}>
                                  <StoryIcon className={`text-[14px] ${typeConfig.story.color}`} />
                                </div>
                                <div className="text-[12px] font-mono text-slate-400 mr-3 w-16">{story.id}</div>
                                <h3 className="text-[14px] font-medium text-slate-900 group-hover:text-blue-700 transition-colors flex-1 truncate">
                                  {story.title}
                                </h3>
                                <div className="flex items-center gap-4 shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadgeClasses(story.status)}`}>{story.status}</span>
                                  <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${story.progress}%` }}></div>
                                  </div>
                                  {story.assignee && <img alt={story.assignee.name} className="w-5 h-5 rounded-full" src={story.assignee.avatar} />}
                                </div>
                              </div>

                              {/* Story Children List */}
                              {isStoryExpanded && (
                                <div className="flex flex-col bg-white">
                                  {story.children.map((child) => {
                                    const ChildIcon = typeConfig[child.type]?.icon;
                                    const childPriority = getPriorityConfig(child.priority);
                                    const PriorityIcon = childPriority.icon;
                                    const isActive = selectedIssue?.id === child.id;

                                    return (
                                      <div
                                        key={child.id}
                                        onClick={() => openIssue(child)}
                                        className={`flex items-center pl-10 pr-3 py-2 text-[13px] relative border-b border-slate-200 last:border-b-0 hover:bg-slate-100 transition-colors cursor-pointer ${
                                          isActive ? "bg-blue-50 border-l-2 border-l-blue-600" : ""
                                        }`}
                                      >
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200"></div>
                                        <div className="absolute left-6 top-1/2 w-3 h-px bg-slate-200"></div>
                                        <div className="w-5 shrink-0 ml-2"></div>
                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mr-2">
                                          {ChildIcon && <ChildIcon className={`text-[16px] ${typeConfig[child.type]?.color}`} />}
                                        </div>
                                        <div className={`w-16 shrink-0 font-mono text-[11px] ${isActive ? "text-blue-600 font-bold" : "text-slate-400"}`}>{child.id}</div>
                                        <div className={`flex-1 truncate pr-4 cursor-pointer ${isActive ? "text-blue-900 font-medium" : "text-slate-900 hover:text-blue-600"}`}>
                                          {child.title}
                                        </div>
                                        <div className="w-24 shrink-0 px-2 flex justify-center">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(child.status)}`}>{child.status}</span>
                                        </div>
                                        <div className="w-24 shrink-0 px-2 flex justify-center">
                                          <PriorityIcon className={`text-[16px] ${childPriority.color}`} />
                                        </div>
                                        <div className="w-24 shrink-0 px-2 flex justify-center">
                                          {child.assignee ? (
                                            <img alt={child.assignee.name} className="w-5 h-5 rounded-full" src={child.assignee.avatar} />
                                          ) : (
                                            <div className="w-5 h-5 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                                              <FiUser className="text-[12px] text-slate-400" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="w-16 shrink-0 text-right pr-2 text-slate-400 font-medium text-[12px] flex items-center justify-end gap-2">
                                          {child.storyPoints != null && <span className="px-1.5 bg-slate-100 rounded text-[10px]">{child.storyPoints}</span>}
                                          {child.comments > 0 && (
                                            <span className={`flex items-center text-[10px] ${child.status === "Blocked" ? "text-red-500" : ""}`}>
                                              <HiOutlineChatBubbleLeft className="text-[12px] mr-0.5" /> {child.comments}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Drawer: Issue Details Panel */}
        {drawerOpen && selectedIssue && (
          <aside className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)] flex flex-col z-20 transform transition-transform duration-300 translate-x-0">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 font-mono text-[11px] font-semibold border border-slate-200">{selectedIssue.id}</span>
                <button onClick={() => {}} className="p-1 text-slate-500 hover:text-blue-700 hover:bg-slate-50 rounded transition-colors" title="Copy link">
                  <MdLink className="text-[16px]" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => {}} className="p-1.5 text-slate-500 hover:bg-slate-50 rounded transition-colors">
                  <MdMoreHoriz className="text-[18px]" />
                </button>
                <button onClick={closeDrawer} className="p-1.5 text-slate-500 hover:bg-slate-50 rounded transition-colors ml-1">
                  <MdClose className="text-[20px]" />
                </button>
              </div>
            </div>

            {/* Drawer Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-white p-5 flex flex-col gap-6">
              {/* Title & Header info */}
              <div>
                <h2 className="text-[20px] leading-tight text-slate-900 mb-4">{selectedIssue.title}</h2>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button onClick={() => {}} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] hover:bg-slate-100 transition-colors">
                    <MdEdit className="text-[14px]" /> Edit
                  </button>
                  <button onClick={() => {}} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] hover:bg-slate-100 transition-colors">
                    <HiOutlineChatBubbleLeft className="text-[14px]" /> Comment
                  </button>
                  <button onClick={() => {}} className="flex items-center px-3 py-1.5 bg-sky-100 border border-sky-200 text-sky-700 font-medium rounded-md text-[13px] hover:bg-sky-200 transition-colors ml-auto">
                    {selectedIssue.status} <MdExpandMore className="text-[16px] ml-1" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Assignee</span>
                  <div className="flex items-center gap-2 mt-0.5 cursor-pointer hover:bg-slate-200 p-1 -ml-1 rounded transition-colors w-max">
                    {selectedIssue.assignee ? (
                      <>
                        <img alt={selectedIssue.assignee.name} className="w-6 h-6 rounded-full" src={selectedIssue.assignee.avatar} />
                        <span className="text-[13px] text-slate-900 font-medium">{selectedIssue.assignee.name}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                          <FiUser className="text-[12px] text-slate-400" />
                        </div>
                        <span className="text-[13px] text-slate-400 font-medium">Unassigned</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Reporter</span>
                  <div className="flex items-center gap-2 mt-0.5 cursor-pointer hover:bg-slate-200 p-1 -ml-1 rounded transition-colors w-max">
                    {selectedIssue.reporter ? (
                      <>
                        <img alt={selectedIssue.reporter.name} className="w-6 h-6 rounded-full" src={selectedIssue.reporter.avatar} />
                        <span className="text-[13px] text-slate-900 font-medium">{selectedIssue.reporter.name}</span>
                      </>
                    ) : (
                      <span className="text-[13px] text-slate-400 font-medium">Unknown</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Priority</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(() => {
                      const priority = getPriorityConfig(selectedIssue.priority);
                      const PriorityIcon = priority.icon;
                      return (
                        <>
                          <PriorityIcon className={`text-[16px] ${priority.color}`} />
                          <span className="text-[13px] text-slate-900 capitalize">{selectedIssue.priority || "None"}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Story Points</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-slate-200 rounded font-mono text-[12px] font-medium text-slate-900">{selectedIssue.storyPoints ?? "—"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedIssue.description && (
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-2">Description</h3>
                  <div className="text-[13px] text-slate-500 leading-relaxed border border-transparent hover:border-slate-200 hover:bg-slate-50 p-2 -mx-2 rounded transition-colors cursor-text">
                    <p className="mb-2">{selectedIssue.description.intro}</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      {selectedIssue.description.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                    <p>
                      <strong>Acceptance Criteria:</strong> {selectedIssue.description.acceptance}
                    </p>
                  </div>
                </div>
              )}

              {/* Activity Feed */}
              <div className="mt-4 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-slate-900">Activity</h3>
                  <div className="flex gap-3 text-[12px] text-slate-500">
                    <span className="font-medium text-blue-700 border-b-2 border-blue-700 pb-0.5 cursor-pointer">Comments</span>
                    <span onClick={() => {}} className="cursor-pointer hover:text-slate-900">History</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 -z-10"></div>
                  {(selectedIssue.activity || []).map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img alt={comment.author} className="w-8 h-8 rounded-full border-2 border-white shrink-0" src={comment.avatar} />
                      <div className="flex flex-col w-full">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-slate-900">{comment.author}</span>
                          <span className="text-[11px] text-slate-400">{comment.timestamp}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg rounded-tl-none p-3 text-[13px] text-slate-500">{comment.content}</div>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[12px] border-2 border-white shrink-0">ME</div>
                    <div className="flex-1">
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Add a comment..."
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
  );
}