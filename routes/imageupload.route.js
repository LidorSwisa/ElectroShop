const expres = require("express");
const router = expres.Router();
const multer = require("multer");
const path = require("path");
const imageuploadController = require("../controllers/imageupload.controller.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("file"), imageuploadController.uploadImage);

module.exports = router;