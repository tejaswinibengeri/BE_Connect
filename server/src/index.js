import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./env.js";
import { connectDb } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { tasksRouter } from "./routes/tasks.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: "Server error" });
});

const port = env.PORT;
connectDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect DB", e);
    process.exit(1);
  });

