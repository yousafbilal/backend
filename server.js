 HEAD
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // REMOVE this line
      useUnifiedTopology: true, // REMOVE this line
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (Replace with your local MongoDB URL)
mongoose
  .connect("mongodb://localhost:27017/paymentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  paymentMethod: String,
  paymentStatus: { type: String, default: "Pending" },
});

const User = mongoose.model("User", UserSchema);

// 1. User Data Collection & Payment Method Choosing
app.post("/payment", async (req, res) => {
  try {
    const { name, email, paymentMethod } = req.body;
    const newUser = new User({ name, email, paymentMethod });
    await newUser.save();
    res.json({ message: "User data saved, awaiting payment confirmation." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Payment Confirmation (Three-Step Verification)
app.post("/confirm-payment", async (req, res) => {
  try {
    const { email, step } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (step === 1) {
      user.paymentStatus = "Step 1 Verified";
    } else if (step === 2) {
      user.paymentStatus = "Step 2 Verified";
    } else if (step === 3) {
      user.paymentStatus = "Confirmed";
      sendEmail(
        user.email,
        "Payment Successful",
        `Hello ${user.name}, your payment was successful.`
      );
    }

    await user.save();
    res.json({ message: `Payment ${user.paymentStatus}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Email Notification to User
function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-password", // Replace with your email password
    },
  });

  const mailOptions = { from: "your-email@gmail.com", to, subject, text };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent: " + info.response);
  });
}

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
d5c7c48 (Updated payment confirmation logic)
