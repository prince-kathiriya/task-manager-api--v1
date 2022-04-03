const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide task name."],
		trim: true,
		maxlength: [20, "Name can not be more than 20 characters."],
	},
	completed: {
		type: Boolean,
		default: false,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Please provide userID."],
	},
});

module.exports = mongoose.model("Task", TaskSchema);
