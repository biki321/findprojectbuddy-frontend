import React, { useEffect } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/loginPage.css";

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function LoginPage() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECT_URL;
  console.log(" process.env", process.env.REACT_APP_CLIENT_ID);
  const { authState, login } = useAuth();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { from } = location.state || { from: { pathname: "/app/feeds" } };

  useEffect(() => {
    (async () => {
      // After requesting Github access, Github redirects back to your app with a code parameter
      const url = window.location.href;
      const hasCode = url.includes("?code=");

      // If Github API returns the code parameter
      if (hasCode) {
        const newUrl = url.split("?code=");
        window.history.replaceState({}, "", newUrl[0]);

        const requestData = {
          code: newUrl[1],
        };
        console.log("at login page ", from);

        await login(requestData.code, () => {
          console.log("at login func ", from);
          history.replace(from);
        });
      }
    })();
  }, [login]);
  console.log("isAuthenticated", authState.isAuthenticated);

  if (authState.isLoading) {
    return <div>Loading</div>;
  }

  if (authState.isAuthenticated) {
    // console.log("isAuthenticated", authState.isAuthenticated);
    // history.replace("/home");
    console.log("login page authState.isAuthenticated", from);
    return <Redirect to={from.pathname} />;
  }

  return (
    <div className="login-page-div">
      <p>{authState.error}</p>
      <h1>Login</h1>

      <div className="login-container">
        {authState.isLoading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <div>
            {
              // Link to request GitHub access
            }
            <a
              className="login-link"
              href={`https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`}
            >
              Login with GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
