var db = require('../../db');

exports.createTodo = function (req, res, next) {
    new db.todoList({
        name: req.session.user
        , tag: req.body.tag
        , content: req.body.content
        , endDate: req.body.endDate
        , createDate: Date.now()
        , done: false
    }).save(function (err) {
        if (err) return next(err);
        res.redirect('back');
    });
};

exports.deleteTodo = function (req, res, next) {
    db.todoList.remove({_id: req.params.id}, function(err) {
        if (err) {
            next(err);
        } else{
            res.redirect('back');
        }
    });
};

exports.renderTodo = function(req,res){
    if (req.session.user) {
        db.todoList.find({name: req.session.user})
            .sort({done: 1, endDate: 1, tag: -1})
            .exec(function (err, todos) {
                if (err) {
                    next(err)
                } else {
                    var time_now = new Date();
                    for (var i = 0; i < todos.length; i++) {
                        todos[i].createYear = todos[i].createDate.getFullYear()%100;
                        todos[i].createMonth = todos[i].createDate.getMonth() + 1;
                        todos[i].createDay = todos[i].createDate.getDate();
                        todos[i].endYear = todos[i].endDate.getFullYear();
                        todos[i].endMonth = todos[i].endDate.getMonth() + 1;
                        todos[i].endDay = todos[i].endDate.getDate();
                        todos[i].remainDay = parseInt((todos[i].endDate - new Date(time_now.toLocaleDateString())) / 1000 / 86400);
                    }
                    res.render('./todo/todo', {
                        username: req.session.user
                        , todos: todos
                        , title: 'Todo List'
                        , layout: '/todo/layout'
                        , time_now: time_now.getFullYear().toString() + (time_now.getMonth()+1).toString() + time_now.getDate().toString()
                        //, tags: db.todoList.find({name: req.session.user}).distinct('tag')
                        //, contents : db.todoList.find({name: req.session.user}).distinct('content')
                    });
                }
            });
    }
};

exports.updateTodo = function(req,res,next){
    db.todoList.update({_id:req.params.id},{$set : {
        tag: req.body.tag
        , content: req.body.content
        , endDate: req.body.endDate
        , done: req.body.done
    }},{},function(err){
        if(err) {
            next(err);
        }else{
            res.redirect('back');
        }
    })
};

exports.done = function(req,res,next){
    db.todoList.update({_id:req.params.id},{$set : {
        done: true
    }},{},function(err){
        if(err) {
            next(err);
        }else{
            res.redirect('back');
        }
    })
};

exports.undone = function(req,res,next){
    db.todoList.update({_id:req.params.id},{$set : {
        done: false
    }},{},function(err){
        if(err) {
            next(err);
        }else{
            res.redirect('back');
        }
    })
};