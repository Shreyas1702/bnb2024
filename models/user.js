const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  pnumber: {
    type: Number,
    required: true,
  },
  tarea: {
    type: Number,
    required: true,
    default: 0,
  },
  tractor: {
    type: Number,
    default: 0,
  },
  plow: {
    type: Number,
    default: 0,
  },
  seeder: {
    type: Number,
    default: 0,
  },
  harvester: {
    type: Number,
    default: 0,
  },
  f_spreader: {
    type: Number,
    default: 0,
  },
  hoe: {
    type: Number,
    default: 0,
  },
  wec: {
    type: Number,
    default: 0,
  },
  wh: {
    type: Number,
    default: 0,
  },
  hff: {
    type: Number,
    default: 0,
  },
  hcm: {
    type: Number,
    default: 0,
  },
  sn: {
    type: Number,
    default: 0,
  },
  hose: {
    type: Number,
    default: 0,
  },
  cv: {
    type: Number,
    default: 0,
  },
  wot: {
    type: Number,
    default: 0,
  },
  wheat: {
    type: Number,
    default: 0,
  },
  corn: {
    type: Number,
    default: 0,
  },
  rice: {
    type: Number,
    default: 0,
  },
  potato: {
    type: Number,
    default: 0,
  },
  tomato: {
    type: Number,
    default: 0,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
