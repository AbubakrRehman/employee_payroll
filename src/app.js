import express from "express";
import router from "./routes/index.js";

const app = express();

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
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export { app };
