const path = require("path");

const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

function getContentTypeForPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return CONTENT_TYPES[extension] ?? "application/octet-stream";
}

module.exports = {
  getContentTypeForPath,
};
