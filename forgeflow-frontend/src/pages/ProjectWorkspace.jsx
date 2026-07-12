import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getProjectById, getProjectMembers,getProjectStatistics } from "../services/projects.service";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const [teamMembers, setTeamMembers] = React.useState([]);
  const [projectStatistics, setProjectStatistics] =React.useState(null);
  
  useEffect(() => {

  const fetchProject = async () => {

    try {

      const projectResponse =
    await getProjectById(projectId);

setProject(projectResponse);


const membersResponse =
    await getProjectMembers(projectId);

setTeamMembers(membersResponse.data);

const statisticsResponse =
  await getProjectStatistics(projectId);

setProjectStatistics(
  statisticsResponse
);

    }

    catch (error) {

      console.error(
        "PROJECT FETCH FAILED"
      );

      console.error(error);

    }

  };

  fetchProject();

}, [projectId]);
  useEffect(() => {
    // Hover micro-interaction for the statistics mini-cards (unchanged behavior)
    const cards = document.querySelectorAll(".stat-mini-card");
    const handleEnter = (card) => () => {
      card.classList.add("shadow-md", "-translate-y-1", "border-[#004ac6]/20");
      card.classList.remove("border-[#c3c6d7]/30");
    };
    const handleLeave = (card) => () => {
      card.classList.remove("shadow-md", "-translate-y-1", "border-[#004ac6]/20");
      card.classList.add("border-[#c3c6d7]/30");
    };

    const listeners = [];
    cards.forEach((card) => {
      const enter = handleEnter(card);
      const leave = handleLeave(card);
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      listeners.push({ card, enter, leave });
    });

  
    return () => {
      listeners.forEach(({ card, enter, leave }) => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);
  const managers = teamMembers.filter(
    member => member.permission_role === "manager"
);

const members = teamMembers.filter(
    member => member.permission_role === "member"
);


  return (
    <div className="font-['Inter'] text-[14px] leading-[20px] text-[#0b1c30] bg-[#f8f9ff] min-h-screen">
      {/* Material Symbols font (needed for icons to render) */}
       <Sidebar />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>

      
      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        <Navbar />
        {/* Project Content Container */}
        <div className="p-8 max-w-[1440px] mx-auto">
          {/* Project Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#565e74] uppercase tracking-widest bg-[#dce9ff] px-2 py-0.5 rounded">
                {project?.project_id}
                </span>
                <h1 className="text-[30px] leading-[38px] font-bold tracking-[-0.02em] text-[#0b1c30]">
                  {project?.project_name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[12px] leading-[16px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {project?.status}
                </span>
                <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[12px] font-bold">
    <span className="material-symbols-outlined text-[14px]">
        priority_high
    </span>

    {project?.priority}
</span>
                <span className="flex items-center gap-1.5 bg-[#dce9ff] text-[#434655] px-3 py-1 rounded-full text-[12px] leading-[16px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">
                    public
                  </span>
                  {project?.visibility}
                </span>
                <div className="h-4 w-px bg-[#c3c6d7] mx-2"></div>
                <p className="text-[13px] text-[#565e74]">
    {project?.start_date
        ? new Date(project.start_date).toLocaleDateString()
        : "-"}

    {" — "}

    {project?.end_date
        ? new Date(project.end_date).toLocaleDateString()
        : "-"}
</p>
              </div>
            </div>
           
          </div>

          {/* Horizontal Tabs */}
          <div className="border-b border-[#c3c6d7] mb-8 overflow-x-auto">
            <ul className="flex items-center gap-8 whitespace-nowrap">
              <li className="pb-3 border-b-2 border-[#004ac6]">
                <a
                  className="text-[12px] leading-[16px] tracking-[0.05em] text-[#004ac6] font-bold"
                  href="#"
                >
                  Overview
                </a>
              </li>
              {[
                "Issues",
            "Timeline",
            "Activity",
            "Files",
              ].map((label) => (
                <li
                  key={label}
                  className="pb-3 group relative cursor-not-allowed coming-soon-tab"
                >
                  <span className="text-[12px] leading-[16px] tracking-[0.05em] text-[#565e74] group-hover:text-[#004ac6] transition-colors">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 1. Project Information */}
            <div className="md:col-span-8 bg-white rounded-xl border border-[#c3c6d7] shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0b1c30]">
                  Project Information
                </h3>
                <span className="material-symbols-outlined text-[#737686] cursor-pointer hover:text-[#004ac6]">
                  info
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                      Project Name
                    </label>
                    <p className="text-[16px] leading-[24px] font-medium">
                      {project?.project_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                      Project Code
                    </label>
                    <p className="text-[14px] leading-[20px]">{project?.project_id}</p>
                  </div>
                  <div>
                    <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                      Description
                    </label>
                    <p className="text-[14px] leading-[20px] leading-relaxed text-[#434655]">
                      {project?.description || "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                        Status
                      </label>
                      <p className="text-[14px] leading-[20px] font-medium text-green-600">
                        {project?.status}
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                        Priority
                      </label>
                      <p className="text-[14px] leading-[20px] font-medium text-[#ba1a1a]">
                        {project?.priority}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                        Start Date
                      </label>
                      <p className="text-[14px] leading-[20px]">
                        {project?.start_date
    ? new Date(project.start_date).toLocaleDateString()
    : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-1">
                        End Date
                      </label>
                      <p className="text-[14px] leading-[20px]">
                        {project?.end_date
    ? new Date(project.end_date).toLocaleDateString()
    : "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] leading-[14px] font-medium text-[#565e74] block mb-2">
                      Completion
                    </label>
                    <div className="w-full bg-[#dce9ff] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#004ac6] h-full w-[0%] transition-all duration-1000"></div>
                    </div>
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] mt-1 text-right font-bold text-[#565e74]">
                      0% Complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Project Statistics */}
            <div className="md:col-span-4 bg-white rounded-xl border border-[#c3c6d7] shadow-sm p-6">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[#0b1c30] mb-6">
                Project Statistics
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#eff4ff] p-4 rounded-lg flex items-center justify-between border border-[#c3c6d7]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                      <span className="material-symbols-outlined">
                        assignment
                      </span>
                    </div>
                    <span className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#565e74]">
                      Total Issues
                    </span>
                  </div>
                  <span className="text-[18px] leading-[26px] font-bold">
  {projectStatistics?.totalIssues ?? 0}
</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="stat-mini-card bg-white p-3 rounded-lg border border-[#c3c6d7]/30 flex flex-col items-center text-center transition-all">
                    <span className="text-[11px] leading-[14px] text-[#565e74] uppercase mb-1">
                      Backlog
                    </span>
                    <span className="text-[18px] leading-[26px] font-bold text-[#0b1c30]">
  {projectStatistics?.backlog ?? 0}
</span>
                  </div>
                  <div className="stat-mini-card bg-white p-3 rounded-lg border border-[#c3c6d7]/30 flex flex-col items-center text-center transition-all">
                    <span className="text-[11px] leading-[14px] text-[#565e74] uppercase mb-1">
                      Todo
                    </span>
                    <span className="text-[18px] leading-[26px] font-bold text-[#0b1c30]">
                      {projectStatistics?.todo ?? 0}
                    </span>
                  </div>
                  <div className="stat-mini-card bg-white p-3 rounded-lg border border-[#c3c6d7]/30 flex flex-col items-center text-center transition-all">
                    <span className="text-[11px] leading-[14px] text-[#565e74] uppercase mb-1">
                      In Progress
                    </span>
                    <span className="text-[18px] leading-[26px] font-bold text-[#004ac6]">
                      {projectStatistics?.inProgress ?? 0}
                    </span>
                  </div>
                  <div className="stat-mini-card bg-white p-3 rounded-lg border border-[#c3c6d7]/30 flex flex-col items-center text-center transition-all">
                    <span className="text-[11px] leading-[14px] text-[#565e74] uppercase mb-1">
                      Done
                    </span>
                    <span className="text-[18px] leading-[26px] font-bold text-green-600">
                      {projectStatistics?.done ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Team Summary */}
            <div className="md:col-span-6 bg-white rounded-xl border border-[#c3c6d7] shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0b1c30]">
                  Team Summary
                </h3>
                <button className="text-[#004ac6] text-[12px] leading-[16px] font-semibold tracking-[0.05em] flex items-center gap-1 hover:underline">
                  View All{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                  </span>
                </button>
              </div>
      
              <div className="space-y-6">
                {/* Managers Section */}
                <div>
                  <h4 className="text-[12px] leading-[16px] font-bold tracking-[0.05em] text-[#565e74] uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]"></span>
                    Managers
                  </h4>
                  
                 <div className="grid grid-cols-1 gap-4">
                
                          
    {managers.map((manager) => (

        <div
            key={manager.user_id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#eff4ff] transition-colors border border-[#c3c6d7]/20"
        >

            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(manager.name)}&background=004ac6&color=fff`}
                alt={manager.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />

            <div className="flex-1">

                <h5 className="text-[14px] font-bold">
                    {manager.name}
                </h5>

                <p className="text-[11px] text-[#565e74]">
                    {manager.project_designation}
                </p>

            </div>

            <div className="text-right">

                <span className="text-[11px] bg-[#004ac6]/10 text-[#004ac6] px-2 py-0.5 rounded">

                    Manager

                </span>

            </div>

        </div>

    ))}

</div>

                </div>

                {/* Members Section */}
                <div>
                  <h4 className="text-[12px] leading-[16px] font-bold tracking-[0.05em] text-[#565e74] uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#565e74]"></span>
                    Members
                  </h4>
                  <div className="space-y-3">
  
    {members.map((member) => (

        <div
            key={member.user_id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#eff4ff] transition-colors border border-[#c3c6d7]/20"
        >

            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                )}&background=004ac6&color=fff`}
                alt={member.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />

            <div className="flex-1">

                <h5 className="text-[14px] font-bold">

                    {member.name}

                </h5>

                <p className="text-[11px] text-[#565e74]">

                    {member.project_designation}

                </p>

            </div>

            <div className="text-right">

                <span className="text-[11px] bg-[#004ac6]/10 text-[#004ac6] px-2 py-0.5 rounded">

                    Member

                </span>

            </div>

        </div>

    ))}

</div>
                  
                </div>
              </div>
            </div>

            {/* 4. Recent Activity */}
            <div className="md:col-span-6 bg-white rounded-xl border border-[#c3c6d7] shadow-sm p-6">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[#0b1c30] mb-6">
                Recent Activity
              </h3>
              <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-[#c3c6d7]">
                {/* Timeline Item 1 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center border-2 border-white z-10">
                    <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                      add_circle
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] leading-[20px] font-medium">
                        Project Created
                      </p>
                      <span className="text-[11px] leading-[14px] text-[#737686]">
                        Oct 1, 2024
                      </span>
                    </div>
                    <p className="text-[13px] leading-[18px] text-[#565e74]">
                      Project <span className="text-[#004ac6]">{project?.project_name}</span>{" "}
                      was initialized by{" "}
                      <span className="font-medium text-[#0b1c30]">
                        Elena Vance
                      </span>
                      .
                    </p>
                  </div>
                </div>
                {/* Timeline Item 2 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center border-2 border-white z-10">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                      bug_report
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] leading-[20px] font-medium">
                        Issue PRJ-001 Created
                      </p>
                      <span className="text-[11px] leading-[14px] text-[#737686]">
                        Oct 3, 2024
                      </span>
                    </div>
                    <p className="text-[13px] leading-[18px] text-[#565e74]">
                      Critical bug "PDF Parser failing on nested tables" was
                      reported by Marcus Chen.
                    </p>
                  </div>
                </div>
                {/* Timeline Item 3 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center border-2 border-white z-10">
                    <span className="material-symbols-outlined text-[#565e74] text-[18px]">
                      person_add
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] leading-[20px] font-medium">
                        Member Added
                      </p>
                      <span className="text-[11px] leading-[14px] text-[#737686]">
                        Oct 5, 2024
                      </span>
                    </div>
                    <p className="text-[13px] leading-[18px] text-[#565e74]">
                      Sarah Jenkins was invited to the project with Viewer
                      permissions.
                    </p>
                  </div>
                </div>
                {/* Timeline Item 4 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center border-2 border-white z-10">
                    <span className="material-symbols-outlined text-green-600 text-[18px]">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] leading-[20px] font-medium">
                        Sprint 1 Initialized
                      </p>
                      <span className="text-[11px] leading-[14px] text-[#737686]">
                        Oct 7, 2024
                      </span>
                    </div>
                    <p className="text-[13px] leading-[18px] text-[#565e74]">
                      Planning phase complete. Sprint 01: Core Architecture
                      started.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#004ac6] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
}