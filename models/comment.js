const mongoose = require("mongoose")

const {Schema} = mongoose;
const commentSchema = new Schema({
    content:{type: String, required: true},
    blog:{type: mongoose.SchemaTypes.ObjectId, ref:"Blog"},
    author:{type: mongoose.SchemaTypes.ObjectId, ref:"User"}
},
    {timestamps:true}
)

const cmntModel = mongoose.model("Comment",commentSchema,"comments")
module.exports = cmntModel