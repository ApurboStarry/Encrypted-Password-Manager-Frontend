import "./App.css";
import NavBar from "./components/navbar";
import { Route, Switch } from "react-router-dom";
import AllPasswords from "./components/allPasswords";
import Folders from "./components/folders";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Home from "./components/home"

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <Switch>
          <Route path="/all-passwords" component={AllPasswords} />
          <Route path="/folders" component={Folders} />
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
