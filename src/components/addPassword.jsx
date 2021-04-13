import React, { Component } from "react";
import Input from "./common/input";
import { apiUrl } from "../config.json";
import httpService from "../services/httpService";
import folderService from "../apiServices/folderService.js";


const apiEndpoint = apiUrl + "/passwords";

class AddPassword extends Component {
  state = {
    data: { url: "", username: "", password: "", folderId: "" },
    errors: {},
    folders: [],
  };

  async getFolders() {
    const folders = await folderService.getAllFolders();
    console.log("folders", folders);

    for (let i = 0; i < folders.length; i++) {
      if (folders[i].name === "uncategorized") {
        folders[i].name = "";
      }
    }

    folders.sort((a, b) => (a.name.lenght < b.name.length ? 1 : -1));

    return folders;
  }

  async componentDidMount() {
    const folders = await this.getFolders();

    const data = { url: "", username: "", password: "", folderId: folders[0]._id };
    this.setState({ data, folders });
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
        <h1>Add Password</h1>
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
          <div className="form-group">
            <label htmlFor="folderId">Folder</label>
            <select
              name="folderId"
              onChange={this.handleChange}
              id="folderId"
              className="form-control"
              value={this.state.data.folderId}
            >
              <option value="0"></option>
              {this.state.folders.map((folder) => {
                return (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                );
              })}
            </select>
          </div>
          <button disabled={this.validate()} className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default AddPassword;
