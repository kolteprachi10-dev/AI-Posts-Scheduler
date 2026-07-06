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

// =========================
// CORS Configuration
// =========================
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://ai-posts-scheduler.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests with no origin (Postman, mobile apps, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// =========================
// Routes
// =========================
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", postRoutes);
app.use("/", aiRoutes);

// =========================
// Health Check
// =========================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 AI Google Sheets Post Scheduler API is Running!"
    });
});

// =========================
// Start Scheduler
// =========================
startScheduler();

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
