const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = "./upload";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldDir = path.join(uploadDir, file.fieldname);
    if (!fs.existsSync(fieldDir)) {
      fs.mkdirSync(fieldDir);
    }
    cb(null, fieldDir); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || `.${file.mimetype.split("/")[1]}`;
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;