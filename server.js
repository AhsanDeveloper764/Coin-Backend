const express = require("express")
const app = express();
const cors = require("cors")
const dbConnect = require("./db/index")
const {PORT} = require("./config/index")
const router = require("./routes/index")
const cookieParser   = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandle")

// const corsOption = {
//     credentials:true,
//     origin:['http://localhost:5173']
// }

// app.use(cors(corsOption))
app.use(
    cors({
        origin:function(origin,callback){
            return callback(null,true);
        },
        optionsSuccessStatus:200,
        credentials:true,
    })
)
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(router)
app.use("/storage",express.static("storage")) // ye middleware use krkay hum apni imag ko access krsktay hein
dbConnect()

// isko humnay end ma isliye registered krwaya hay ku kay jintay bhi middlewares hotay hein wo sequentially run hotay hein
app.use(errorHandler)
app.listen(PORT,console.log("Server is Running on Port",PORT))