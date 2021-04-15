import httpService from "../services/httpService";
const { apiUrl } = require("../config.json");

const apiEndpoint = apiUrl + "/files";

async function getAllFiles() {
  const { data: files } = await httpService.get(apiEndpoint);
  return files;
}

async function getFileById(fileId) {
  const { data: file } = await httpService.get(`${apiEndpoint}/${fileId}`);
  return file;
}

async function uploadFile(fileBody) {
  const { data: response } = await httpService.post(apiEndpoint, fileBody);
  return response;
}

async function editFile(fileId, fileBody) {
  const { data: response } = await httpService.put(
    `${apiEndpoint}/${fileId}`,
    fileBody
  );
  return response;
}

async function deleteFile(fileId) {
  const { data: response } = await httpService.delete(
    `${apiEndpoint}/${fileId}`
  );

  return response;
}

const defaultExportObj = {
  getAllFiles,
  getFileById,
  uploadFile,
  editFile,
  deleteFile
};

export default defaultExportObj;
