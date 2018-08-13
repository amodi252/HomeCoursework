var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    wtj         = require("website-to-json"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require('method-override');


mongoose.connect('mongodb://localhost:27017/todo_app', { useNewUrlParser: true });
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

var todoSchema = new mongoose.Schema({
  text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/todos", function(req, res){
  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
        if(req.xhr){
            res.json(todos);
        } else {
            res.render("todos", {todos: todos});
        }
    }
  })
});

app.get("/motivate", function(req, res){
    //getBatch();
    // console.log("in 1")
    // getBatch (function(allImages) {
    //     console.log(allImages);
        res.render("motivate");
    // });
    //console.log()
});

app.get("/", function(req, res){
  res.redirect("/todos");
});

app.post("/todos", function(req, res){
 req.body.todo.text = req.sanitize(req.body.todo.text);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
        res.json(newTodo);
    }
  });
});

app.get("/todos/:id/edit", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
     res.redirect("/")
   } else {
      res.render("edit", {todo: todo});
   }
 });
});

app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new:true}, function(err, todo){
   if(err){
     console.log(err);
   } else {
       if(req.xhr) {
           console.log(req.params.id, req.body.todo);
           console.log(todo);
           res.json(todo);
       } else {
            res.redirect('/');
       }
   }
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
    res.json(todo);
   }
 });
});

// var arr = [];
// getBatch();
function getBatch (callback) {
    // wtj.extractData('https://quotescover.com/category/quotes-gallery/page/550', {
    //   fields: ['data'],
    //   parse: function($) {
    //     return {
    //       imgs: $(".entry-image").map(function(val) {
    //           return $(this).find('img').attr('src')
    //       }).get()
    //     }
    //   }
    // }).then(function(res) {
    //   // console.log(Object.prototype.toString.call(res));
    //   // console.log("fhdhdfg " + JSON.parse(res)[0].sub);
    //   // return JSON.parse(res);
    //   // console.log(res.data.imgs);
    //   // console.log("Only: " + res.data.imgs[0]);
    //     console.log("in 2");
    //     //callback();
    //     callback(res.data.imgs);
    // })
}

app.listen(3000, function(){
    console.log("Server started on port 3000")
});
