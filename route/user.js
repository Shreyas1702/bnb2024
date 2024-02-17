const express = require("express");
const router = express.Router();
const users = require("./../controller/userController");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("./../cloudinary");
const upload = multer({ storage });
const axios = require("axios");

router
  .route("/register/patient")
  .get(users.renderRegister)
  .post(users.register);
router
  .route("/register/hosp")
  .get(users.renderRegisterHosp)
  .post(users.registerhosp);
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: true,
      keepSessionInfo: true,
    }),
    users.login
  );

router.get("/logout", users.logout);

router.post("/uploadData", async (req, res) => {
  console.log(req.body.ImgHash);
  console.log(req.user);
  const user = Patient.find({ Patient_id: req.user._id });
  console.log(user);
});

module.exports = router;
