var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '艾米杰的 Express 样品' });
});

module.exports = router;
