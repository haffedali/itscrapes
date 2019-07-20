var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    body: String,
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
})

var Comments = mongoose.model("Comments", CommentsSchema);
module.exports = Comments