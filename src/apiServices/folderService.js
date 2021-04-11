import httpService from "../services/httpService";
const { apiUrl } = require("../config.json");

const apiEndpoint = apiUrl + "/folders";

async function getAllFolders() {
  const { data: folders } = await httpService.get(apiEndpoint);
  return folders;
}

async function getFolderById(folderId) {

}

async function createNewFolder(folderBody) {
  const { data: folder } = await httpService.post(apiEndpoint, folderBody);
  return folder;
}

async function updateFolder(folderId, folderBody) {
  return httpService.put(apiEndpoint + "/" + folderId, { name: folderBody.name });
}

async function deleteFolder(folderId) {
  return httpService.delete(apiEndpoint + "/" + folderId);
}

const defaultExportObj = {
  getAllFolders,
  getFolderById,
  createNewFolder,
  updateFolder,
  deleteFolder
}

export default defaultExportObj;