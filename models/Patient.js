const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const PatientSchema = new Schema({
  ht: {
    type: Number,
    required: [true, "Plz provide Height"],
  },
  gen: {
    type: String,
    enum: ["M", "F", "O"],
    required: [true, "plz provide gender"],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  st: {
    type: String,
    required: [true, "plz provide state"],
  },
  adno: {
    type: Number,
    required: [true, "plz provide aadhar no"],
  },
  phn: {
    type: Number,
    required: [true, "plz provide phone no"],
  },
  wt: {
    type: Number,
    required: [true, "Plz provide weight"],
  },
  add: {
    type: String,
    required: [true, "plz provide address"],
  },
  rep: [
    {
      type: String,
    },
  ],
  zc: {
    type: Number,
    required: [true, "A pin code is required"],
  },
  photo: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  Patient_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// AssignmentSchema.virtual("no", {
//   ref: "Order",
//   foreignField: "Order._id",
//   localField: "coupon",
//   justOne: true,
// });

// PatientSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Patient", PatientSchema);
