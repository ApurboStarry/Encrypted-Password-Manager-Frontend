import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

import httpService from "../services/httpService";
import passwordService from "../apiServices/passwordService";
class AllPasswords extends Component {
  state = { passwords: [], showModal: false, passwordToBeDeleted: {} };
  async componentDidMount() {
    const passwords = await passwordService.getAllPasswords();
    this.setState({ passwords, showModal: false });
    console.log(this.state.passwords);
  }

  handleCloseButtonOfModal = () => {
    console.log("Inside handleCloseButtonOfModal");
    this.setState({ showModal: false });
  };

  getModal = () => {
    return (
      <div>
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleCloseButtonOfModal()}
        >
          <Modal.Header closeButton style={{ color: "red" }}>
            DELETE
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this password?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleCloseButtonOfModal()}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                this.handlePasswordDelete(this.state.passwordToBeDeleted)
              }
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  handleDeleteButtonClick(password) {
    this.setState({ showModal: true, passwordToBeDeleted: password });
  }

  async handlePasswordDelete(password) {
    const originalPasswords = this.state.passwords;

    const newPasswords = this.state.passwords.filter(p => p._id !== password._id);
    this.setState({ showModal: false, passwords: newPasswords });

    try {
      await passwordService.deletePassword(password._id);
    } catch (ex) {
      this.setState({ passwords: originalPasswords });
    }
  }

  render() {
    return (
      <div>
        {this.getModal()}

        <button
          onClick={() => this.props.history.push("/add-password")}
          id="addPassword"
          className="btn btn-success"
        >
          Add Password
        </button>
        {this.state.passwords.length === 0 && <h1>No passwords to show</h1>}
        {this.state.passwords.length > 0 && (
          <div id="passwordTable">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }} scope="col">
                    URL
                  </th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.passwords.map((password) => {
                  return (
                    <tr key={password._id}>
                      <th style={{ textAlign: "center" }} scope="row">
                        {password.url}
                      </th>
                      <td>
                        <button
                          onClick={() => this.props.history.push(`/edit-password/${password._id}`)}
                          className="btn btn-warning"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => this.handleDeleteButtonClick(password)}
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

export default AllPasswords;
