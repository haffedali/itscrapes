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

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/itscrapes", { useNewUrlParser: true });
app.get('/', function(req,res){
    res.sendfile('/index.html')
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
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });





app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });