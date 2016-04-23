var todo = require('../controllers/todo');
var auth = require('../controllers/auth');
var db = require('../db');
var express = require('express');
var router = express.Router();

router.all('*', auth.restrict);

router.get('/', todo.renderTodo);

router.get('/delete/:id', todo.deleteTodo);

router.get('/done/:id', todo.done);

router.get('/undone/:id', todo.undone);

router.put('/update/:id', todo.updateTodo);

router.post('/create', todo.createTodo);

module.exports = router;