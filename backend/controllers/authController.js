import { hello } from '../services/authService.js';

export const sayHello = (req, res) => {
  const message = hello();
  res.status(200).json({ message });
};
