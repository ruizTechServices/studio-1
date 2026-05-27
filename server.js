import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import apiRouter from "./routes/index.js";
import { requestId, errorHandler } from "./lib/middleware/index.js";
import { recordEventSafely } from "./lib/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(express.static(path.join(__dirname, "app")));
app.use(express.json());
app.use(requestId);

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, "app", "index.html"));
});

app.use("/api", apiRouter);

app.use(errorHandler);

const displayHost =
  HOST === "0.0.0.0" || HOST === "::"
    ? "localhost"
    : HOST;

const displayUrl = `http://${displayHost}:${PORT}`;
const bindUrl = `http://${HOST}:${PORT}`;


app.listen(PORT, HOST, () => {
  console.log(`studio-1 running at ${displayUrl}`);
  console.log(`Bound internally to ${bindUrl}`);

  recordEventSafely({
    level: "success",
    area: "system",
    source: "system",
    phase: "startup",
    action: "server_started",
    message: `studio-1 running at ${displayUrl}`,
    details: {
      port: PORT,
      host: HOST,
      displayUrl,
      bindUrl
    }
  });
});
