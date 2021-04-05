function init() {}

function log(error) {
  console.error(error);
}

const defaultExportObj = {
  init,
  log,
};
export default defaultExportObj;
