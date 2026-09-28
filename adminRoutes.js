const express = require("express");
const auth = require("../controllers/middleware/auth");
const adminOnly = require("../controllers/middleware/adminOnly");
const { listUsers } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, adminOnly, listUsers);

module.exports = router;