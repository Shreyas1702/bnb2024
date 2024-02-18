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
	},
	appointment_time: {
        type: String,
        
    },
    date: {
        type: String, // Duration of appointment in minutes
        
    },
    notes: String // Additional notes for the appointment
	,
	link:String,
	duePay:Number,
	Status:Boolean
});

AppointmentSchema.virtual("no", {
	ref: "Patient",
	foreignField: "Patient_id",
	localField: "patient_id"
});

module.exports = mongoose.model("appointment", AppointmentSchema);
