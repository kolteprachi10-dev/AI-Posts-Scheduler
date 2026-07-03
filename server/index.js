const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const postRoutes = require("./routes/postRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const startScheduler = require("./services/scheduler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", postRoutes);
app.use("/", aiRoutes);

// Scheduler
startScheduler();

// Health Check
app.get("/", (req, res) => {
    res.send("🚀 AI Google Sheets Post Scheduler Server is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});