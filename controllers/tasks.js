const Task = require("../models/Task");
const { CustomAPIError } = require("../errors/custom-error");

const getAllTasks = async (req, res) => {
	const tasks = await Task.find({ createdBy: req.user.userId });
	res.status(200).json({ tasks, count: tasks.length });
};
const createTask = async (req, res) => {
	const task = await Task.create({ ...req.body, createdBy: req.user.userId });
	res.status(201).json({ task });
};
const getTask = async (req, res, next) => {
	const { id: taskID } = req.params;
	const task = await Task.findOne({
		_id: taskID,
		createdBy: req.user.userId,
	});
	if (!task) {
		throw new CustomAPIError(`No task with id: ${taskID}`, 404);
	}
	res.status(200).json({ task });
};
const deleteTask = async (req, res, next) => {
	const { id: taskID } = req.params;
	const deletedTask = await Task.findOneAndRemove({
		_id: taskID,
		createdBy: req.user.userId,
	});
	if (!deletedTask)
		throw new CustomAPIError(`No task with id: ${taskID}`, 404);
	res.status(200).json({ task: null, status: "success" });
};
const updateTask = async (req, res, next) => {
	const { id: taskID } = req.params;

	const task = await Task.findOneAndUpdate(
		{ _id: taskID, createdBy: req.user.userId },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);
	if (!task) {
		throw new CustomAPIError(`No task with id: ${taskID}`, 404);
	}
	res.status(200).json({ task });
};

module.exports = {
	getAllTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
};
