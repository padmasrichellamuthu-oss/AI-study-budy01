const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".txt" || file.mimetype === "text/plain") {
    return callback(null, true);
  }

  callback(new Error("Ippo .txt file mattum upload panna mudiyum"));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;