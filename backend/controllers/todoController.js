const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../services/todoService');

//Metodo per la gestione della creazione Todo
const create = async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione della restituzione dei Todo
const getAll = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const todos = await getTodos(userId);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione della restituzione di un Todo
const getOne = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;
    const todo = await getTodoById(userId, todoId);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione dell'aggiornamento di un Todo
const update = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;
    const updated = await updateTodo(userId, todoId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione dellla cancellazione di un Todo
const remove = async (req, res, next) => {
  try {
    const { userId, todoId } = req.params;
    await deleteTodo(userId, todoId);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };
