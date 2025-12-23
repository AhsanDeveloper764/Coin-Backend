// const express = require("express")
// const app = express();
// const cors = require("cors")
// const dbConnect = require("./db/index")
// const {PORT} = require("./config/index")
// const router = require("./routes/index")
// const cookieParser   = require("cookie-parser");
// const errorHandler = require("./middlewares/errorHandle")
// const port = process.env.PORT || PORT || 3000;
// // const corsOption = {
// //     credentials:true,
// //     origin:['http://localhost:5173']
// // }

// // app.use(cors(corsOption))
// const corsOptions = {
//   origin: "https://coin-frontend-app.onrender.com",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// // app.options("*", cors(corsOptions)); 

// app.use(express.json({limit:"50mb"}));
// app.use(cookieParser());
// app.get("/", (req, res) => {
//   res.status(200).send("Coin Bounce Backend is Live");
// });
// app.use(router)
// app.use("/storage",express.static("storage")) // ye middleware use krkay hum apni imag ko access krsktay hein
// dbConnect()

// // isko humnay end ma isliye registered krwaya hay ku kay jintay bhi middlewares hotay hein wo sequentially run hotay hein
// app.use(errorHandler)
// app.listen(port, () => {
//   console.log("Server is Running on Port", port);
// });


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./db/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandle");

const app = express();
const port = process.env.PORT || PORT || 3000;

// **CORS configuration**
const corsOptions = {
  origin: "https://coin-frontend-app.onrender.com", // frontend URL
  credentials: true, // required for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// **Handle preflight OPTIONS requests globally**
app.options("*", cors(corsOptions)); 

// JSON and cookies
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Coin Bounce Backend is Live");
});

// Routes
app.use(router);
app.use("/storage", express.static("storage"));

// Database connection
dbConnect();

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log("Server is Running on Port", port);
});
