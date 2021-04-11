import httpService from "../services/httpService";
const {apiUrl} = require("../config.json");

const apiEndpoint = apiUrl + "/passwords";

async function getAllPasswords() {
  const { data: passwords } = await httpService.get(apiEndpoint);
  return passwords;
}

async function getPasswordById(passwordId) {
  const {data: password} = await httpService.get(apiEndpoint + "/" + passwordId);
  return password;
}

async function createNewPassword(passwordBody) {

}

async function updatePassword(passwordId, passwordBody) {

}

async function deletePassword(passwordId) {
  return httpService.delete(apiEndpoint + "/" + passwordId);
}

const defaultExportObj = {
  getAllPasswords,
  getPasswordById,
  createNewPassword,
  updatePassword,
  deletePassword
};

export default defaultExportObj;