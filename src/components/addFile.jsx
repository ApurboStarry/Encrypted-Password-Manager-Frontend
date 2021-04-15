import React, { Component } from "react";
import fileService from "../apiServices/fileService.js";
import folderService from "../apiServices/folderService.js";

class AddFile extends Component {
  state = { fileData: null, folderId: 0, folders: [] };

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
    this.setState({ folders, folderId: folders[0]._id });
  }

  fileChangeHandler = (e) => {
    this.setState({ fileData: e.target.files[0] });
  };

  handleFileUpload = async (e) => {
    e.preventDefault();

    // Handle File Data from the state Before Sending
    const data = new FormData();

    data.append("image", this.state.fileData);
    data.append("folderId", this.state.folderId);
    console.log(data);

    try {
      await fileService.uploadFile(data);
      this.props.history.push("/");
    } catch (ex) {
      console.log(ex);
    }
  };

  handleFolderChange = ({ currentTarget: input }) => {
    this.setState({ folderId: input.value });
  };

  render() {
    return (
      <div className="formStyle">
        <h1 style={{ marginBottom: 20 }}>Upload File</h1>
        <form onSubmit={this.handleFileUpload}>
          <div>
            <input
              class="form-control form-control-lg"
              id="formFileLg"
              type="file"
              onChange={this.fileChangeHandler}
            />
          </div>
          <br />
          <br />

          <div className="form-group" style={{ marginBottom: 40 }}>
            <label htmlFor="folderId">Folder</label>
            <select
              name="folderId"
              onChange={this.handleFolderChange}
              id="folderId"
              className="form-control"
              value={this.state.folderId}
            >
              {this.state.folders.map((folder) => {
                return (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                );
              })}
            </select>
          </div>

          <button className="btn btn-primary">Upload</button>
        </form>
      </div>
    );
  }
}

export default AddFile;
