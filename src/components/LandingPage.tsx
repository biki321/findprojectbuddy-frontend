import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div>Loading</div>;
  }
  console.log("isAuthenticated at lamnd", authState.isAuthenticated);
  if (authState.isAuthenticated) {
    // history.replace("/home");
    return <Redirect to="/app/feeds" />;
  }

  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}
