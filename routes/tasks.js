const express = require("express");
const routes = express.Router();

// custom imports
const {
	getAllTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
} = require("../controllers/tasks");

// |> /api/v1/tasks
routes.route("/").get(getAllTasks).post(createTask);

// |> /api/v1/tasks/:id
routes.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = routes;
