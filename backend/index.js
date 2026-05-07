require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

const evaluateRoute = require("./routes/evaluate");
const vapiRoute = require("./routes/vapi");

const app = express();
const PORT = process.env.PORT || 4000;

// Allow ALL origins — needed for VAPI webhook to reach us
app.use(cors({ origin: "*" }));

// Must parse JSON before routes
app.use(express.json({ limit: "10mb" }));

// Log every incoming request so we can see if VAPI is hitting us
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} from ${req.headers["x-forwarded-for"] || req.ip}`);
  next();
});

// Rate limit only non-webhook API routes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api/evaluate", limiter);

app.use("/api/evaluate", evaluateRoute);
app.use("/api/vapi", vapiRoute);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mr. Pool Eval server running on port ${PORT}`);
  console.log(`Anthropic key: ${process.env.ANTHROPIC_API_KEY ? "SET" : "NOT SET"}`);
});
