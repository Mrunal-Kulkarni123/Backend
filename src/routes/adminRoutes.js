const express = require("express");
const User = require("../models/userModel");
const Task = require("../models/taskModel");

const userAuth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const adminRouter = express.Router();

//get all users
adminRouter.get("/users", userAuth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "err.message",
    });
  }
});

//get all tasks
adminRouter.get("/tasks", userAuth, adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "createdBy",
      "firstName lastName email role",
    );

    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//delete task by id
adminRouter.delete("/tasks/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = adminRouter;
