import asyncHandler from 'express-async-handler';
import Todo from '../models/todoModel.js';

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(todos);
});

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const todo = await Todo.create({
    text,
    user: req.user._id,
    isChecked: false,
    trash: false,
  });

  res.status(201).json(todo);
});

// @desc    Get a specific todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // Check if the todo belongs to the logged in user
  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this todo');
  }

  res.json(todo);
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // Check if the todo belongs to the logged in user
  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this todo');
  }

  // Update todo
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // Check if the todo belongs to the logged in user
  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this todo');
  }

  await todo.deleteOne();
  res.json({ id: req.params.id, message: 'Todo removed' });
});

export { getTodos, createTodo, getTodoById, updateTodo, deleteTodo };