import React, { useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function LoginPage() {
  const clientId = "1740fb170d3dc741cd02";
  const redirectUri = "http://localhost:3000/login";
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
        // window.history.replaceState({}, "", newUrl[0]);

        const requestData = {
          code: newUrl[1],
        };

        await login(requestData.code, () => {
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
    return <Redirect to={from.pathname} />;
  }

  return (
    <section className="container">
      <div>
        <h1>Welcome</h1>
        <span>Super amazing app</span>
        <div>{authState.error}</div>
        <div className="login-container">
          {authState.isLoading ? (
            <div className="loader-container">
              <div className="loader">Loading</div>
            </div>
          ) : (
            <div>
              {
                // Link to request GitHub access
              }
              <a
                className="login-link"
                href={`https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`}
              >
                <span>Login with GitHub</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
