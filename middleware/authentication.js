const jsonwebtoken = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader || !authorizationHeader.startsWith("Bearer "))
		throw new CustomAPIError("Authentication failed.", 401);
	const token = authorizationHeader.split(" ")[1];
	try {
		const decodedPayload = await jsonwebtoken.verify(
			token,
			process.env.JWT_SECRET
		);
		req.user = {
			userId: decodedPayload.userId,
			username: decodedPayload.username,
		};
		next();
	} catch (error) {
		throw new CustomAPIError("Authentication failed.", 401);
	}
};

module.exports = authMiddleware;
