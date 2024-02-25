const { urlencoded } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const app = express();
const Order = require("./../models/Order");
const User = require("./../models/user");
const Patient = require("./../models/Patient");
const Hospital = require("./../models/Hosp");
const Razorpay = require("razorpay");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
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
    const { username, password, pnumber, area } = req.body;

    // comp_type = 'hosp'
    const user = new User({ area, username, pnumber });

    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.render("coupon/dashboard_user");
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
    const relationship = "doc";
    const user = new User({ email, username, relationship });

    const registeredUser = await User.register(user, password);
    const Hosp_id = registeredUser._id.toString();
    console.log(registeredUser._id);
    console.log(registeredUser._id.toString());
    var appointments = [];
    slot = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];
    const patientData = await Hospital.create({
      doctor_id: Hosp_id,
      email,
      username,
      specialization,
      add,
      phn,
      slot,
    });
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      console.log(req.user);
      res.render("coupon/dashboard", { appointments });
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

module.exports.login = async (req, res) => {
  try {
    // console.log("Hello Inside Login controller");
    // console.log(req.user.relationship);
    if (req.user.relationship === "doc") {
      const user = req.user._id;
      // console.log(req.user);

      // Check if hospital exists

      // Get appointments for the hospital and populate patient
      //  var appointment = await Appointment.find({
      //   hospital_id: user,
      // }).populate('no')
      // var id = appointment[0].patient_id.toString()
      // var patient = await Patient.find({ Patient_id: id })
      // return res.status(200).json({ appoint{ments, patient })
      const hospital_id = await Hospital.findOne({ doctor_id: req.user._id });
      console.log("hospid", hospital_id);
      // Check if hospital exists
      //  hospital = await Hospital.find({ Hosp_id: req.params.hospital_id });
      // if (!hospital) {
      //   return res.status(400).json({ error: "Invalid hospital_id" });
      // }

      // Get appointments for the hospital and populate patient
      const appointments = await Appointment.find({
        hospital_id: hospital_id._id,
      }).populate("no");

      var id;
      var patient;
      var patients = [];
      console.log(appointments.length);
      for (var i = 0; i < appointments.length; i++) {
        id = appointments[i].patient_id.toString();
        console.log(id);
        patient = await Patient.find({ patient_id: id });
        patients.push(patient);
      }
      console.log(patients);
      res.render("coupon/dashboard", { appointments, patients });
    } else {
      res.render("coupon/dashboard_user", { user: req.user });
    }
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

module.exports.payment = async (req, res, next) => {
  console.log("Payment");
  let amount = req.body.amount;

  console.log(amount);
  console.log("payment gateway");
  const instance = new Razorpay({
    key_id: "rzp_test_FMCCYhAfIQ7C1z",
    key_secret: "6r5J9tE1WRjuqz3eNuUxAP9Y",
  });

  const order = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt#1",
  });

  res.status(201).json({
    success: true,
    order,
  });
};

module.exports.save = async (req, res, next) => {
  console.log(req.body.data);
  console.log(req.user);
  try {
    const data = await Appointment.updateOne(
      {
        hospital_id: req.body.data.hospId,
        Patient_id: req.user._id,
      },
      { duePay: 0 }
    );
  } catch (e) {
    console.log("Error");
    console.log(e);
  }
};

module.exports.verify = async (req, res) => {
  console.log("verification");
  console.log(req.body.data);
  const data = req.body.data;
  razorpay_payment_id = data.razorpay_payment_id;
  order_id = data.order_id;
  razorpay_signature = data.signature;
  secret = "6r5J9tE1WRjuqz3eNuUxAP9Y";

  console.log(order_id);
  console.log(razorpay_payment_id);

  body = order_id + "|" + razorpay_payment_id;
  body = body.toString();
  var expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  console.log(expectedSignature);
  console.log(razorpay_signature);
  if (expectedSignature === razorpay_signature) {
    console.log("payment is successful");
  } else {
    console.log("not");
  }

  console.log("razorpay");

  res.status(200).json({
    success: true,
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
  const user = req.user._id;
  console.log(req.user);

  // Check if hospital exists
  var hospital = await Hospital.find({ Hosp_id: user });
  if (!hospital) {
    return res.status(400).json({ error: "Invalid hospital_id" });
  }

  // Get appointments for the hospital and populate patient
  var appointment = await Appointment.find({
    hospital_id: user,
  }).populate("no");
  var id = appointment[0].patient_id.toString();
  var patient = await Patient.find({ Patient_id: id });
  // return res.status(200).json({ appointments, patient })
  const hospital_id = req.user._id;

  // Check if hospital exists
  hospital = await Hospital.find({ Hosp_id: req.params.hospital_id });
  if (!hospital) {
    return res.status(400).json({ error: "Invalid hospital_id" });
  }

  // Get appointments for the hospital and populate patient
  const appointments = await Appointment.find({
    hospital_id: hospital_id,
  }).populate("no");
  var id;
  var patients = [];
  console.log(appointments.length);
  for (var i = 0; i < appointments.length; i++) {
    id = appointments[i].patient_id.toString();

    var patient = await Patient.find({ Patient_id: id });
    patients.push(patient);
  }
  res.render("coupon/dashboard", { appointments, patients });
};
