const express = require('express')
const couponController = require('./../controller/couponController')
const router = express.Router({ mergeParams: true })

router.route('/verify').post(couponController.verifyCoupon)
router.route('/confirm').post(couponController.confirmcoupon)
module.exports = router
