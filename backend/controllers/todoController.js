const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../services/todoService');
const logger = require('../utils/Logger.js');

const getIP = (req) => {
  return (
    req.headers['x-forwarded-for'] ||
    req.socket?.remoteAddress ||
    'IP_NOT_FOUND'
  );
};

//Metodo per la gestione della creazione Todo
const create = async (req, res, next) => {
  const IP = getIP(req);
  try {
    const userId = req.userData.userId;
    const { title, description, startingDate, endingDate, stateId } = req.body;
    const todo = await createTodo(
      title,
      description,
      startingDate,
      endingDate,
      userId,
      stateId
    );
    logger.info({
      message: `Todo creato: "${title}" | UserID: ${userId}`,
      ip: IP,
    });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione della restituzione dei Todo
const getAll = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const todos = await getTodos(userId);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione della restituzione di un Todo
const getOne = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const { todoId } = req.params;

    const todo = await getTodoById(userId, todoId);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione dell'aggiornamento di un Todo
const update = async (req, res, next) => {
  const IP = getIP(req);
  try {
    const userId = req.userData.userId;
    const { todoId } = req.params;

    const updated = await updateTodo(userId, todoId, req.body);
    logger.info({
      message: `Todo aggiornato: ID ${todoId} | UserID: ${userId}`,
      ip: IP,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

//Metodo per la gestione dellla cancellazione di un Todo
const remove = async (req, res, next) => {
  const IP = getIP(req);
  try {
    const userId = req.userData.userId;
    const { todoId } = req.params;
    await deleteTodo(userId, todoId);
    logger.warn({
      message: `Todo eliminato: ID ${todoId} | UserID: ${userId}`,
      ip: IP,
    });
    res.json({ message: 'Todo Cancellato' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };
