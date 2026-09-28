const express = require("express");
const auth = require("../controllers/middleware/auth");
const upload = require("../controllers/middleware/upload");
const {
  createMaterial,
  uploadTextMaterial,
  getMaterials,
} = require("../controllers/materialController");

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadTextMaterial);
router.post("/", auth, createMaterial);
router.get("/", auth, getMaterials);

module.exports = router;