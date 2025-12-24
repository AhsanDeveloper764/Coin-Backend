// const express = require("express")
// const cors = require("cors")
// const dbConnect = require("./db/index")
// const {PORT} = require("./config/index")
// const router = require("./routes/index")
// const cookieParser   = require("cookie-parser");
// const errorHandler = require("./middlewares/errorHandle")

// const app = express();
// app.use(cookieParser());

// // app.use(cors(corsOption))
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       return callback(null, true);
//     },
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

// app.use(express.json({limit:"50mb"}));
// app.use(router)
// app.use("/storage",express.static("storage")) // ye middleware use krkay hum apni imag ko access krsktay hein
// dbConnect()

// app.use(errorHandler)
// // isko humnay end ma isliye registered krwaya hay ku kay jintay bhi middlewares hotay hein wo sequentially run hotay hein
// app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));

const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandle");

const app = express();

app.use(cookieParser());

// ✅ SIMPLE + WORKING CORS
app.use(
  cors({
    origin: "https://coin-frontend-app.onrender.com",
    credentials: true,
  })
);

// ✅ Preflight fix
app.options(
  "*",
  cors({
    origin: "https://coin-frontend-app.onrender.com",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use("/storage", express.static("storage"));
app.use(router);

dbConnect();

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Backend is running on port ${PORT}`)
);


// const corsOption = {
//     credentials:true,
//     origin:['http://localhost:5173']
// }
