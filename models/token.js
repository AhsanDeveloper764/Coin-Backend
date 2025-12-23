const mongoose  = require("mongoose")
const {Schema} = mongoose;

const refreshTokenSchema = Schema({
    token:{type: String, required: true},
    userId:{type:mongoose.SchemaTypes.ObjectId, ref:"User"}
},
    {timestamps:true}
)

const refreshModel = mongoose.model("RefreshToken",refreshTokenSchema,"tokens")
module.exports = refreshModel