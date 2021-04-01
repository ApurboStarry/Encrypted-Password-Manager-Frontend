import "./App.css";
import NavBar from "./components/navbar";
import { Route, Switch } from "react-router-dom";
import AllPasswords from "./components/allPasswords";
import Folders from "./components/folders";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home"

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <Switch>
          <Route path="/all-passwords" component={AllPasswords} />
          <Route path="/folders" component={Folders} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
