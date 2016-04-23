var todo = require('../controllers/todo');
var auth = require('../controllers/auth');
var db = require('../db');
var express = require('express');
var router = express.Router();

router.all('*', auth.restrict);

router.get('/', auth.restrict, todo.renderTodo);

router.get('/delete/:id', auth.restrict, todo.deleteTodo);

router.get('/done/:id', auth.restrict, todo.done);

router.get('/undone/:id', auth.restrict, todo.undone);

router.put('/update/:id', auth.restrict, todo.updateTodo);

router.post('/create', auth.restrict, todo.createTodo);

module.exports = router;