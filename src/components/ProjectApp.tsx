import ProfilePage from "./ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/projectApp.css";
import FeedsPage from "./FeedsPage";
import { ProjectsPage } from "./ProjectsPage";
import { CreateProject } from "./CreateProject";
import { MiniInfoPanel } from "./MiniInfoPanel";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCollabRequests } from "./ProjectCollabRequests";

export function ProjectApp() {
  const { authState } = useAuth();
  return (
    <div className="project-app">
      {authState.isAuthenticated ? <MiniInfoPanel /> : <div></div>}

      <div className="central-box">
        <ProtectedRoute path="/app/feeds" exact>
          <FeedsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/profile" exact>
          <ProfilePage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects" exact>
          <ProjectsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects/create" exact>
          <CreateProject />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects/requests" exact>
          <ProjectCollabRequests />
        </ProtectedRoute>
      </div>
    </div>
  );
}
