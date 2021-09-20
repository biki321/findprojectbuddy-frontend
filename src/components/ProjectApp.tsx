import ProfilePage from "./ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/projectApp.css";
import FeedsPage from "./FeedsPage";
import { ProjectsPage } from "./ProjectsPage";

export function ProjectApp() {
  return (
    <div className="project-app">
      <div className="info-panel">mini window</div>
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
      </div>
    </div>
  );
}
