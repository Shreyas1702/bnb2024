const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  comp_type: {
    type: String,
  },
  total_coupon_gen: {
    type: Number,
    default: 0,
  },
  balance_bill: {
    type: Number,
    default: 0,
  },
  coupon_used: {
    type: Number,
    default: 0,
  },
  relationship:{
    type:String,
    enum:['doc','pat'],
    required:[true,'A relationship is important either doctor or patient']
  },
  coupon: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
})

// AssignmentSchema.virtual("no", {
//   ref: "Order",
//   foreignField: "Order._id",
//   localField: "coupon",
//   justOne: true,
// });

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
