import express from "express";
import itemsRouter from "./routes/items.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";

const app = express();

app.use(express.json());

app.use("/api/items", itemsRouter);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
