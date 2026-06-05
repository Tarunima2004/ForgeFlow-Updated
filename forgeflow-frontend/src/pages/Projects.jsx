import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

// ─── API INTEGRATION LAYER ────────────────────────────────────────────────────
// Replace these with your actual API calls
// e.g. const res = await fetch("/api/projects"); const data = await res.json();

const API = {
  fetchProjects: async () => {
    // TODO: return await fetch("/api/projects").then(r => r.json());
    return MOCK_PROJECTS;
  },
  fetchStats: async () => {
    // TODO: return await fetch("/api/projects/stats").then(r => r.json());
    return MOCK_STATS;
  },
  fetchTimeline: async () => {
    // TODO: return await fetch("/api/projects/timeline").then(r => r.json());
    return MOCK_TIMELINE;
  },
  fetchDeadlines: async () => {
    // TODO: return await fetch("/api/projects/deadlines").then(r => r.json());
    return MOCK_DEADLINES;
  },
  fetchInsights: async () => {
    // TODO: return await fetch("/api/projects/insights").then(r => r.json());
    return MOCK_INSIGHTS;
  },
};

// ─── MOCK DATA (replace with API responses) ───────────────────────────────────

const MOCK_STATS = [
  { id: "total", icon: "inventory_2", label: "Total Projects", value: "24", trend: "12%", trendIcon: "trending_up", trendClass: "text-emerald-600", iconBgClass: "bg-blue-50", iconColorClass: "text-[#2036bd]" },
  { id: "active", icon: "bolt", label: "Active", value: "18", trend: "4", trendIcon: "trending_up", trendClass: "text-blue-600", iconBgClass: "bg-blue-100", iconColorClass: "text-blue-700" },
  { id: "completed", icon: "check_circle", label: "Completed", value: "5", trend: "2", trendIcon: "trending_up", trendClass: "text-emerald-600", iconBgClass: "bg-emerald-100", iconColorClass: "text-emerald-700" },
  { id: "archived", icon: "archive", label: "Archived", value: "1", trend: "0%", trendIcon: null, trendClass: "text-[#454654]", iconBgClass: "bg-[#e0e3e5]", iconColorClass: "text-[#454654]" },
];

const MOCK_PROJECTS = [
  {
    id: 1,
    icon: "code",
    iconBgClass: "bg-blue-50",
    iconColorClass: "text-[#2036bd]",
    name: "API Gateway Refactor",
    meta: "Core Infrastructure • Sarah J.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAa8pNbQMVKR9idOKTqnLG3Ll4NJvjTBkphrREcu13Mwmm7S1P7rXGcmapKuN1DuwhFEL73b8az6NmFv4VSSzTL43ZLylwniN14kZpGkT1FaX_Kxpw4w03SCuvAr4LzFOSYij5SpKR7otlptHNmnsDPtaJH8wrweye9N2ypdFcscftaxj4iL6CdWI9y5GMRzyB1f1WQCeqFWrwucVo77LLPFI5JilpU9NHh2tlLB-lraSmLQ1Hqmoa8_feWEqNgDvGR4R5AMF96IRLS",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBorUyUuKb2l5_a1DrvePw82OGKQ1hXg_XvTakE-HzAA0KeAzH7hw0sqZclmM9nXAz463Lmr8J72Q7lI2r9yHfKtNTUwJis_6dcTwfPEIUETUfXeWBZoIpBA3uIl3TCwh3T_hrT4iwt9aWl4QMGWeK6-vmZZYlh5Z4F7IdcpRztp5lSpNSJ8fMB56ZjXp5xGY56f9DGeCnFCjhhsguDqcYz-frX9AVOkK9nMPnyKafajdHbgdjk9cw_qEUnTu1ouNy4D9eh60x97K2g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoYxB2JxjLbW2WczbHP0v2fACgCjj-mZl7JflXiOOH_oIOq3O6Cc8kMQTDNw277Z9OQypMebaDJUbUkIZAzNRk93-z2jtahc7jTNY_mW8Ixa15vFhMWbjywjX8XHTwOuvaQ5MIy7S4xCDo03RCE5w8QHKYxTcVukFqWKCzk7jDtUKSujBYz3HBeYizbwT3RQs2FovwdCRDDqYAuhStgqd0OE8QBELP2MLzY5nCyLAqcgfmuVZAGklxXhkLwjcQsgMOheSOPV9j--Ja",
    ],
    priority: "Urgent",
    priorityClass: "bg-[#ffdad6] text-[#93000a]",
    statusDotClass: "bg-[#2036bd]",
    statusText: "In Progress",
    progress: 45,
    progressColorClass: "bg-[#2036bd]",
    progressBgClass: "bg-[#e0e3e5]",
  },
  {
    id: 2,
    icon: "palette",
    iconBgClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
    name: "Brand Asset Library",
    meta: "Marketing • Michael K.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIKlmpzbq_Gmto2wYmFuNikaYKvuMUC1JueO3cwh5bt-jr4DKQ6nJRbqgGC3I2XeQG5ghKvozCeOcvotI7zZK0Sg1SDMTleFU-1P_YpswNDP8ZMdvmU2rwCHM82sGujPUlTbIY13a5DyvTpJB7RqZ8_bJ5bjd8XYCgUaS1hcGI3h7ycHtnykJBx_Nqp-jKOwby9C__hXzYTYZ2s1OuhtvYOkneNN9eflVzYzkJqZ8vC3LYAzU2vzwcslrBMil0zBCJlG2mfY8hQep6",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkyUCS9Q_lm7djwrxIAiSraICF0WGvCQMCIA5KHdH6nzibFfrhv16FVIMAIZOEFh1AqP6tIur0zi1QcqFUS8A4F2d6jPksWm4h9lkuEDv6CeBKmMBVYoMV6vT_LMlgvtwa8u5-rm-fqwKx3WKvZ5yO7ji_RdI_BJNGcTs_0SgdyACJH1g8tU6-wG-kh_1wZmpIp8dmVHc7mMgLwq4r2TZLy26frwpig0spOnTJWfclgsWizh_PbiKhASXeS2RPkXkw-36D69FJDdRn",
    ],
    priority: "Medium",
    priorityClass: "bg-[#e0e3e5] text-[#454654]",
    statusDotClass: "bg-emerald-500",
    statusText: "Completed",
    progress: 100,
    progressColorClass: "bg-emerald-500",
    progressBgClass: "bg-emerald-100",
  },
  {
    id: 3,
    icon: "security",
    iconBgClass: "bg-amber-50",
    iconColorClass: "text-amber-600",
    name: "SOC2 Compliance Prep",
    meta: "Security • Janet D.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATugcD7g7g1ctc5EBC3q_m9t43jCUc3I0kCmKVG-5_TxLgsR6xC-UMOC86HQVM0WmPNe_gjKTS7nx7UdiBlX8DPNRcPHPXy6KDNK7n__8ghEXq51L8g9XIyMDbHBuVGSzJJzxt5yQV_VlMbH1VOADg__NMMi6JMZ_6BqGDUok5MkIYOmyidzHnsUm-tooAVBDWWbZAfNxU5rAMf7Sn-1BkWARWbsd6nsOAgHvwOipzfjXxWKuzesJxbK9VhuJUmoknn4myW0vmhOJF",
    ],
    priority: "High",
    priorityClass: "bg-amber-100 text-amber-700",
    statusDotClass: "bg-amber-500",
    statusText: "At Risk",
    progress: 12,
    progressColorClass: "bg-amber-500",
    progressBgClass: "bg-[#e0e3e5]",
  },
];

const MOCK_FEATURED_PROJECTS = [
  {
    id: "f1",
    status: "Healthy",
    statusClass: "bg-emerald-100 text-emerald-700",
    title: "Cloud Infrastructure v2",
    desc: "Scaling Kubernetes clusters across multi-region environments for high availability.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuuBUXncSB62GPMtd-Pzeso93jz20kIBni91dAnFba7NCXxAIjccpq_WMbEguD_941Tg3xQkIPF1nKvZu3xrMrcUp14OKY1pywXsjfzmb3g9pQcCgdVv2TCf6eFAu1Wz85xsqdhXhkg5PPMwqwj5lz-SWCh48DeOsQK_GI5XjVCHDbS5qOEUBtb6In4iKdJTeV0F32DGbfqVYuWBHMtt_i0c5DNYM9rJmJeghamQuRwtGwxXztcXgn6LBs8rard_yYels8LqU7G9Ol",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlAJvFYEiU0PxsEu5eTqBD91p3eBI_DTa0uLd9VOFTVuejoY03NJyOxIrb0Qn8BsL7fgYOeiXYGdWBu1YHou5E27vJntcIGppqFRN2rroeLmDxjoP5GOkfPTDJd0JDWoGRqOSiopjO3R1SbUrikArrfxytvhVGargP2ZwBHsPg1aZAGN-3t-x9ewU1bxYw_QRKVZS6izAu-YkbJedNXMEMsuonQ1cduzu4T27Rg2mG1KPrFsuhrqadmZR0axZlQOLjR7f4-GEyJynS",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFPJpMoKuta4AGzLyzHMF00wquLCIg9XtB7vRQlNkMHC5O2j_EVpijAQp7pd_cPONuLp89FcscfvahS_nNl2MMO2hhVBb9qcpOTEjEpYB29POlzokRnLui85A3JBXFOE7Nx15OE2LHj1L1tFIoCNQ-RaQLpqkRyKDPUN4cm3MFW6eLOB51wek6K_dWvvUf2gkiWenIrLEwtVLpnnPijbszinNETw427b57J87UXVU9NpPy0m7m4c5jKWfOpXZHT1VSYoqkskiHtO63",
    ],
    extra: "+3",
    progress: 78,
    progressColorClass: "bg-[#2036bd]",
  },
  {
    id: "f2",
    status: "At Risk",
    statusClass: "bg-amber-100 text-amber-700",
    title: "Mobile App Redesign",
    desc: "Refreshing the UX/UI for the consumer facing React Native application.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIBt49smiP6XRZ_fjwTg-NhwXdniGzUnsUgetp8rzrJqawQ2n60VKaZOaoiLI395Nx0fW77meI_8A0Im7EAhRUngri7QVbyCKFQYc5zOYSbgnbO0jpGQB19sfqzb61Er_aU_C-9HbfN98H5okjb8TyIpWNGdE9w7IRGdqstgoujBW0ktmucv9WZVgHU0zBW_QUmQ1aWxdnR0AG5KciqhPUN7c28n4yZUS2IqxHKaW4p9BhXm_7RERKMYtl2tZtGbezoigz424d9AfC",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Qepj4QuJ-nIVkHdC9fKp433AfnNq3s5jDowYDGq-gtUxAMmGB-ujQVMkebwDBa0eOyYk7grLloTJqxutq_XAOR_VNNk4yeR2vqYK2ehQLqtl_NME8JqmT6vOulwZYN-EDXYgRHKD07LVNxegiAD9uCsjxIYB0iqnWWh7MJlhPkAsGwsVwO3hz2-G1SCYJHDSmU6R_hKymy2UGtl0faeBqxrxGjvgPop-e-TIt44rQRG2D61hijwvxU0i5h5u7Vdu3HV-K0DU9RwQ",
    ],
    extra: "+12",
    progress: 34,
    progressColorClass: "bg-amber-500",
  },
  {
    id: "f3",
    status: "On Hold",
    statusClass: "bg-blue-100 text-blue-700",
    title: "Security Audit",
    desc: "Annual penetration testing and compliance audit for ISO 27001 certification.",
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1tUZl-O_9WzvNSzeS9cEqoHJu8N4TaVAtx3OfD-_FDPe7iQegs536hRJT9MHoAPUzcQKdeIPdbvAi1HQU4vzajFdv_ESPIkyKqgf1lc29T-rQtdxGG5_7uBb2arLqmEeee4_K3gbIIGdlqZXFbIzfUhhjI9VA9Pa6iLZ-Qq6z409_6V5g2B3SkLwWOSvyDyPUS4YktXCAutAdkCDyM6ki_MqNJWaNBpJ4-y0pxtrSZ6b2E5eruhn0OjAVf0WO5AQVgsDCopCM52q3",
    ],
    extra: null,
    progress: 92,
    progressColorClass: "bg-blue-600",
  },
];

const MOCK_TIMELINE = [
  { id: "t1", dotClass: "bg-[#2036bd]", title: "Sarah Jenkins created FF-402", sub: "API Gateway Refactor • 2 hours ago" },
  { id: "t2", dotClass: "bg-emerald-500", title: 'Project "Brand Assets" completed', sub: "Marketing • 5 hours ago" },
  { id: "t3", dotClass: "bg-amber-500", title: 'Alex R. flagged "Security Audit" as at risk', sub: "Security • Yesterday" },
];

const MOCK_DEADLINES = [
  { id: "d1", name: "Kubernetes Node Update", due: "Due tomorrow, Dec 14", tag: "Urgent", tagClass: "bg-[#ba1a1a] text-white", rowClass: "bg-[#ffdad6]/30 border-[#ffdad6]" },
  { id: "d2", name: "User Feedback Sessions", due: "Due Friday, Dec 16", tag: "Medium", tagClass: "bg-[#e0e3e5] text-[#454654]", rowClass: "border-[#c5c5d7]" },
  { id: "d3", name: "Design QA Review", due: "Due Monday, Dec 19", tag: "Low", tagClass: "bg-[#3e52d5] text-[#d7daff]", rowClass: "border-[#c5c5d7]" },
];

const MOCK_INSIGHTS = {
  totalIssues: 142,
  openItems: 28,
  completion: "84%",
  teamSize: 36,
  health: [
    { label: "Healthy", count: "18 Projects", pct: 75, dotClass: "bg-emerald-500", barClass: "bg-emerald-500" },
    { label: "At Risk", count: "4 Projects", pct: 17, dotClass: "bg-amber-500", barClass: "bg-amber-500" },
    { label: "Delayed", count: "2 Projects", pct: 8, dotClass: "bg-[#ba1a1a]", barClass: "bg-[#ba1a1a]" },
  ],
  aiInsight: {
    project: "Mobile App Redesign",
    message: "Based on velocity over the last 14 days, the {project} project is likely to miss its primary milestone by 4 days. Suggest allocating additional engineering resources from completed projects.",
  },
};


function Icon({ name, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
    >
      {name}
    </span>
  );
}

// ─── FEATURED PROJECT CARD ────────────────────────────────────────────────────

function FeaturedCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white border rounded-xl p-4 transition-all duration-200 cursor-default group ${
        hovered ? "border-[#2036bd]" : "border-[#c5c5d7]"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`${project.statusClass} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
          {project.status}
        </span>
        <button
          className={`text-[#454654] border-none bg-transparent cursor-pointer transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Icon name="more_vert" />
        </button>
      </div>
      <h5 className="text-base font-bold mb-2">{project.title}</h5>
      <p className="text-sm text-[#454654] mb-4 line-clamp-2">{project.desc}</p>
      <div className="flex mb-4">
        {project.members.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="member"
            className="w-8 h-8 rounded-full border-2 border-white"
            style={{ marginLeft: i > 0 ? "-8px" : "0" }}
          />
        ))}
        {project.extra && (
          <div
            className="w-8 h-8 rounded-full bg-[#e0e3e5] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#454654]"
            style={{ marginLeft: "-8px" }}
          >
            {project.extra}
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold tracking-wider">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
          <div
            className={`${project.progressColorClass} h-full rounded-full`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────

function ProjectTableRow({ project, isLast }) {
  return (
    <tr
      className={`hover:bg-[#f2f4f6] transition-colors duration-150 ${
        !isLast ? "border-b border-[#c5c5d7]" : ""
      }`}
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded ${project.iconBgClass} flex items-center justify-center ${project.iconColorClass}`}>
            <Icon name={project.icon} className="text-base" />
          </div>
          <div>
            <p className="font-bold text-sm">{project.name}</p>
            <p className="text-[11px] font-semibold text-[#454654] mt-0.5">{project.meta}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex">
          {project.members.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="member"
              className="w-6 h-6 rounded-full border border-white"
              style={{ marginLeft: i > 0 ? "-6px" : "0" }}
            />
          ))}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${project.priorityClass}`}>
          {project.priority}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="flex items-center gap-1.5 text-sm">
          <span className={`w-2 h-2 rounded-full inline-block ${project.statusDotClass}`} />
          {project.statusText}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className={`w-24 h-1.5 ${project.progressBgClass} rounded-full`}>
          <div
            className={`${project.progressColorClass} h-full rounded-full`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <button className="text-[#454654] hover:text-[#2036bd] border-none bg-transparent cursor-pointer transition-colors duration-150">
          <Icon name="more_horiz" />
        </button>
      </td>
    </tr>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

export default function Projects() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

  // ── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [p, s, t, d, ins] = await Promise.all([
          API.fetchProjects(),
          API.fetchStats(),
          API.fetchTimeline(),
          API.fetchDeadlines(),
          API.fetchInsights(),
        ]);
        setProjects(p);
        setFeaturedProjects(MOCK_FEATURED_PROJECTS); // swap with API when ready
        setStats(s);
        setTimeline(t);
        setDeadlines(d);
        setInsights(ins);
      } catch (err) {
        console.error("Failed to load projects data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ── Derived Data ───────────────────────────────────────────────────────────
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.meta.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2036bd] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#454654] font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
        <Sidebar />
    <Navbar />
    <div className="ml-[240px] pt-14">
      <div className="flex flex-col lg:flex-row gap-0">

        {/* ── LEFT CANVAS ─────────────────────────────────────────────────── */}
        <div className="flex-1 p-6 min-w-0">

          {/* Page Header */}
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-[30px] font-semibold leading-[38px] tracking-tight text-[#191c1e]">
                Projects
              </h2>
              <p className="text-[#454654] mt-1 text-sm">
                Manage and track all projects across your organization
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#757686] rounded text-sm font-medium bg-transparent hover:bg-[#f2f4f6] transition-colors duration-200 cursor-pointer">
                <Icon name="file_download" className="text-[20px]" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2036bd] text-white rounded text-sm font-medium hover:bg-[#3e52d5] shadow-sm transition-colors duration-200 cursor-pointer border-none">
                <Icon name="add" className="text-[20px]" />
                Create Project
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 border border-[#c5c5d7] rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 ${card.iconBgClass} ${card.iconColorClass} rounded-lg flex`}>
                    <Icon name={card.icon} />
                  </div>
                  <span className={`text-[11px] font-bold ${card.trendClass} flex items-center gap-1`}>
                    {card.trendIcon && <Icon name={card.trendIcon} className="text-sm" />}
                    {card.trend}
                  </span>
                </div>
                <p className="text-[12px] font-medium text-[#454654] uppercase tracking-wider">
                  {card.label}
                </p>
                <h3 className="text-2xl font-semibold mt-1">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Featured Projects */}
          <h4 className="text-lg font-semibold mb-4">Featured Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {featuredProjects.map((proj) => (
              <FeaturedCard key={proj.id} project={proj} />
            ))}
          </div>

          {/* Projects Table */}
          <div className="bg-white border border-[#c5c5d7] rounded-xl overflow-hidden mb-6">
            {/* Table Controls */}
            <div className="p-4 border-b border-[#c5c5d7] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="relative w-full md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#454654] flex">
                  <Icon name="search" className="text-base" />
                </span>
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-[#f2f4f6] border-none rounded pl-9 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2036bd]/40"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { icon: "filter_list", label: "Status" },
                  { icon: "person", label: "Owner" },
                  { icon: "sort", label: "Sort" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f4f6] border border-[#c5c5d7] rounded text-[12px] font-medium cursor-pointer hover:bg-[#e6e8ea] transition-colors duration-150"
                  >
                    <Icon name={btn.icon} className="text-base" />
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#eceef0]">
                  <tr>
                    {["Project Name", "Team", "Priority", "Status", "Progress", "Actions"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#454654] ${
                            i === 5 ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((row, idx) => (
                      <ProjectTableRow
                        key={row.id}
                        project={row}
                        isLast={idx === filteredProjects.length - 1}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#454654]">
                        No projects match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 px-4 bg-[#f2f4f6] border-t border-[#c5c5d7] flex justify-between items-center">
              <p className="text-[11px] font-semibold text-[#454654]">
                Showing 1–{filteredProjects.length} of {projects.length} projects
              </p>
              <div className="flex gap-1">
                <button className="p-1.5 border border-[#c5c5d7] rounded bg-transparent cursor-pointer hover:bg-[#e6e8ea] transition-colors">
                  <Icon name="chevron_left" className="text-base" />
                </button>
                <button className="p-1.5 border border-[#c5c5d7] rounded bg-transparent cursor-pointer hover:bg-[#e6e8ea] transition-colors">
                  <Icon name="chevron_right" className="text-base" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline + Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <h4 className="text-base font-bold mb-4">Project Timeline</h4>
              <div
                className="relative"
                style={{
                  paddingLeft: "0",
                }}
              >
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#e0e3e5]" />
                <div className="flex flex-col gap-6">
                  {timeline.map((item) => (
                    <div key={item.id} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${item.dotClass} ring-4 ring-white`}
                      />
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-[11px] font-semibold text-[#454654] mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deadlines */}
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <h4 className="text-base font-bold mb-4">Upcoming Deadlines</h4>
              <div className="flex flex-col gap-3">
                {deadlines.map((d) => (
                  <div
                    key={d.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg ${d.rowClass}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold">{d.name}</p>
                      <p className="text-[11px] font-semibold text-[#454654] mt-0.5">{d.due}</p>
                    </div>
                    <span className={`${d.tagClass} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
                      {d.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR PANEL ──────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 bg-[#eceef0] border-l border-[#c5c5d7] p-4 flex flex-col gap-4">

          {/* Project Insights */}
          {insights && (
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-bold">Project Insights</h5>
                <Icon name="info" className="text-[#454654] text-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: insights.totalIssues, label: "Total Issues", valClass: "text-[#191c1e]" },
                  { val: insights.openItems, label: "Open Items", valClass: "text-[#2036bd]" },
                  { val: insights.completion, label: "Completion", valClass: "text-emerald-600" },
                  { val: insights.teamSize, label: "Team Size", valClass: "text-[#191c1e]" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-[#eceef0] rounded-lg text-center"
                  >
                    <p className={`text-lg font-semibold ${item.valClass}`}>{item.val}</p>
                    <p className="text-[10px] font-bold text-[#454654] uppercase tracking-wider mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Health */}
          {insights && (
            <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
              <h5 className="text-sm font-bold mb-4">Project Health</h5>
              <div className="flex flex-col gap-4">
                {insights.health.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] font-semibold tracking-wider mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full inline-block ${item.dotClass}`} />
                        {item.label}
                      </span>
                      <span>{item.count}</span>
                    </div>
                    <div className="w-full h-2 bg-[#eceef0] rounded-full">
                      <div
                        className={`${item.barClass} h-full rounded-full`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white border border-[#c5c5d7] rounded-xl p-4">
            <h5 className="text-sm font-bold mb-4">Quick Actions</h5>
            <div className="flex flex-col gap-2">
              {[
                { icon: "add_task", label: "Create New Issue", iconBg: "bg-blue-50", iconColor: "text-[#2036bd]" },
                { icon: "person_add", label: "Assign Member", iconBg: "bg-[#d0e1fb]/50", iconColor: "text-[#505f76]" },
                { icon: "analytics", label: "Export Detailed Report", iconBg: "bg-[#ffdbcc]/20", iconColor: "text-[#7e3100]" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-3 w-full p-2.5 rounded-lg border border-[#c5c5d7] hover:bg-[#eceef0] text-sm font-medium transition-colors duration-150 bg-transparent cursor-pointer text-left"
                >
                  <div className={`w-8 h-8 rounded ${action.iconBg} flex items-center justify-center ${action.iconColor}`}>
                    <Icon name={action.icon} className="text-lg" />
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          {insights?.aiInsight && (
            <div className="bg-[#2036bd]/5 border border-[#2036bd]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[#2036bd] mb-2">
                <Icon name="auto_awesome" className="text-[20px]" />
                <h6 className="text-[12px] font-bold uppercase tracking-widest">AI Insight</h6>
              </div>
              <p className="text-sm text-[#1d34ba] leading-relaxed">
                {insights.aiInsight.message.replace(
                  "{project}",
                  ""
                ).split("").slice(0, 0).join("")}
                Based on velocity over the last 14 days, the{" "}
                <strong className="font-bold">{insights.aiInsight.project}</strong> project is
                likely to miss its primary milestone by 4 days. Suggest allocating additional
                engineering resources from completed projects.
              </p>
              <button className="mt-4 w-full py-2 bg-[#2036bd] text-white text-[12px] font-bold rounded hover:opacity-90 transition-opacity cursor-pointer border-none">
                Apply Recommendation
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
    </div>
  );
}