import {BrowserRouter,Routes,Route,} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import Users from "./pages/Users";
import Activity from "./pages/Activity";
import Analytics from "./pages/Analytics";
import AIPlanner from "./pages/AIPlanner";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import UserDashboard from "./pages/UserDashboard";
import ProjectWorkspaceManager from "./pages/ProjectWorkspaceManager";
import ProjectWorkspaceMember from "./pages/ProjectWorkspaceMember";
import ManagerIssues from "./pages/ManagerIssues";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route
  path="/user-dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager-workspace/:projectId"
  element={
    <ProtectedRoute>
      <ProjectWorkspaceManager />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager-workspace/:projectId/issues"
  element={
    <ProtectedRoute>
      <ManagerIssues />
    </ProtectedRoute>
  }
/>
<Route
  path="/member-workspace/:projectId"
  element={
    <ProtectedRoute>
      <ProjectWorkspaceMember />
    </ProtectedRoute>
  }
/>
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route

         path="/projects/:projectId"

         element={<ProjectWorkspace/>}

        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-planner"
          element={
            <ProtectedRoute>
              <AIPlanner />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;