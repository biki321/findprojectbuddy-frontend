import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import coworking from "../static/svg/Co-working_re_w93t.svg";
import "../styles/landingPage.css";
import Spinner from "react-bootstrap/esm/Spinner";

export default function LandingPage() {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
    // return <Spinner animation="border" variant="primary" />;
  }
  console.log("isAuthenticated at lamnd", authState.isAuthenticated);
  if (authState.isAuthenticated) {
    // history.replace("/home");
    return <Redirect to="/app/feeds" />;
  }

  return (
    <div className="landinPage-div">
      <h4 className="brand-name">
        <Link to="/app/feeds">findProjectBuddy</Link>
      </h4>
      <div className="middle-content">
        <div className="product-moto">
          <h1 id="title">Find Your</h1>
          <h1 id="title">Project</h1>
          <h1 id="title"> Partner.</h1>
          <p id="descripton">
            Don't procrastinate over thinking where to find a developer to
            collaborate with to build a project.Whether you are a student
            wanting to build something, or professional with a good idea. Use
            findProjectBuddy to find your buddy.
          </p>
          <Link className="login-btn" to="/login">
            Sign In
          </Link>
        </div>
        <div className="product-illus">
          <img src={coworking} alt="co-working" />
        </div>
      </div>
    </div>
  );
}
