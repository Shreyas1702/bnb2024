const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    },
  harvester: {
    type: Number,
    required: true,
  },
  tarea: {
    type: Number,
    required: true,
    default: 0,
  },
  activity_name:{
    type:String,
    required:true,
  },
  time:{
    type:Number
  },
  approve_activity:{
type:Boolean,
default:false
  },
  activity_status:{
type:Boolean,
default:false
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
});

module.exports = mongoose.model("Activity", ActivitySchema);
