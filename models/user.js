const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{type: String, required:true},
    username:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: String, required:true}
},{timestamps:true})    

const userModel = mongoose.model("User",userSchema,"user")  //(model,schema,collection)
module.exports = userModel