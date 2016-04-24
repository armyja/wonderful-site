// create connection to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wonderful');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

var userListSchema = mongoose.Schema({
    name: {type: String, unique: true}
    , email: {type: String, unique: true}
    , password: {type: String}
    , salt: {type: String}
    , hash: {type: String}
});

var todoListSchema = mongoose.Schema({
    name: {type: String}
    , tag: {type: String}
    , createDate: {type: Date}
    , endDate: {type: Date}
    , content: {type: String}
    , done: {type: Boolean}
    , remainDay: {type: Number}
});

var userList = mongoose.model('users', userListSchema);
var todoList = mongoose.model('todoList', todoListSchema);
exports.userList = userList;
exports.todoList = todoList;

exports.CheckSameName = function (req,res,next) {
    userList.count({name: req.body.name}, function (err, doc) {
        if (doc) {
            req.session.error = '存在相同用户名';
            res.redirect('back');
        } else {
            next();
        }
    });
};

exports.CheckSameEmail = function (req,res,next) {
    userList.count({email: req.body.email}, function (err, doc) {
        if (doc) {
            req.session.error = '存在相同邮箱';
            res.redirect('back');
        } else {
            next();
        }
    });
};

exports.updateUser = function (req,res,next) {
    userList.update({name:req.session.user}, {$set: req.user}, options, callback);
    next();
};

exports.loadUser = function (res,req,next){
    userList.findOne({name: req.session.user},function (err,doc){
        if (err) next(new error('获取用户失败'));
        req.user = doc;
        next();
    })
};