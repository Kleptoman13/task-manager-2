import express from 'express';

import { protectRoute } from '../middlewares/auth.middleware.js';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller.js';

const router = express.Router();

router.use(protectRoute);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
