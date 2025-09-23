// server.js
const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// Import database connection and routes
const connectionDB = require("./models/db");
const userRouter = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const imageRoute = require("./routes/ImagesRoute");
const blogRoute = require("./routes/BlogRoute");

// Initialize app
const app = express();

// Connect to MongoDB
connectionDB();

// Middleware
app.use(express.json());

// CORS configuration
// Use your frontend URL in production
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Sessions
app.use(
  sessions({
    secret: process.env.SESSION_SECRET || "defaultsecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB URI from env
      ttl: 60 * 60 * 24, // 1 day
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in prod
    },
  })
);

// Routes
app.use("/user", userRouter);
app.use("/", profileRoute);
app.use("/", imageRoute);
app.use("/", blogRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
