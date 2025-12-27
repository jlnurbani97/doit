const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

router.post('/', auth, todoController.create);
router.get('/', auth, todoController.getAll);
router.get('/:todoId', auth, todoController.getOne);
router.put('/:todoId', auth, todoController.update);
router.delete('/:todoId', auth, todoController.remove);

module.exports = router;
