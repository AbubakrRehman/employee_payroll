import express from "express";
import cors from 'cors';
import router from "./routes/index.js";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your exact domain
  optionsSuccessStatus: 200
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  return res.status(200).json({ success: true, message: "Thanks for using @excli/express" });
});

app.use('/api', router);

// Global Error Handling Middleware (Keep this at the very bottom)
app.use((err, req, res, next) => {
  // 1. Default to 500 Internal Server Error if it's an unhandled crash
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 2. Format the response to exactly mirror your ApiResponse blueprint
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

  // return ApiResponse.send(res, statusCode, null, message)
});

export { app };
