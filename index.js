import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import logger from "./src/service/logger.service.js";
import { routes } from "./src/routes/routeManager.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3800;
const HOST = process.env.HOST || "localhost";
const DB_CONNECTION = process.env.CONNECTION;

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://192.168.124.143:3000", // Add the frontend's IP/domain here
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ids"],
};

app.use(cors()); // This allows all origins

// app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", routes);

// Image endpoint
app.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "uploads", filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.error(`File not found: ${filename}`);
      return res.status(404).send("File not found");
    }
    res.sendFile(filepath);
  });
});

// Database connection
const databaseConnection = async () => {
  try {
    await mongoose.connect(DB_CONNECTION, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("Connected to the database.");
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  try {
    await databaseConnection();
    logger.info(`App listening at http://${HOST}:${PORT}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
  }
});
