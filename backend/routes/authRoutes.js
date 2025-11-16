const express = require('express');
const { sayHello } = require('../controllers/authController.js');

const router = express.Router();

router.get('/', sayHello);

module.exports = router;
