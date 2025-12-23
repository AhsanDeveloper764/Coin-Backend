const mongoose = require("mongoose")
// Schema ko destructure kreingay mongoose mai say
const {Schema} = mongoose;
const blogSchema = new Schema({
    title:{type: String, required: true},
    content:{type: String, required:true},
    photoPath:{type: String, required:true},
    author:{type: mongoose.SchemaTypes.ObjectId, ref:"User"}
    // ye author jo hay ye refrence hay means that ye refer kraga users collection ko  
},
 {timestamps:true}
)
const blogModel = mongoose.model("Blog",blogSchema,"blog")
// Blog = modelName
// blog = collectionName
module.exports = blogModel