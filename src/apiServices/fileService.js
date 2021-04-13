import httpService from "../services/httpService";
const { apiUrl } = require("../config.json");

const apiEndpoint = apiUrl + "/files";

async function uploadFile(fileBody) {
  const { data: response } = await httpService.post(apiEndpoint, fileBody);
  return response;
}

const defaultExportObj = {
  uploadFile
};

export default defaultExportObj;
