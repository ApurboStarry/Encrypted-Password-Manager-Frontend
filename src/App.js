import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/navbar";
import AllPasswords from "./components/allPasswords";
import Folders from "./components/folders";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Home from "./components/home";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AddPassword from "./components/addPassword";
import EditPassword from "./components/editPassword";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <NavBar user={user} />
        <ToastContainer />
        <div className="content">
          <Switch>
            <ProtectedRoute path="/passwords" component={AllPasswords} />
            <ProtectedRoute path="/folders" component={Folders} />
            <ProtectedRoute path="/add-password" component={AddPassword} />
            <ProtectedRoute path="/edit-password" component={EditPassword} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
