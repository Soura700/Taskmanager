const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

router.use(bodyParser.json());



const Task = require('../models/Task'); // Adjust the path accordingly

router.post('/tasks/create', async (req, res) => {
  const taskData = req.body;
  try {
    const newTask = await Task.create(taskData);
    res.json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.put('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const updatedTaskData = req.body;
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });
    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
});




module.exports = router;