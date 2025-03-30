import express from 'express';
import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all todos and create a todo
router.route('/').get(getTodos).post(createTodo);

// Get, update, and delete a specific todo
router.route('/:id').get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;