import React, { Component } from "react";
import { Link } from "react-router-dom";
import Input from "./common/input";
import * as userService from "../services/userService";

class RegisterForm extends Component {
  state = {
    data: { email: "", password: "", confirmPassword: "" },
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

  doSubmit = async () => {
    await userService.register(this.state.data);
  };

  validateProperty = ({ name, value }) => {
    if (name === "email") {
      if (value.trim() === "") return "Email is required";
    }
    if (name === "password") {
      const minimumPasswordLength = 12;
      if (value.length < minimumPasswordLength) return `Master Password should be at least ${minimumPasswordLength} characters long`;
      if(!/\d/.test(value)) return "Master Password should contain atleast one number";
      if(!/[a-z]/.test(value)) return "Master Password should contain atleast one lowercase letter";
      if(!/[A-Z]/.test(value)) return "Master Password should contain atleast one uppercase letter";
    }

    if(name === "confirmPassword") {
      if(value !== this.state.data.password) return "Make sure this matches your master password";
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
        <h1>Register</h1>
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
          <Input
            name="confirmPassword"
            value={data.confirmPassword}
            label="Confirm Master Password"
            onChange={this.handleChange}
            error = {errors.confirmPassword}
            type="password"
          />
          <button disabled={this.validate()} className="btn btn-primary">
            Register
          </button>
          <div style={{ marginTop: 10 }}>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
