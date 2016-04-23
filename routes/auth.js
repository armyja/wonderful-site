var auth = require('../controllers/auth');
var db = require('../db');
var express = require('express');
var router = express.Router();

router.use(auth.message);

router.get('/', auth.jump_login);

router.get('/restricted', auth.restrict, auth.restricted);

router.get('/logout', auth.logout);

router.get('/login', auth.login_get);

router.get('/register', auth.register_get);

router.post('/login', auth.login_post);

router.post('/register', db.CheckSameName,db.CheckSameEmail,auth.createHash);

module.exports = router;
