const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = schema({wine_id: Number, comment: String});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;