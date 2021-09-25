import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import { ProjectApp } from "./components/ProjectApp";
import { AxiosInterceptContextProvider } from "./contexts/AxiosInterceptContext";
import { SocketContextProvider } from "./contexts/SocketContext";

function App() {
  return (
    <AuthProvider>
      <SocketContextProvider>
        <BrowserRouter>
          <div className="App">
            <div className="content">
              <Switch>
                <Route path="/" exact>
                  <LandingPage />
                </Route>
                <Route path="/login" exact>
                  <LoginPage />
                </Route>
                <AxiosInterceptContextProvider>
                  <Route path="/app">
                    <ProjectApp />
                  </Route>
                </AxiosInterceptContextProvider>
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </SocketContextProvider>
    </AuthProvider>
  );
}

export default App;
