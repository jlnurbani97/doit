const { where } = require('sequelize');
const { Todo } = require('../models');
const ApiError = require('../utils/ApiError');

// Funzione helper interna per pulire le date (crash aggiornamento)
const sanitizeDate = (date) => {
  if (date === '' || date === 'Invalid date' || date === undefined) {
    return null;
  }
  return date;
};

//Metodo per la creazione Todo
const createTodo = async (
  title,
  description,
  startingDate,
  endingDate,
  userId,
  stateId
) => {
  try {
    const finalStateId = stateId || 1;
    return await Todo.create({
      title,
      description,
      startingDate: sanitizeDate(startingDate),
      endingDate: sanitizeDate(endingDate),
      userId,
      stateId: finalStateId,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError('Hai già un’attività con questo titolo.', 400);
    }
    throw err;
  }
};

//Metodo il recupero dei Todos
const getTodos = async (userId) => {
  return await Todo.findAll({ where: { userId } });
};

//Metodo il recupero di un Todo
const getTodoById = async (userId, todoId) => {
  const todo = await Todo.findOne({
    where: { id: todoId, userId },
  });
  if (!todo) throw new ApiError('Todo non trovato', 404);
  return todo;
};

//Metodo per l'update di un Todo
const updateTodo = async (userId, todoId, fields) => {
  if (typeof fields.title === 'string' && fields.title.trim() === '') {
    throw new ApiError("Il titolo dell'attività non può essere vuoto.", 400);
  }
  //Sanificazione date per evitare crach mysql
  if (fields.startingDate !== undefined) {
    fields.startingDate = sanitizeDate(fields.startingDate);
  }
  if (fields.endingDate !== undefined) {
    fields.endingDate = sanitizeDate(fields.endingDate);
  }
  const todo = await getTodoById(userId, todoId);
  try {
    return await todo.update(fields);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError('Esiste già un’attività con questo titolo.', 400);
    }
    throw err;
  }
};

//Metodo per il delete di un Todo
const deleteTodo = async (userId, todoId) => {
  const todo = await getTodoById(userId, todoId);
  await todo.destroy();
  return true;
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
