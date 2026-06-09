const express = require("express");
const Task = require("../models/taskModel");
const userAuth = require("../middleware/auth");
const taskRouter = express.Router();

//create new task
taskRouter.post("/", userAuth, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority,
      createdBy: req.user._id,
    });

    await task.save();
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//get all tasks created by logged in users
taskRouter.get("/", userAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//Find task by Id
taskRouter.get("/:id", userAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task Fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//update existing task by id
taskRouter.patch("/:id", userAuth, async (req, res) => {
  try {
    const allowedUpdates = ["title", "description", "status", "priority"];
    const updates = Object.keys(req.body);

    const isValidUpdate = updates.every((field) =>
      allowedUpdates.includes(field),
    );
    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//delete existing task by id
taskRouter.delete("/:id", userAuth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
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

module.exports = taskRouter;
