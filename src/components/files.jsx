import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

import fileService from "../apiServices/fileService";
import folderService from "../apiServices/folderService";
import encryptPassword from "../securityServices/encryptPassword";
import getAuthKey from "../securityServices/getAuthKey";
import getVaultKey from "../securityServices/getVaultKey";

class Files extends Component {
  state = {
    files: [],
    folders: [],
    folderId: "",
    fileToBeDeleted: {},
    fileToBeMoved: {},
    showDeleteModal: false,
    showMoveModal: false,
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

  encryptText(secretText, password) {
    const dataAsBytes = new TextEncoder("utf-8").encode(secretText);
    const passwordAsBytes = new TextEncoder("utf-8").encode(password);

    let salt, iv;

    window.crypto.subtle.importKey(
      "raw",
      passwordAsBytes,
      "PBKDF2",
      false, 
      ["deriveKey"]
    )
    .then((passwordKey) => {
      salt = window.crypto.getRandomValues(new Uint8Array(32));
      return window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 250000,
          hash: { name: "SHA-256" }
        },
        passwordKey,
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt"]
      );
    })
    .then( aesKey => {
      console.log("aesKey:", aesKey);

      iv = window.crypto.getRandomValues(new Uint8Array(12));
      return window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv
        },
        aesKey,
        dataAsBytes
      );
    })
    .then(encryptedContent => {
      const encryptedBytes = new Uint8Array(encryptedContent);
      // const encryptedPackage = concat(
      //   salt, 
      //   iv, 
      //   encryptedBytes
      // );

      // console.log("salt", salt);
      // console.log("iv", iv);
      // console.log("encryptedBytes", encryptedBytes);

      let encryptedPackage = new Uint8Array([ ...salt, ...iv, ...encryptedBytes]);
      // console.log("encryptedPackage", encryptedPackage);

      const finalOutput = Buffer.from(encryptedPackage).toString("base64");
      console.log("finalOutput", finalOutput);
    })
  }

  // async getVaultKey(email, masterPassword) {
  //   const passwordAsBytes = new TextEncoder("utf-8").encode(email + masterPassword);
  //   const passwordKey = await window.crypto.subtle.importKey(
  //     "raw",
  //     passwordAsBytes,
  //     "PBKDF2",
  //     false, 
  //     ["deriveBits"]
  //   );
  //   const salt = window.crypto.getRandomValues(new Uint8Array(32));
  //   const keyBuffer = await window.crypto.subtle.deriveBits(
  //     {
  //       name: "PBKDF2",
  //       hash: "SHA-256",
  //       salt: salt,
  //       iterations: 250000
  //     },
  //     passwordKey,
  //     256
  //   );

  //   const keyArray = Array.from(new Uint8Array(keyBuffer)); 
  //   console.log("keyArray:", keyArray);
  //   const vaultKey = Buffer.from(keyArray).toString("base64");
  //   console.log("vaultKey:", vaultKey);
  //   console.log(Buffer.from(vaultKey, "base64"));
  // }

  async componentDidMount() {
    const vaultKey = await getVaultKey("hasinapurbo984@gmail.com", "This is a master password");
    console.log("vaultKey:", vaultKey);

    const authKey = await getAuthKey("hasinapurbo984@gmail.com", "This is a master password");
    console.log("authKey:", authKey);

    encryptPassword("Mw5hunZONXGL1m6H3A63TRSRKS7dswxCDLfOAMGkiN8=", "I don't know");

    const files = await fileService.getAllFiles();
    const folders = await this.getFolders();
    this.setState({ files, folders, folderId: folders[0]._id });
  }

  handleCloseButtonOfDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  handleCloseButtonOfMoveModal = () => {
    this.setState({ showMoveModal: false });
  };

  getDeleteModal = () => {
    return (
      <div id="modalMainDiv">
        <Modal
          show={this.state.showDeleteModal}
          onHide={() => this.handleCloseButtonOfDeleteModal()}
        >
          <Modal.Header closeButton style={{ color: "red" }}>
            DELETE
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this file named {this.state.fileToBeDeleted.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfDeleteModal()}>
              Close
            </Button>
            <Button variant="danger" onClick={() => this.handleFileDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  handleFolderChange = ({ currentTarget: input }) => {
    this.setState({ folderId: input.value });
  }

  getMoveModal = () => {
    return (
      <div>
        <Modal
          show={this.state.showMoveModal}
          onHide={() => this.handleCloseButtonOfMoveModal()}
        >
          <Modal.Header closeButton style={{ color: "orange" }}>
            Move
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="folderId">
                Select the folder where you want the file to move
              </label>
              <select
                name="folderId"
                onChange={this.handleFolderChange}
                id="folderId"
                className="form-control"
                value={this.state.folderId}
              >
                {/* <option value="0"></option> */}
                {this.state.folders.map((folder) => {
                  return (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfMoveModal()}>
              Close
            </Button>
            <Button variant="warning" onClick={() => this.handleFileMove()}>
              Move
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  async handleFileDelete() {
    const originalFiles = this.state.files;
    const newFiles = this.state.files.filter(
      (file) => file._id !== this.state.fileToBeDeleted._id
    );

    this.setState({ files: newFiles, showDeleteModal: false });

    try {
      await fileService.deleteFile(this.state.fileToBeDeleted._id);
    } catch (ex) {
      console.log(ex);
      this.setState({ files: originalFiles });
    }
  }

  async handleFileMove() {
    const originalFiles = this.state.files;
    const newFiles = originalFiles.map(file => ({...file}));

    for(let i = 0; i < newFiles.length; i++) {
      if(newFiles[i]._id === this.state.fileToBeMoved._id) {
        newFiles[i].folderId = this.state.folderId;
      }
    }
    this.setState({ files: newFiles, showMoveModal: false });

    try {
      await fileService.editFile(this.state.fileToBeMoved._id, { folderId: this.state.folderId });
    } catch(ex) {
      console.log(ex);
      this.setState({ files: originalFiles });
    }
  }

  handleDeleteButtonClick(file) {
    this.setState({ showDeleteModal: true, fileToBeDeleted: file });
  }

  handleMoveButtonClick(file) {
    this.setState({ showMoveModal: true, fileToBeMoved: file, folderId: file.folderId });
  }

  render() {
    return (
      <div>
        {this.getDeleteModal()}
        {this.getMoveModal()}

        <button
          id="addPassword"
          className="btn btn-success"
          onClick={() => this.props.history.push("/add-file")}
        >
          Add File
        </button>

        {this.state.files.length === 0 && <h1>No file to show</h1>}
        {this.state.files.length > 0 && (
          <div id="passwordTable">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }} scope="col">
                    File name
                  </th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.files.map((file) => {
                  return (
                    <tr key={file._id}>
                      <th style={{ textAlign: "center" }} scope="row">
                        <a
                          style={{ wordWrap: "break-word" }}
                          target="_blank"
                          rel="noreferrer"
                          href={file.location}
                        >
                          {file.name}
                        </a>
                      </th>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => this.handleMoveButtonClick(file)}
                          className="btn btn-warning"
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Move this file to a different folder"
                        >
                          Move
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => this.handleDeleteButtonClick(file)}
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

export default Files;
