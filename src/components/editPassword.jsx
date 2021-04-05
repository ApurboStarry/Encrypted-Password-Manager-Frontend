import React, { Component } from "react";
import Input from "./common/input";
import httpService from "../services/httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/passwords";

class EditPassword extends Component {
  state = {
    data: { url: "", username: "", password: "" },
    errors: {},
  };

  componentDidMount() {
    const tokens = this.props.location.pathname.split("/");
    const passwordId = tokens[tokens.length - 1];

    console.log(passwordId);
  }
  

  validate = () => {
    const errors = {};

    const { data } = this.state;

    if (data.url.trim() === "") {
      errors.url = "URL is required";
    }
    if (data.username.trim() === "") {
      errors.username = "Username is required";
    }
    if (data.password.trim() === "") {
      errors.password = "Password is required";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      await httpService.post(apiEndpoint, this.state.data);
      this.props.history.push("/passwords");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  validateProperty = ({ name, value }) => {
    if (name === "url") {
      if (value.trim() === "") return "URL is required";
    }
    if (name === "username") {
      if (value.trim() === "") return "Username is required";
    }
    if (name === "password") {
      if (value.trim() === "") return "Password is required";
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
      <div className="formStyle">
        <h1>Edit Password</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="url"
            value={data.url}
            label="url"
            onChange={this.handleChange}
            error={errors.url}
            type="url"
          />
          <Input
            name="username"
            value={data.username}
            label="Username"
            onChange={this.handleChange}
            error={errors.username}
            type="username"
          />
          <Input
            name="password"
            value={data.password}
            label="Password"
            onChange={this.handleChange}
            error={errors.password}
            type="password"
          />
          <button disabled={this.validate()} className="btn btn-primary">
            Edit
          </button>
        </form>
      </div>
    );
  }
}

export default EditPassword;
