const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
	hospital_id: {
		type: Schema.Types.ObjectId,
		ref: "Hosp"
	},
	patient_id: {
		type: Schema.Types.ObjectId,
		ref: "Patient"
	}
});

AppointmentSchema.virtual("no", {
	ref: "Patient",
	foreignField: "Patient_id",
	localField: "patient_id"
});

module.exports = mongoose.model("appointment", AppointmentSchema);
