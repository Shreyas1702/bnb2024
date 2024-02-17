const express = require("express");
const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { Bool } = require("mongoose/lib/schema/index");
const slugify = require("slugify");
const validator = require("validator");

const OrderSchema = new mongoose.Schema(
  {
    numCodes: {
      type: Number,
      required: [true, "How many coupons to be generated should be mentioned"],
    },
    redemptionLimit: {
      type: Number,
      required: [true, "Redemption limit should be mentioned"],
    },
    format: {
      type: String,
      enum: ["alphabetic", "alphanumeric", "numeric"],
      required: [true, "Format should be mentioned"],
    },
    type: {
      type: String,
      enum: ["s", "d"],
      required: [true, "Type of the Order should be mentioned"],
    },
    customPrefix: {
      type: String,
      required: [true, "Prefix should be mentioned"],
    },
    applicableTo: {
      type: String,
      required: [true, "A cart or sku should be mentioned"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "amount"],
      required: [true, "A discount-type should be mentioned"],
    },
    discount_number: {
      type: Number,
      required: [true, "A number for percent or amount is required"],
    },
    maxDiscountAmount: {
      type: Number,
      required: [true, "A max discount amount should be mentioned"],
    },
    length: {
      type: Number,
      required: [true, "length of coupon should be mentioned"],
    },
    conditions: {
      type: String,
    },
    Order_at: {
      type: Date,
      value: Date.now(),
    },
    expiry: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
