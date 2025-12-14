const stateService = require('../services/stateService');

const getStates = async (req, res, next) => {
  try {
    const states = await stateService.getAllStates();
    res.status(200).json(states);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStates,
};
