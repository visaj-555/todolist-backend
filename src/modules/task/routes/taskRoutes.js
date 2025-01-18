import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";
import { ensureAuthenticated } from "../../../middlewares/authValidator.js";
import { taskValidation } from "../validation/taskValidator.js";

const Router = express.Router();

Router.post("/task/add", ensureAuthenticated, taskValidation, createTask);
Router.get("/task/view", ensureAuthenticated, getTasks);
Router.get("/task/view/:id", ensureAuthenticated, getTasks);

Router.patch("/task/update/:id", ensureAuthenticated, updateTask);
Router.delete("/task/delete/:id", ensureAuthenticated, deleteTask);

export default Router;
