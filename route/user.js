const express = require("express");
const router = express.Router();
const users = require("./../controller/userController");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("./../cloudinary");
const upload = multer({ storage });
const axios = require("axios");
const Patient = require("./../models/Patient");

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

router.post("/pay", users.payment);
router.post("/pay/verify", users.verify);
router.post("/pay/save", users.save);

router.post("/uploadData", async (req, res) => {
  console.log(req.body.ImgHash);
  console.log(typeof req.user._id);
  const user = await Patient.findOne({ Patient_id: req.user._id });
  console.log(user.wt);
  user.rep.push(req.body.ImgHash);
  user.save();
  res.status(200).json({
    success: "true",
  });
});

module.exports = router;
