const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide a user name."],
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password."],
		trim: true,
	},
});

UserSchema.methods.comparePassword = async function (passwordProvided) {
	const isMatch = await bcryptjs.compare(passwordProvided, this.password);
	return isMatch;
};

UserSchema.methods.generateToken = function () {
	const payload = {
		username: this.username,
		userId: this._id,
	};
	const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
	return token;
};

UserSchema.pre("save", async function () {
	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
