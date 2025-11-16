const { hello } = require('../services/authService.js');

const sayHello = (req, res) => {
  const message = hello();
  res.status(200).json({ message });
};

module.exports = { sayHello };
