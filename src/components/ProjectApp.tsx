import ProfilePage from "./ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import "../styles/projectApp.css";
import FeedsPage from "./FeedsPage";
import { ProjectsPage } from "./ProjectsPage";
import { CreateProject } from "./CreateProject";
import { useAuth } from "../contexts/AuthContext";
import { ProjectCollabs } from "./ProjectCollabs";
import OthersProfile from "./OthersProfile";
import { AcceptedPage } from "./AcceptedPage";
import { ChatComp } from "./ChatComp";
import NavbarComp from "./NavbarComp";

export function ProjectApp() {
  const { authState } = useAuth();
  return (
    <div className="project-app">
      {authState.isAuthenticated ? <NavbarComp /> : <div></div>}

      <div className="central-box">
        <ProtectedRoute path="/app/feeds" exact>
          <FeedsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/profile" exact>
          <ProfilePage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/profile/:id" exact>
          <OthersProfile />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects" exact>
          <ProjectsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/chat" exact>
          <ChatComp />
        </ProtectedRoute>
        <ProtectedRoute path="/app/accepted" exact>
          <AcceptedPage />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects/create" exact>
          <CreateProject />
        </ProtectedRoute>
        <ProtectedRoute path="/app/projects/:id/requests" exact>
          <ProjectCollabs />
        </ProtectedRoute>
      </div>
    </div>
  );
}
