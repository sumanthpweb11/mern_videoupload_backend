import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

config({
  path: "./config/config.env",
});

const app = express();

connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    // credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Route Imports
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// ERROR

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something Went Wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// app.get("/", (req, res) =>
//   res.send(
//     `<h1>Server is working click <a href=${process.env.FRONTEND_URL}>here</a></h1>`
//   )
// );

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} `);
});
