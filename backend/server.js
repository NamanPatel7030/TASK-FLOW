require ("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

// Middleware to handle CORS
app.use(cors(
    {
        origin:process.env.CLIENT_URL || "*",
        methods : ["GET","POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));

//middleware
app.use(express.json());


//Database Connection
connectDB();

//Routes
app.use("/api/auth",authRoutes);

app.use("/api/users",userRoutes);

app.use("/api/tasks",taskRoutes);

app.use("/api/reports",reportRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default API endpoint for testing
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Flow API is running successfully!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: "/api/auth",
            users: "/api/users", 
            tasks: "/api/tasks",
            reports: "/api/reports"
        }
    });
});

// API health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Catch all undefined routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        availableRoutes: ["/", "/api/health", "/api/auth", "/api/users", "/api/tasks", "/api/reports"]
    });
});

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
