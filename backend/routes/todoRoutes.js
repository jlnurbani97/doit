const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.post('/', todoController.create);
router.get('/:userId', todoController.getAll);
router.get('/:userId/:todoId', todoController.getOne);
router.put('/:userId/:todoId', todoController.update);
router.delete('/:userId/:todoId', todoController.remove);

module.exports = router;
