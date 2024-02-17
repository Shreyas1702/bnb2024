const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const uuid = require("uuid-random"); // npm package for generating UUIDs
const Order = require("../models/Order");
const Coupon = require("./../models/Coupon");
const User = require("./../models/user");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint for generating coupon codes
exports.coupon_gen = catchAsync(async (req, res) => {
  const {
    numCodes,
    redemptionLimit,
    format,
    customPrefix,
    applicableTo,
    discountType,
    discount_number,
    maxDiscountAmount,
    length,
    conditions,
    expiry,
  } = req.body;
  const user = await User.findById(req.user._id);
  console.log(user);
  const order = await Order.create({
    numCodes,
    redemptionLimit,
    format,
    customPrefix,
    type: "s",
    applicableTo,
    discountType,
    discount_number,
    maxDiscountAmount,
    length,
    conditions,
    expiry,
  });

  user.coupon.push(order._id);
  user.save();
  var coupons = [];

  for (let i = 0; i < numCodes; i++) {
    let couponCode;

    if (format === "alphanumeric") {
      couponCode = customPrefix
        ? customPrefix + "-" + uuid().substring(0, length)
        : uuid().substring(0, length); // Add custom prefix if specified and limit the length of the UUID
    } else if (format === "numeric") {
      let code = Math.floor(Math.random() * Math.pow(10, length)).toString();
      couponCode = customPrefix
        ? customPrefix + "-" + code.padStart(length, "0")
        : code.padStart(length, "0"); // Add custom prefix if specified and pad the code with zeros to reach the specified length
    } else if (format === "alphabetic") {
      couponCode = customPrefix
        ? customPrefix + "-" + generateRandomAlphabetic(length)
        : generateRandomAlphabetic(length);
    }

    coupons.push({
      code: couponCode,
      redemptionLimit: order.redemptionLimit,
      applicableTo: order.applicableTo,
      discountType: order.discountType,
      discount_number: order.discount_number,
      maxDiscountAmount,
      Order_id: order._id,
      conditions: order.conditions,
      genarated_at: Date.now(),
      expiry,
    });
  }
  console.log(order);

  coupons = await Coupon.insertMany(coupons);
  console.log(coupons);
  res.redirect("/dashboard");
});
function generateRandomAlphabetic(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.verifyCoupon = catchAsync(async (req, res) => {
  const { coup_id, prod } = req.body;
  console.log(req.params);
  const id = req.params.comp_id;
  const coupon = await Coupon.find({ code: coup_id });
  console.log(coupon);

  if (coupon[0].redemptionLimit <= 0) {
    res.status(404).json({
      message: "Unsuccessful",
      data: "The Coupon has already been used out..",
    });
  } else {
    const user = await User.findById(id);
    const user_orders = user.coupon;
    for (var i = 0; i < user_orders.length; i++) {
      const ud1 = user_orders[i]._id.toString();
      const ud2 = coupon[0].Order_id.toString();
      if (ud1 == ud2) {
        const now = new Date();
        console.log(now.getTime(), coupon[0].expiry);
        if (coupon[0].expiry > now.getTime()) {
          if (prod == coupon[0].applicableTo)
            res.status(200).json({
              message: "Successful",
              data: coupon,
            });
        } else {
          res.status(404).json({
            message: "Unsuccessful",
            data: "The Coupon has already been expired",
          });
        }
      }
    }

    // res.status(404).json({
    //   message: 'Unsuccessful',
    //   data: "The Coupon doesn't exist",
    // })
  }
});

exports.getcoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  const type = order.type;
  if (type == "s") var state = "static";
  else var state = "dynamic";
  const coupons = await Coupon.find({ Order_id: id });
  console.log(coupons);
  res.render("coupon/showcoupon", { coupons, state });
});
exports.confirmcoupon = catchAsync(async (req, res) => {
  const { coup_id } = req.body;
  const id = req.params.comp_id;
  const user = await User.findById(id);
  var coupon = await Coupon.find({ code: coup_id });
  console.log(coupon[0].redemptionLimit);
  if (coupon[0].redemptionLimit > 0) {
    coupon[0].redemptionLimit -= 1;
    coupon = new Coupon(coupon[0]);
    console.log(coupon);
    await coupon.save();
    console.log(user);

    user.coupon_used += 1;
    var user_k = new User(user);
    await user_k.save();
    res.status(200).json({
      message: "Succesffuly",
    });
  } else {
    res.status(404).json({
      message: "Coupon Already been used up...",
    });
  }
});
