import TaskModel from "../model/taskModel.js";
import { statusCode, message } from "../../../utils/api.response.js";
import logger from "../../../service/logger.service.js";

//====================== CREATE TASK ======================//
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;
    const userId = req.user.id;

    const taskExists = await TaskModel.findOne({ title, userId });

    if (taskExists) {
      return res.status(statusCode.BAD_REQUEST).json({
        statusCode: statusCode.BAD_REQUEST,
        message: message.taskExists,
      });
    }

    const newTask = new TaskModel({
      title,
      description,
      dueDate,
      status,
      priority,
      userId,
    });
    const savedTask = await newTask.save();

    res.status(statusCode.CREATED).json({
      statusCode: statusCode.CREATED,
      message: message.taskCreated,
      data: savedTask,
    });
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: message.errorCreatingTask,
    });
  }
};

//====================== UPDATE TASK ======================//
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await TaskModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(statusCode.NOT_FOUND).json({
        statusCode: statusCode.NOT_FOUND,
        message: message.taskNotFound,
      });
    }

    res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      message: message.taskUpdated,
      data: updatedTask,
    });
  } catch (error) {
    logger.error(`Error updating task: ${error.message}`);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: message.INTERNAL_SERVER_ERROR,
    });
  }
};

//====================== DELETE TASK ======================//
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(statusCode.NOT_FOUND).json({
        statusCode: statusCode.NOT_FOUND,
        message: message.taskNotFound,
      });
    }

    res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      message: message.taskDeleted,
    });
  } catch (error) {
    logger.error(`Error deleting task: ${error.message}`);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: message.INTERNAL_SERVER_ERROR,
    });
  }
};

//====================== GET TASKS ======================//
export const getTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let tasks;

    if (id) {
      tasks = await TaskModel.findOne({ _id: id, userId });
      if (!tasks) {
        return res.status(statusCode.OK).json({
          statusCode: statusCode.OK,
          message: message.taskNotFound,
        });
      }
    } else {
      tasks = await TaskModel.find({ userId });
    }

    res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      message: id ? message.taskFetched : message.tasksFetched,
      data: tasks,
    });
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: message.errorFetchingTasks,
    });
  }
};
