function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 text-white flex flex-col p-4">

      <h1 className="text-2xl font-bold mb-8">
        ForgeFlow
      </h1>

      <nav className="flex flex-col gap-3">

        <button className="text-left hover:text-blue-400">
          Dashboard
        </button>

        <button className="text-left hover:text-blue-400">
          Projects
        </button>

        <button className="text-left hover:text-blue-400">
          Issues
        </button>

        <button className="text-left hover:text-blue-400">
          Users
        </button>

        <button className="text-left hover:text-blue-400">
          Activity
        </button>

        <button className="text-left hover:text-blue-400">
          Analytics
        </button>

        <button className="text-left hover:text-blue-400">
          AI Planner
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;