const { where } = require('sequelize');
const { Todo } = require('../models');
const ApiError = require('../utils/ApiError');

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

//Metodo il recupero dei Todos
//Da gestire accesso non autorizzato (IDOR)? 403?
const getTodos = async (userId) => {
  return await Todo.findAll({ where: { userId } });
};

//Metodo il recupero di un Todo
//Da gestire accesso non autorizzato (IDOR)? 403?
const getTodoById = async (userId, todoId) => {
  const todo = await Todo.findOne({
    where: { id: todoId, userId },
  });
  if (!todo) throw new ApiError('Todo non trovato', 404);
  return todo;
};

//Metodo per l'update di un Todo
//Da gestire accesso non autorizzato (IDOR)? 403?
const updateTodo = async (userId, todoId, fields) => {
  const todo = await getTodoById(userId, todoId);
  return await todo.update(fields);
};

//Metodo per il delete di un Todo
//Da gestire accesso non autorizzato (IDOR)? 403?
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
