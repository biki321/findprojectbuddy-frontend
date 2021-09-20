import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import { ProjectApp } from "./components/ProjectApp";

function App() {
  return (
    <AuthProvider>
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
              <Route path="/app">
                <ProjectApp />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
