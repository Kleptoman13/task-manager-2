import { TaskModel } from '../models/task.model.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await TaskModel.create({
      userId,
      title,
      description,
      status,
      priority,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority } = req.query;

    const tasks = await TaskModel.findAll(userId, { status, priority });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const fields = req.body;

    const updatedTask = await TaskModel.update(id, userId, fields);

    if (!updatedTask)
      return res
        .status(404)
        .json({ message: 'Task not found or unauthorized' });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTask = await TaskModel.delete(id, userId);

    if (!deletedTask)
      return res
        .status(404)
        .json({ message: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
