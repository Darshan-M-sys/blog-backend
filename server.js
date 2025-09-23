const express = require("express");
const app = express();
const cors = require("cors");
const connectionDB = require("./models/db");
const userRouter = require("./routes/userRoute");
require("dotenv").config();
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const profileRoute = require("./routes/profileRoute");
const imageRoute = require("./routes/ImagesRoute");
const blogRoute= require("./routes/BlogRoute");
connectionDB();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(sessions({
  secret: "absadfafaadsadaj",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_KEY,
    ttl: 60 * 60 * 24   
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, 
    httpOnly: true,
    secure: false
  }
}));

// Routers
app.use("/user", userRouter);
app.use("/", profileRoute);
app.use("/",imageRoute)
app.use("/",blogRoute)

app.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${process.env.PORT}`);
});
