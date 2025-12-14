const { State } = require('../models');

//Metodo per il recupero degli Stati
const getAllStates = async () => {
  const states = await State.findAll({ order: [['id', 'ASC']] });
  return states;
};

module.exports = {
  getAllStates,
};
