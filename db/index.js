const mongoose = require("mongoose")
const {CONNECTION_STRING} = require("../config/index")
// iso destruncture isliye kra hay ku kay hum isko export 1 object form ma krrha hein

const dbConnect  = async () => {
    try{
        const connect = await mongoose.connect(CONNECTION_STRING)
        console.log(`Database is Connected to host ${connect.connection.host}`);        
    } catch(error) {
        console.log('Error Occured',error);
    }
}

module.exports = dbConnect