var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  stars: {
    type: String
  },
  
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }
});

var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;