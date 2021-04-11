import httpService from "../services/httpService";
const { apiUrl } = require("../config.json");

const apiEndpoint = apiUrl + "/folders";

async function getAllFolders() {
  const { data: folders } = await httpService.get(apiEndpoint);
  return folders;
}

async function getFolderById(folderId) {

}

async function createNewFolder(folderBody) {}

async function updateFolder(folderId, folderBody) {}

async function deleteFolder(folderId) {}

const defaultExportObj = {
  getAllFolders,
  getFolderById,
  createNewFolder,
  updateFolder,
  deleteFolder
}

export default defaultExportObj;