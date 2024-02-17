const express = require("express");
const couponController = require("./../controller/couponController");
const Apriori = require("./../controller/Apriori");
const router = express.Router({ mergeParams: true });
router.route("/").post(couponController.coupon_gen);
router.route("/orderId/:id").get(couponController.getcoupon);
router.route("/frequent").post(Apriori.basket_analysis);
module.exports = router;
