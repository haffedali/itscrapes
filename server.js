var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 5555;

// Initialize Express
var app = express();




// here we set up the server to use handlebars as our view engine for html content
var exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");




// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/itscrapes", { useNewUrlParser: true });
app.get('/', function(req,res){
    res.render('scraped')
    // res.sendfile('/index.html')
})
app.get('/scrape', function(req, res) {
    axios.get("http://books.toscrape.com/").then(function(response){
        var $ = cheerio.load(response.data);
        $("article h3").each(function(i, element){
            var result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this).children("a").attr("href");
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle)
                })
                .catch(function(err){
                    return res.json(err);
                })
        })
       res.send("scraped boi")
    })
})
app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.get("/articles/:id", function(req, res){
      db.Article.findOne({_id: req.params.id})
        .populate("comments")
        .then(function(dbArticle){
            // console.log(dbArticle)
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err)
        })
  })

app.post("/articles/:id", function(req, res){
    console.log(req.body)
    db.Comments.create(req.body)
        .then((dbComment)=>{
            return db.Article.findOneAndUpdate({_id:req.params.id},{comments: dbComment._id},{new:true});
        })
        .then((dbArticle)=>{
            res.json(dbArticle)
        })
        .catch((err)=>{
            res.json(err)
        })
})      





app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });