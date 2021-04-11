import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import folderService from "../apiServices/folderService";
class Folders extends Component {
  state = {
    folders: [],
    showDeleteModal: false,
    showRenameModal: false,
    showAddFolderModal: false,
    folderToBeReanmed: {},
    folderToBeDeleted: {},
    folderToBeAdded: "",
  };
  async componentDidMount() {
    const folders = await folderService.getAllFolders();
    this.setState({ folders, showDeleteModal: false });
  }

  handleCloseButtonOfDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  handleCloseButtonOfRenameModal = () => {
    this.setState({ showRenameModal: false });
  };

  handleCloseButtonOfAddFolderModal = () => {
    this.setState({ showAddFolderModal: false });
  };

  getDeleteFolderModal = () => {
    return (
      <div>
        <Modal
          show={this.state.showDeleteModal}
          onHide={() => this.handleCloseButtonOfDeleteModal()}
        >
          <Modal.Header closeButton style={{ color: "red" }}>
            DELETE
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this folder? Upon deletion, all the
            underlying passwords and files will be deleted.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfDeleteModal()}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                this.handleFolderDelete(this.state.folderToBeDeleted)
              }
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  getRenameFolderModal = () => {
    return (
      <div>
        <Modal
          show={this.state.showRenameModal}
          onHide={() => this.handleCloseButtonOfRenameModal()}
        >
          <Modal.Header closeButton style={{ color: "red" }}>
            Rename
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label
                style={{ paddingLeft: 5 }}
                htmlFor="renameFolder"
                className="form-label"
              >
                Rename this
              </label>
              <input
                onChange={this.handleRenameChange}
                value={this.state.folderToBeReanmed.name}
                name="renameFolder"
                type="text"
                className="form-control"
                id="renameFolder"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfRenameModal()}>
              Close
            </Button>
            <Button variant="success" onClick={() => this.handleFolderRename()}>
              Rename
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  getAddFolderModal = () => {
    return (
      <div>
        <Modal
          show={this.state.showAddFolderModal}
          onHide={() => this.handleCloseButtonOfAddFolderModal()}
        >
          <Modal.Header closeButton style={{ color: "red" }}>
            Add a new folder
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label
                style={{ paddingLeft: 5 }}
                htmlFor="renameFolder"
                className="form-label"
              >
                Enter the name of the folder
              </label>
              <input
                onChange={this.handleAddFolderChange}
                value={this.state.folderToBeAdded}
                name="addFolder"
                type="text"
                className="form-control"
                id="addFolder"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfAddFolderModal()}>
              Close
            </Button>
            <Button variant="success" onClick={() => this.handleAddFolder()}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  handleRenameChange = ({ currentTarget: input }) => {
    const updatedFolder = { ...this.state.folderToBeReanmed };
    updatedFolder.name = input.value;
    this.setState({ folderToBeReanmed: updatedFolder });
  };

  handleAddFolderChange = ({ currentTarget: input }) => {
    const updatedFolder = input.value;
    this.setState({ folderToBeAdded: updatedFolder });
  };

  handleDeleteButtonClick(folder) {
    this.setState({ showDeleteModal: true, folderToBeDeleted: folder });
  }

  handleRenameButtonClick(folder) {
    this.setState({ showRenameModal: true, folderToBeReanmed: folder });
  }

  handleAddFolderButtonClick() {
    this.setState({ showAddFolderModal: true });
  }

  async handleFolderDelete(folder) {
    const originalFolders = this.state.folders;

    const newFolders = this.state.folders.filter((p) => p._id !== folder._id);
    this.setState({ showDeleteModal: false, folders: newFolders });

    try {
      await folderService.deleteFolder(folder._id);
    } catch (ex) {
      this.setState({ folders: originalFolders });
    }
  }

  async handleFolderRename() {
    const originalFolders = this.state.folders;

    let updatedFolders = [];
    for (let i = 0; i < this.state.folders.length; i++) {
      const currentFolder = Object.assign({}, this.state.folders[i]);
      if (this.state.folders[i]._id === this.state.folderToBeReanmed._id) {
        currentFolder.name = this.state.folderToBeReanmed.name;
      }

      updatedFolders.push(currentFolder);
    }

    this.setState({ showRenameModal: false, folders: updatedFolders });

    try {
      await folderService.updateFolder(
        this.state.folderToBeReanmed._id,
        this.state.folderToBeReanmed
      );
    } catch (ex) {
      this.setState({ folders: originalFolders });
    }
  }

  async handleAddFolder() {
    try {
      const newFolder = await folderService.createNewFolder({ name: this.state.folderToBeAdded });
      const oldFolders = this.state.folders;
      console.log("HERE", oldFolders);
      oldFolders.push(newFolder);
      
      this.setState({ folders: oldFolders, showAddFolderModal: false, folderToBeAdded: "" });
    } catch(ex) {
      this.setState({ showAddFolderModal: false });      
    }
  }

  render() {
    return (
      <div>
        {this.getDeleteFolderModal()}
        {this.getRenameFolderModal()}
        {this.getAddFolderModal()}

        <button
          onClick={() => this.handleAddFolderButtonClick()}
          id="addPassword"
          className="btn btn-success"
        >
          Add Folder
        </button>
        {this.state.folders.length === 0 && <h1>No folders to show</h1>}
        {this.state.folders.length > 0 && (
          <div id="passwordTable">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }} scope="col">
                    Folder name
                  </th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.folders.map((folder) => {
                  return (
                    <tr key={folder._id}>
                      <th style={{ textAlign: "center" }} scope="row">
                        <Link to={"/folder-contents/" + folder._id}>{folder.name}</Link>
                      </th>
                      <td>
                        <button
                          onClick={() => this.handleRenameButtonClick(folder)}
                          className="btn btn-warning"
                        >
                          Rename
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => this.handleDeleteButtonClick(folder)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Folders;
