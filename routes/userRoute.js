const express = require("express");
const bcrypt = require("bcryptjs");
const user = require("../models/userModel");

const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const UserExist = await user.findOne({ email });
    if (UserExist) {
      return res.json({ msg: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new user({ username, email, password: hashPass });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const UserExist = await user.findOne({ email });
    if (!UserExist) {
    return res.json({ msg: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, UserExist.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid password" });
    }

 
    req.session.userId = UserExist._id;
    req.session.username = UserExist.username;

    res.json({ msg: "Login successful!", user: { username: UserExist.username, email: UserExist.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get logged-in user (session check)
userRouter.get("/login", async (req, res) => {
  try {
    const UserId = req.session.userId;

    if (!UserId) {
      return res.status(401).json({ msg: "Login required" });
    }

    const username = req.session.username;
    res.json({ msg: "Welcome", username });
  } catch (error) {
    console.error("Get login error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


userRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.clearCookie("connect.sid");  // remove session cookie
    res.json({ msg: "Logout successful!" });
  });
});

module.exports = userRouter;
