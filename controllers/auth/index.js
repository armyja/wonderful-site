var hash = require('./pass').hash;
var db = require('../../db');


// Session-persisted message middleware

exports.message = function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
};


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
    db.userList.findOne({$or: [{name: name},{email:name}]}, function (err, user) {
        if (!user) return fn(new Error('cannot find user'));
        // apply the same algorithm to the POSTed password, applying
        // the hash against the pass / salt, if there is a match we
        // found the user
        hash(pass, user.salt, function (err, hash) {
            if (err) return fn(err);
            if (hash === user.hash) {
                user = {
                    name: user.name
                    , _id: user._id
                };
                return fn(null, user);
            }
            fn(new Error('invalid password'));
        })
    })
}

exports.restrict = function (req, res, next) {
    if (req.session.user || (req.cookies.remember && req.cookies.user)) {
        req.session.user = req.cookies.user;
        res.cookie('remember', 1, {maxAge: 600000});
        next();
    } else {
        req.session.error = '请登录或注册';
        res.redirect('/auth/login');
    }
};

exports.jump_login = function (req, res) {
    res.redirect('/auth/login');
};

exports.restricted = function (req, res) {
    res.send('管理员截获了你的私密信息并将其<a href="./logout">上交国家</a>。若想要泄愤，就在登录页面输入两次 shit ，进去泼粪咯');
};

exports.logout = function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    res.clearCookie('remember', {});
    req.session.destroy(function () {
        res.redirect('./');
    });
};

exports.login_get = function (req, res) {
    if (res.locals.message) {
        res.render('./auth/login', {title: '登录页面', layout: '/auth/layout'});
    } else {
        if (req.session.user || (req.cookies.remember && req.cookies.user)) {
            var user = req.session.user || req.cookies.user;
            res.locals.message = '<p class="msg success">' + '欢迎回来，' + user.name
                + '。 你可以 <a href="./logout">点此退出</a>。'
                + '<br /><br />也可以访问 <a href="./restricted">私密区</a> 或 <a href="/todo">ToDoList</a> 。'
                + '</p>';
        }
        res.render('./auth/login', {title: '登录页面', layout: '/auth/layout'});
    }

};

exports.login_post = function (req, res) {
    authenticate(req.body.name, req.body.password, function (err, user) {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            res.cookie('remember', 1, {maxAge: 600000});
            res.cookie('user', user, {maxAge: 600000});
            req.session.regenerate(function () {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('./login');
            });
        } else {
            req.session.error = '用户名或密码错误';
            res.redirect('back');
        }
    });
};

exports.register_get = function (req, res) {
    res.render('./auth/register', {title: '注册页面'});
};

exports.createHash = function (req, res, next) {
    // when you create a user, generate a salt
    // and hash the password
    hash(req.body.password, function (err, salt, hash) {
        if (err) throw err;
        db.userList.create({
            name: req.body.name
            , email: req.body.email
            , salt: salt
            , hash: hash
        }, (function (err, user) {
            req.session.user = {
                name: user.name
                , _id: user._id
            };
            req.cookies.user = req.session.user;
            res.cookie('remember', 1, {maxAge: 600000});
            req.session.success = '注册成功，请登录';
            res.redirect('./login')
        }));
    });
};
