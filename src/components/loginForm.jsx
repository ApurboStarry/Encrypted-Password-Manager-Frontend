import React, { Component } from "react";
import { Link } from "react-router-dom";
import Input from "./common/input";

class LoginForm extends Component {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  validate = () => {
    const errors = {};

    const { data } = this.state;
    if (data.email.trim() === "") {
      errors.email = "Email is required";
    }
    if (data.password.trim() === "") {
      errors.password = "Master Password is required";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit();
  };

  doSubmit = () => {
    console.log("Submitted");
  };

  validateProperty = ({ name, value }) => {
    if (name === "email") {
      if (value.trim() === "") return "Email is required";
    }
    if (name === "password") {
      if (value.trim() === "") return "Master Password is required";
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  render() {
    const { data, errors } = this.state;

    return (
      <div style={{ marginLeft: 200, marginRight: 200, marginTop: 50 }}>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="email"
            value={data.email}
            label="Email"
            onChange={this.handleChange}
            error={errors.email}
            type="email"
          />
          <Input
            name="password"
            value={data.password}
            label="Master Password"
            onChange={this.handleChange}
            error={errors.password}
            type="password"
          />
          <button disabled={this.validate()} className="btn btn-primary">
            Login
          </button>
          <div style={{ marginTop: 10 }}>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
