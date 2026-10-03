import express from "express";
import cors from "cors";

import vendorRoutes from "./routes/vendor.routes.js";
import documentRoutes from "./routes/document.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Vendor Verification API is running",
  });
});

app.use("/api/vendors", vendorRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/tasks", taskRoutes);

export default app;