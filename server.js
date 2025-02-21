const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));
app.use('/styles', express.static(path.join(__dirname, 'styles.css')));
app.use('/inner', express.static(path.join(__dirname, 'inner.css')));
app.use('/logos', express.static(path.join(__dirname, 'logos')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/validation.js', express.static(path.join(__dirname, 'validation.js')));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


// Routes
// Serve specific HTML pages for direct navigation
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "menu.html"));
});

app.get("/decks", (req, res) => {
  res.sendFile(path.join(__dirname, "decks.html"));
});

app.get("/browse", (req, res) => {
  res.sendFile(path.join(__dirname, "browse.html"));
});

app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "add.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
