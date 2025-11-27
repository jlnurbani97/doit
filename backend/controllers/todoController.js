const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../services/todoService');

const create = async (req, res) => {
  try {
    const { title, description, startingDate, endingDate, userId, stateId } =
      req.body;
    const todo = await createTodo(
      title,
      description,
      startingDate,
      endingDate,
      userId,
      stateId
    );
    res.status(201).json(todo);
    console.log('[TODO CREATED]: ', todo.title, todo.id);
  } catch (err) {
    console.error(err);
    console.error(
      `[TODO CREATION FAILED]: Message: ${error.message} Status: ${error.status}`
    );
    res.status(error.status || 500).json({ error: error.message });
  }
};

//Da gestire meglio probabilmente
const getAll = async (req, res) => {
  try {
    const { userId } = req.params;
    const todos = await getTodos(userId);
    res.status(200).json(todos);
    console.log('[TODOS RETURNED]: ', todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching todos' });
  }
};

const getOne = async (req, res) => {
  try {
    const { userId, todoId } = req.params;
    const todo = await getTodoById(userId, todoId);
    res.status(200).json(todo);
    console.log('[TODO RETURNED]: ', todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching todo' });
  }
};

const update = async (req, res) => {
  try {
    const { userId, todoId } = req.params;
    const updated = await updateTodo(userId, todoId, req.body);
    if (!updated)
      return res.status(error.status || 404).json({ error: error.message });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating todo' });
  }
};

const remove = async (req, res) => {
  try {
    const { userId, todoId } = req.params;
    const deleted = await deleteTodo(userId, todoId);
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting todo' });
  }
};
module.exports = { create, getAll, getOne, update, remove };
