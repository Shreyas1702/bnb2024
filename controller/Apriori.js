const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const { FPGrowth } = require('node-fpgrowth')
const uuid = require('uuid-random')
const nodemailer = require('nodemailer')
const Orders = require('./../models/Order')
const Coupon = require('./../models/Coupon')
const sendEmail = require('./../utils/Email')
exports.basket_analysis = catchAsync(async (req, res, next) => {
  console.log(req.body.transactions)
  const { transactions, minSup, discount, company, users } = req.body

  let fpgrowth = new FPGrowth(minSup)

  fpgrowth
    .exec(transactions)
    .then((itemsets) => {
      // Returns an array representing the frequent itemsets.
      console.log(itemsets)

      // Generate association rules from the frequent itemsets.
      let associationRules = generateAssociationRules(itemsets)
      associationRules = associationRules.slice(0, 2)
      //   const seg = (discount[1] - discount[0]) / associationRules.length

      //   console.log(associationRules)
      var k = 0
      associationRules.forEach(async (e) => {
        e.discount = discount
        e.email = users
        e.company = company

        var order = generateOrders(e)

        const result = await Orders.create(order)
        var coupons = []

        for (let i = 0; i < order.numCodes; i++) {
          let couponCode

          if (order.format === 'alphanumeric') {
            couponCode = order.customPrefix
              ? order.customPrefix + '-' + uuid().substring(0, order.length)
              : uuid().substring(0, order.length) // Add custom prefix if specified and limit the length of the UUID
          } else if (order.format === 'numeric') {
            let code = Math.floor(
              Math.random() * Math.pow(10, order.length),
            ).toString()
            couponCode = order.customPrefix
              ? order.customPrefix +
                '-' +
                code.padStart(order.order.length, '0')
              : code.padStart(order.length, '0') // Add custom prefix if specified and pad the code with zeros to reach the specified order.length
          } else if (order.format === 'alphabetic') {
            couponCode = order.customPrefix
              ? order.customPrefix +
                '-' +
                generateRandomAlphabetic(order.length)
              : generateRandomAlphabetic(order.length)
          }

          coupons.push({
            code: couponCode,
            redemptionLimit: order.redemptionLimit,
            applicableTo: order.applicableTo,
            discountType: order.discountType,
            discount_number: order.discount_number,
            maxDiscountAmount: order.maxDiscountAmount,
            Order_id: result._id,
            conditions: order.conditions,
            genarated_at: Date.now(),
            expiry: order.expiry,
          })
        }
        // console.log(coupons, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        await Coupon.insertMany(coupons)

        // Send the email
        await users.forEach((e) => {
          console.log(coupons, '---------------')
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: 'kendall.mccullough55@ethereal.email',
              pass: 'SKYCDfZ7q8UzuSTd5v',
            },
          })
          transporter.sendMail({
            from: 'kendall.mccullough55@ethereal.email',
            to: e,
            subject: 'Hello',
            text: ` Coupon1:
            code:${coupons[0].code},
            redemptionLimit: ${coupons[0].redemptionLimit},
            applicableTo: ${coupons[0].applicableTo},
            discountType:${coupons[0].discountType},
            discount_number:${coupons[0].discount_number},
            maxDiscountAmount:${coupons[0].maxDiscountAmount},
            Order_id:${coupons[0].Order_id},
            conditions:${coupons[0].conditions},
            genarated_at: ${Date.now()},
            expiry:${coupons[0].expiry},
           `,
          })
        })
      })
      // Print the association rules with lift and confidence measures.

      res.status(200).json({ associationRules })
    })
    .catch((err) => {
      console.error(err)
    })
  function generateOrders(e) {
    var sd = ''
    if (e.antecedent[0] == undefined) {
      sd = `${e.consequent[0]}`
    } else if (e.consequent[0] == undefined) {
      sd = `${e.antecedent[0]}`
    } else {
      sd = `${e.antecedent[0]}+${e.consequent[0]}`
    }
    const obj = {
      numCodes: users.length,
      redemptionLimit: 1,
      format: 'alphanumeric',
      customPrefix: `SALE${discount}`,
      applicableTo: `${sd}`,
      discountType: 'percentage',
      discount_number: discount,
      type: 'd',
      maxDiscountAmount: 0,
      length: 8,
      conditions: `Buy this ${sd} and get a discount of ${discount} `,
      expiry: 15,
    }
    return obj
  }

  function generateAssociationRules(itemsets) {
    let associationRules = []

    // Iterate over each frequent itemset.
    for (let i = 0; i < itemsets.length; i++) {
      let itemset = itemsets[i]

      // Generate all possible non-empty subsets of the itemset.
      let subsets = generateSubsets(itemset.items)

      // Iterate over each subset.
      for (let j = 0; j < subsets.length; j++) {
        let subset = subsets[j]

        // Calculate the confidence and lift for the association rule.
        let antecedentSupport = calculateSupport(subset, itemsets)
        let consequentSupport = itemset.support
        let ruleSupport = antecedentSupport
        let confidence = ruleSupport / antecedentSupport
        let lift = confidence / (consequentSupport / itemsets.length)

        // Add the association rule to the list.
        associationRules.push({
          antecedent: subset,
          consequent: itemset.items.filter((x) => !subset.includes(x)),
          support: ruleSupport,
          confidence: confidence,
          lift: lift,
          discount: 0,
          email: '',
          company: '',
        })
      }
    }

    return associationRules
  }

  function generateSubsets(items) {
    let subsets = []

    // Generate all possible non-empty subsets of the itemset.
    for (let i = 1; i < Math.pow(2, items.length); i++) {
      let subset = []

      for (let j = 0; j < items.length; j++) {
        if ((i & Math.pow(2, j)) != 0) {
          subset.push(items[j])
        }
      }

      subsets.push(subset)
    }

    return subsets
  }

  function calculateSupport(items, itemsets) {
    let count = 0

    // Iterate over each transaction and check if it contains the items.
    for (let i = 0; i < itemsets.length; i++) {
      let itemset = itemsets[i]

      if (items.every((x) => itemset.items.includes(x))) {
        count++
      }
    }

    return count
  }
})
