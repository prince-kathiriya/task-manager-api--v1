const jsonwebtoken = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/User");

const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		throw new CustomAPIError("Please provide username and password.", 400);
	if (username.trim() === "" || password.trim() === "")
		throw new CustomAPIError(
			"Username and Password can not be empty.",
			400
		);
	const user = await User.findOne({ username });
	if (!user)
		throw new CustomAPIError(
			`No user found with username: ${username}`,
			400
		);
	const isMatch = await user.comparePassword(password);
	if (!isMatch) throw new CustomAPIError("Invalid credentials.", 401);
	const token = user.generateToken();
	res.status(200).json({ username: user.username, token });
};
const register = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		throw new CustomAPIError("Please provide username and password.", 400);
	if (username.trim() === "" || password.trim() === "")
		throw new CustomAPIError(
			"Username and Password can not be empty.",
			400
		);
	const user = await User.create(req.body);
	const token = user.generateToken();
	res.status(200).json({ username: user.username, token });
};
module.exports = {
	login,
	register,
};
