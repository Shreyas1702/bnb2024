const express = require('express')
const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const { Bool } = require('mongoose/lib/schema/index')
const slugify = require('slugify')
const validator = require('validator')

const Couponschema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'A coupon should have code'],
    },
    redemptionLimit: {
      type: Number,
      required: [true, 'A redeem limit is required for a coupon'],
    },
    applicableTo: {
      type: String,
      required: [true, 'cart or sku product should be mentioned'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'amount'],
      required: [true, 'a type should be mentioned perecentage or amount'],
    },
    discount_number: {
      type: Number,
      required: [true, 'A number for percent or amount is required'],
    },
    maxDiscountAmount: {
      type: Number,
      required: [true, 'A max discount amount should be mentioned'],
    },
    conditions: {
      type: String,
    },
    genarated_at: {
      type: Date,
    },
    Order_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
    expiry: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
const Coupon = new mongoose.model('Coupon', Couponschema)
module.exports = Coupon
