const { urlencoded } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const app = express();
const Order = require("./../models/Order");
const User = require("./../models/user");
const Patient = require("./../models/Patient");
const Hospital = require("./../models/Hosp");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Appointment = require("./../models/Appointment");

module.exports.renderRegister = (req, res) => {
  res.render("users/finale");
};
module.exports.renderRegisterHosp = (req, res) => {
  res.render("users/hospreg");
};

module.exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, username, password, ht, gen, st, adno, phn, wt, add, zc } =
      req.body;

    // comp_type = 'hosp'
    const user = new User({ email, username });

    const registeredUser = await User.register(user, password);
    const Patient_id = registeredUser._id.toString();
    console.log(registeredUser._id.toString());
    const patientData = await Patient.create({
      Patient_id,
      ht,
      gen,
      st,
      adno,
      phn,
      wt,
      add,
      zc,
    });
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.render("users/photo", { id: Patient_id });
    });
  } catch (e) {
    req.flash("error", `${e.message}`);
    console.log(e);
    res.redirect("/register/patient");
  }
};
module.exports.registerhosp = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, username, password, add, phn, specialization } = req.body;

    const user = new User({ email, username });

    const registeredUser = await User.register(user, password);
    const Hosp_id = registeredUser._id.toString();
    console.log(registeredUser._id);
    console.log(registeredUser._id.toString());
    const patientData = await Hospital.create({
      Hosp_id,
      email,
      username,
      specialization,
      add,
      phn,
    });
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      console.log(req.user);
      res.render("coupon/dashboard");
    });
  } catch (e) {
    req.flash("error", `${e.message}`);
    console.log(e);
    res.redirect("register/hosp");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  try {
    console.log("Hello Inside Login controller");
    console.log(req.user);
    res.render("coupon/dashboard");
  } catch (e) {
    console.log(e);
  }
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Logging Out");
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};

// module.exports.dashboard = async (req, res) => {
//   const user = req.user
//   const users1 = await User.findById(req.user._id).populate('coupon')
//   var total_coupons = 0
//   users1.coupon.forEach((e) => {
//     console.log(total_coupons)
//     total_coupons += e.numCodes
//   })
//   var bill = total_coupons * 3
//   users1.balance_bill = bill
//   var user_k = new User(users1)
//   await user_k.save()
//   const users = await User.findById(req.user._id).populate('coupon')
//   res.render('coupon/dashboard', { users, total_coupons })
// }

module.exports.dashboard = async (req, res) => {
  // const user = req.user._id
  console.log(req.user);

  // // Check if hospital exists
  // const hospital = await Hospital.find({ Hosp_id: user })
  // if (!hospital) {
  //   return res.status(400).json({ error: 'Invalid hospital_id' })
  // }

  // // Get appointments for the hospital and populate patient
  // const appointments = await Appointment.find({
  //   hospital_id: user,
  // }).populate('no')
  // const id = appointments[0].patient_id.toString()
  // const patient = await Patient.find({ Patient_id: id })
  // // return res.status(200).json({ appointments, patient })
  // const hospital_id = req.user._id;

  // // Check if hospital exists
  // const hospital = await Hospital.find({ Hosp_id: req.params.hospital_id });
  // if (!hospital) {
  //   return res.status(400).json({ error: "Invalid hospital_id" });
  // }

  // // Get appointments for the hospital and populate patient
  // const appointments = await Appointment.find({
  //   hospital_id: hospital_id,
  // }).populate("no");
  // var id;
  // var patient;
  // var patients = [];
  // console.log(appointments.length);
  // for (var i = 0; i < appointments.length; i++) {
  //   id = appointments[i].patient_id.toString();

  //   patient = await Patient.find({ Patient_id: id });
  //   patients.push(patient);
  // }
  res.render("coupon/dashboard", { appointments, patients });
};
