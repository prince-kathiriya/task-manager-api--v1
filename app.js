const express = require("express");
require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

// custom imports
const connectDB = require("./db/connect");
const tasks = require("./routes/tasks");
const auth = require("./routes/auth");
const noteFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");

const app = express();

// Extra security
app.set("trust proxy", 1);
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json());
app.use(express.static("./public"));
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/tasks", authMiddleware, tasks);
app.use("/api/v1/auth", auth);

app.use(noteFound);
// place it at the end
app.use(errorHandlerMiddleware);

// SET PORT=4080 && npm start
const PORT = process.env.PORT || "3000";
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(
			PORT,
			console.log(`Server is up and running on port ${PORT}...`)
		);
	} catch (err) {
		console.log(err);
	}
};
start();
