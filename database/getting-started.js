/**
 * Created by sam on 16-4-18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("we're connected!");
});

var kittySchema = mongoose.Schema({
    name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);

var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

//fluffy.save(function (err, fluffy) {
//    if (err) return console.error(err);
//    fluffy.speak();
//});

Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
})

var blogSchema = new Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    }
});

var Blog = mongoose.model('Blog', blogSchema);
// ready to go!

// define a schema
var animalSchema = new Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

var Animal = mongoose.model('Animal', animalSchema);
var dog = new Animal({ type: 'dog' });

dog.findSimilarTypes(function (err, dogs) {
    console.log(dogs); // woof
});

var Tank = mongoose.model('Animal', animalSchema);


Tank.create({ name: 'bbbbig',type:"aaa" }, function (err, small) {
    console.log(small);
    if (err) return handleError(err);
    // saved!
});

Tank.find({ $or: [
    { type: "aaa" },
    { name: "big" }
]},function (err,res) {
    console.log(res);
});