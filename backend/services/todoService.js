const { where } = require('sequelize');
const { Todo } = require('../models');

//Metodo per la creazione Todo
//TODO risolvere problema unique, nuova chiave? Come gestisco bene IDOR?

const createTodo = async (
  title,
  description,
  startingDate,
  endingDate,
  userId,
  stateId
) => {
  //findOne con nuova chiave?
  if (stateId === null) {
    stateId = 1;
  }

  return await Todo.create({
    title,
    description,
    startingDate,
    endingDate,
    userId,
    stateId,
  });
};

const getTodos = async (userId) => {
  return await Todo.findAll({ where: { userId } });
};

const getTodoById = async (userId, todoId) => {
  return await Todo.findOne({
    where: { id: todoId, userId },
  });
};

const updateTodo = async (userId, todoId, fields) => {
  const todo = await getTodoById(userId, todoId);
  if (!todo) {
    const error = new Error('Todo non trovato');
    error.status = 404;
    throw error;
  }
  return await todo.update(fields);
};

const deleteTodo = async (userId, todoId) => {
  const todo = await getTodoById(userId, todoId);
  if (!todo) {
    const error = new Error('Todo non trovato');
    error.status = 404;
    throw error;
  }
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
