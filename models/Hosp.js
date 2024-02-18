const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const DocSchema = new Schema({
  doctor_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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

  phn: {
    type: Number,
    required: [true, "plz provide phone no"],
  },

  add: {
    type: String,
    required: [true, "plz provide address"],
  },

  specialization: {
    type: String,
    required: [true, "plz provide Specialization"],
  },

  tptat: {
    type: Number,
    default: 0,
  },

  ptscd: {
    type: Number,
    default: 0,
  },
  slot: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
});

DocSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Hosp", DocSchema);
