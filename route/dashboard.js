const express = require("express");
const router = express.Router();
const users = require("./../controller/userController");

router.route("/").get(users.dashboard);

module.exports = router;
